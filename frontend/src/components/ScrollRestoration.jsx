import { useEffect, useLayoutEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

const STORAGE_KEY = "scroll-positions";
const RESTORE_TIMEOUT = 4000;
const RESTORE_FRAME_DELAY = 16;

function getRouteKey(location) {
  return `${location.pathname}${location.search}${location.hash}`;
}

function getHistoryKey(location) {
  return location.key || getRouteKey(location);
}

function getScrollPosition() {
  return {
    x: window.scrollX || window.pageXOffset || 0,
    y: window.scrollY || window.pageYOffset || 0,
  };
}

function readPositions() {
  try {
    const storedPositions = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "{}");

    if (storedPositions.byHistoryKey || storedPositions.byRoute) {
      return {
        byHistoryKey: storedPositions.byHistoryKey || {},
        byRoute: storedPositions.byRoute || {},
      };
    }

    return {
      byHistoryKey: {},
      byRoute: storedPositions,
    };
  } catch {
    return {
      byHistoryKey: {},
      byRoute: {},
    };
  }
}

function savePosition(historyKey, routeKey, position = getScrollPosition()) {
  try {
    const positions = readPositions();

    positions.byHistoryKey[historyKey] = position;
    positions.byRoute[routeKey] = position;

    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(positions));
  } catch {
    // Ignore storage failures so navigation never breaks.
  }
}

function readPosition(historyKey, routeKey, allowRouteFallback = false) {
  const positions = readPositions();
  return (
    positions.byHistoryKey[historyKey] ||
    (allowRouteFallback ? positions.byRoute[routeKey] : undefined)
  );
}

function getMaxScrollY() {
  const scrollingElement = document.scrollingElement || document.documentElement;
  return Math.max(0, scrollingElement.scrollHeight - window.innerHeight);
}

function restorePosition(position) {
  const startedAt = performance.now();
  let frameId;

  const scroll = () => {
    window.scrollTo(position.x, position.y);

    const currentY = Math.round(window.scrollY || window.pageYOffset || 0);
    const canReachTarget = getMaxScrollY() >= position.y;
    const restored = Math.abs(currentY - position.y) <= 1;
    const timedOut = performance.now() - startedAt > RESTORE_TIMEOUT;

    if (!restored && !timedOut && (!canReachTarget || currentY !== position.y)) {
      frameId = window.setTimeout(scroll, RESTORE_FRAME_DELAY);
    }
  };

  scroll();

  return () => {
    window.clearTimeout(frameId);
  };
}

function ScrollRestoration() {
  const location = useLocation();
  const navigationType = useNavigationType();
  const routeKey = getRouteKey(location);
  const historyKey = getHistoryKey(location);
  const currentLocationRef = useRef({ historyKey, routeKey });

  useLayoutEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    return () => {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "auto";
      }
    };
  }, []);

  useEffect(() => {
    const saveCurrentPosition = () => {
      const currentLocation = currentLocationRef.current;
      savePosition(currentLocation.historyKey, currentLocation.routeKey);
    };

    window.addEventListener("pagehide", saveCurrentPosition);
    window.addEventListener("beforeunload", saveCurrentPosition);

    return () => {
      saveCurrentPosition();
      window.removeEventListener("pagehide", saveCurrentPosition);
      window.removeEventListener("beforeunload", saveCurrentPosition);
    };
  }, []);

  useEffect(() => {
    let frameId;

    const saveCurrentPosition = () => {
      window.cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(() => {
        const currentLocation = currentLocationRef.current;
        savePosition(currentLocation.historyKey, currentLocation.routeKey);
      });
    };

    window.addEventListener("scroll", saveCurrentPosition, { passive: true });

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", saveCurrentPosition);
      const currentLocation = currentLocationRef.current;
      savePosition(currentLocation.historyKey, currentLocation.routeKey);
    };
  }, []);

  useLayoutEffect(() => {
    const previousLocation = currentLocationRef.current;

    if (
      previousLocation.historyKey !== historyKey ||
      previousLocation.routeKey !== routeKey
    ) {
      savePosition(previousLocation.historyKey, previousLocation.routeKey);
      currentLocationRef.current = { historyKey, routeKey };
    }

    const shouldRestoreSavedPosition =
      navigationType === "POP" || Boolean(location.state?.restoreScroll);
    const savedPosition = readPosition(
      historyKey,
      routeKey,
      Boolean(location.state?.restoreScroll)
    );

    if (savedPosition && shouldRestoreSavedPosition) {
      return restorePosition(savedPosition);
    }

    if (!shouldRestoreSavedPosition) {
      window.scrollTo(0, 0);
    }
  }, [historyKey, routeKey, navigationType, location.state]);

  return null;
}

export default ScrollRestoration;
