const configuredApiUrl = (import.meta.env.VITE_API_URL || "")
  .trim()
  .replace(/\/$/, "");
const defaultRemoteApiUrl = "https://mymento-backend.onrender.com";
const remoteApiUrl = configuredApiUrl || defaultRemoteApiUrl;
const isDev = import.meta.env.DEV;
const useDevProxy = isDev && !configuredApiUrl;

export const API_URL = useDevProxy ? "" : remoteApiUrl;
export const API_BASE_URL = useDevProxy ? "/api" : `${remoteApiUrl}/api`;
export const SOCKET_URL = useDevProxy ? window.location.origin : remoteApiUrl;
export const UPLOADS_BASE_URL = useDevProxy ? "" : remoteApiUrl;
export const HEALTHCHECK_URL = useDevProxy ? "/health" : `${remoteApiUrl}/health`;

const wait = (ms) =>
  new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });

export function isNetworkFetchError(error) {
  return error?.name === "TypeError" && error?.message === "Failed to fetch";
}

export async function ensureBackendReady({
  timeoutMs = 70000,
  intervalMs = 2500,
} = {}) {
  if (useDevProxy) {
    return true;
  }

  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    try {
      const response = await fetch(HEALTHCHECK_URL, {
        method: "GET",
        cache: "no-store",
      });

      if (response.ok) {
        return true;
      }
    } catch (error) {
      // Render cold starts often fail the first few requests; keep polling.
    }

    await wait(intervalMs);
  }

  return false;
}
