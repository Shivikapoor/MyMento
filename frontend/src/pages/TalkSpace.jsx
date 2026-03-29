import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import PageWrapper from "../components/PageWrapper";
import "../App.css";

const SOCKET_URL = "http://localhost:5000";

function TalkSpace() {
  const navigate = useNavigate();
  const socketRef = useRef(null);
  const communityFeedRef = useRef(null);
  const privateFeedRef = useRef(null);
  const typingTimersRef = useRef({});

  const [nickname, setNickname] = useState("");
  const [savedNickname, setSavedNickname] = useState("");
  const [connectionStatus, setConnectionStatus] = useState("Connecting...");
  const [communityMessages, setCommunityMessages] = useState([]);
  const [privateMessages, setPrivateMessages] = useState([]);
  const [communityInput, setCommunityInput] = useState("");
  const [privateInput, setPrivateInput] = useState("");
  const [communityJoined, setCommunityJoined] = useState(false);
  const [isMatching, setIsMatching] = useState(false);
  const [matchedUser, setMatchedUser] = useState(null);
  const [privateRoomId, setPrivateRoomId] = useState("");
  const [communityTyping, setCommunityTyping] = useState([]);
  const [privateTyping, setPrivateTyping] = useState([]);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const socket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      setConnectionStatus("Connected");
    });

    socket.on("disconnect", () => {
      setConnectionStatus("Disconnected");
      setIsMatching(false);
    });

    socket.on("chat status", (payload) => {
      if (payload?.status) {
        setConnectionStatus(capitalize(payload.status));
      }
    });

    socket.on("nickname set", ({ nickname: confirmedNickname }) => {
      setSavedNickname(confirmedNickname || "");
      if (confirmedNickname) {
        setNotice(`You are chatting as ${confirmedNickname}.`);
      }
    });

    socket.on("community joined", () => {
      setCommunityJoined(true);
      setNotice("You joined the community room.");
    });

    socket.on("community history", (messages) => {
      setCommunityMessages(
        Array.isArray(messages)
          ? messages.map((item) => normalizeMessage(item, "community"))
          : []
      );
    });

    socket.on("community message", (message) => {
      setCommunityMessages((prev) => [...prev, normalizeMessage(message, "community")]);
    });

    socket.on("private message", (message) => {
      setPrivateMessages((prev) => [...prev, normalizeMessage(message, "private")]);
    });

    socket.on("user typing", (payload) => {
      const label = payload?.nickname || "Someone";
      const scope = payload?.scope === "private" ? "private" : "community";
      addTypingUser(scope, label);
    });

    socket.on("matching status", ({ waiting }) => {
      setIsMatching(Boolean(waiting));
      if (waiting) {
        setNotice("Looking for a calm private chat match...");
      }
    });

    socket.on("user matched for private chat", ({ roomId, partner }) => {
      setIsMatching(false);
      setMatchedUser(partner || "Anonymous");
      setPrivateRoomId(roomId || "");
      setNotice("A private one-on-one chat is ready.");
    });

    socket.on("chat ended", ({ blockedNickname }) => {
      setMatchedUser(null);
      setPrivateRoomId("");
      setPrivateMessages([]);
      setPrivateTyping([]);
      setPrivateInput("");
      setIsMatching(false);
      setNotice(
        blockedNickname
          ? `Chat ended and ${blockedNickname} was blocked.`
          : "Private chat ended."
      );
    });

    socket.on("user reported", ({ reportedNickname }) => {
      setNotice(`${reportedNickname || "User"} has been reported.`);
    });

    socket.on("user blocked", ({ blockedNickname }) => {
      setNotice(`${blockedNickname || "User"} has been blocked.`);
    });

    return () => {
      Object.values(typingTimersRef.current).forEach((timer) => {
        window.clearTimeout(timer);
      });
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (communityFeedRef.current) {
      communityFeedRef.current.scrollTop = communityFeedRef.current.scrollHeight;
    }
  }, [communityMessages]);

  useEffect(() => {
    if (privateFeedRef.current) {
      privateFeedRef.current.scrollTop = privateFeedRef.current.scrollHeight;
    }
  }, [privateMessages]);

  const activeNickname = savedNickname || nickname.trim();
  const communityTypingLabel = useMemo(
    () => formatTypingLabel(communityTyping, "Community"),
    [communityTyping]
  );
  const privateTypingLabel = useMemo(
    () => formatTypingLabel(privateTyping, "Private"),
    [privateTyping]
  );

  const emitNickname = () => {
    const trimmed = nickname.trim();
    if (!trimmed || !socketRef.current) return false;
    socketRef.current.emit("set_nickname", { nickname: trimmed });
    return true;
  };

  const handleJoinCommunity = () => {
    if (!emitNickname()) return;
    socketRef.current.emit("join_community", { nickname: nickname.trim() });
  };

  const handleFindPrivateChat = () => {
    if (!emitNickname()) return;
    socketRef.current.emit("request_private_chat", { nickname: nickname.trim() });
  };

  const handleCommunityMessage = (event) => {
    event.preventDefault();
    const message = communityInput.trim();
    if (!message || !socketRef.current || !communityJoined) return;
    socketRef.current.emit("community message", { message });
    setCommunityInput("");
  };

  const handlePrivateMessage = (event) => {
    event.preventDefault();
    const message = privateInput.trim();
    if (!message || !socketRef.current || !privateRoomId) return;
    socketRef.current.emit("private message", { message });
    setPrivateInput("");
  };

  const handleTyping = (scope, value) => {
    if (!socketRef.current || !value.trim()) return;
    socketRef.current.emit("user typing", { scope });
  };

  const handleEndChat = () => {
    if (!socketRef.current || !privateRoomId) return;
    socketRef.current.emit("end chat");
    setPrivateMessages([]);
    setPrivateTyping([]);
    setPrivateInput("");
  };

  const handleReport = () => {
    if (!socketRef.current || !matchedUser) return;
    socketRef.current.emit("report user", { reportedNickname: matchedUser });
  };

  const handleBlock = () => {
    if (!socketRef.current || !matchedUser) return;
    socketRef.current.emit("block user", { blockedNickname: matchedUser });
    setPrivateMessages([]);
  };

  function addTypingUser(scope, label) {
    const setter = scope === "private" ? setPrivateTyping : setCommunityTyping;
    setter((prev) => (prev.includes(label) ? prev : [...prev, label]));

    const timerKey = `${scope}-${label}`;
    if (typingTimersRef.current[timerKey]) {
      window.clearTimeout(typingTimersRef.current[timerKey]);
    }

    typingTimersRef.current[timerKey] = window.setTimeout(() => {
      setter((prev) => prev.filter((item) => item !== label));
      delete typingTimersRef.current[timerKey];
    }, 1600);
  }

  return (
    <PageWrapper>
      <div className="talkspace-page">
        <div className="talkspace-backdrop" />
        <div className="talkspace-shell">
          <div className="talkspace-card talkspace-chat-card">
            <span className="talkspace-eyebrow">Anonymous support chat</span>
            <h1>Talk Space</h1>
            <p>
              Choose a nickname, join the gentle community, or start a private
              one-on-one conversation when you need a quieter space.
            </p>

            <div className="talkspace-status-row">
              <span className="talkspace-status-chip">{connectionStatus}</span>
              <span className="talkspace-status-chip">
                {activeNickname ? `Nickname: ${activeNickname}` : "Pick a nickname to begin"}
              </span>
            </div>

            {notice ? <div className="talkspace-notice">{notice}</div> : null}

            <label className="talkspace-field">
              <span>Enter a nickname (anonymous)</span>
              <input
                type="text"
                value={nickname}
                onChange={(event) => setNickname(event.target.value)}
                placeholder="Example: calmcloud"
                maxLength={30}
              />
            </label>

            <div className="talkspace-action-grid">
              <button
                type="button"
                className="talkspace-main-btn"
                onClick={handleJoinCommunity}
                disabled={!nickname.trim()}
              >
                Join Community
              </button>
              <button
                type="button"
                className="talkspace-secondary-btn"
                onClick={handleFindPrivateChat}
                disabled={!nickname.trim()}
              >
                Talk One-on-One
              </button>
            </div>

            {isMatching ? (
              <div className="talkspace-match-card">
                <strong>Finding a match</strong>
                <span>Please stay here for a moment while we connect you.</span>
              </div>
            ) : null}

            {matchedUser ? (
              <div className="talkspace-match-card talkspace-match-live">
                <strong>Private chat matched</strong>
                <span>You are now connected with {matchedUser}.</span>
              </div>
            ) : null}

            <div className="talkspace-feed-grid talkspace-chat-grid">
              <section className="talkspace-feed-card talkspace-room-card">
                <div className="talkspace-room-header">
                  <div>
                    <h3>Community Chat</h3>
                    <span>Room: community</span>
                  </div>
                  <span className="talkspace-room-pill">
                    {communityJoined ? "Joined" : "Not joined"}
                  </span>
                </div>

                <div ref={communityFeedRef} className="talkspace-feed-list talkspace-chat-feed">
                  {communityMessages.length === 0 ? (
                    <p className="talkspace-empty-state">
                      Join the community room to start chatting.
                    </p>
                  ) : (
                    communityMessages.map((message, index) => (
                      <MessageBubble
                        key={`community-${message.sender}-${index}`}
                        message={message}
                        isOwnMessage={message.sender === activeNickname}
                      />
                    ))
                  )}
                </div>

                <div className="talkspace-typing-row">{communityTypingLabel}</div>

                <form className="talkspace-composer" onSubmit={handleCommunityMessage}>
                  <input
                    type="text"
                    value={communityInput}
                    onChange={(event) => {
                      setCommunityInput(event.target.value);
                      handleTyping("community", event.target.value);
                    }}
                    placeholder="Write something kind to the community..."
                    disabled={!communityJoined}
                  />
                  <button type="submit" disabled={!communityJoined || !communityInput.trim()}>
                    Send
                  </button>
                </form>
              </section>

              <section className="talkspace-feed-card talkspace-room-card">
                <div className="talkspace-room-header">
                  <div>
                    <h3>Private Chat</h3>
                    <span>{matchedUser ? `Matched with ${matchedUser}` : "One-on-one support"}</span>
                  </div>
                  <span className="talkspace-room-pill">
                    {privateRoomId ? "Live" : "Waiting"}
                  </span>
                </div>

                <div ref={privateFeedRef} className="talkspace-feed-list talkspace-chat-feed">
                  {privateMessages.length === 0 ? (
                    <p className="talkspace-empty-state">
                      {privateRoomId
                        ? "Say hello when you are ready."
                        : "Start one-on-one chat to get matched anonymously."}
                    </p>
                  ) : (
                    privateMessages.map((message, index) => (
                      <MessageBubble
                        key={`private-${message.sender}-${index}`}
                        message={message}
                        isOwnMessage={message.sender === activeNickname}
                      />
                    ))
                  )}
                </div>

                <div className="talkspace-typing-row">{privateTypingLabel}</div>

                <form className="talkspace-composer" onSubmit={handlePrivateMessage}>
                  <input
                    type="text"
                    value={privateInput}
                    onChange={(event) => {
                      setPrivateInput(event.target.value);
                      handleTyping("private", event.target.value);
                    }}
                    placeholder="Write privately..."
                    disabled={!privateRoomId}
                  />
                  <button type="submit" disabled={!privateRoomId || !privateInput.trim()}>
                    Send
                  </button>
                </form>

                <div className="talkspace-safety-row">
                  <button
                    type="button"
                    className="talkspace-utility-btn"
                    onClick={handleReport}
                    disabled={!matchedUser}
                  >
                    Report User
                  </button>
                  <button
                    type="button"
                    className="talkspace-utility-btn"
                    onClick={handleBlock}
                    disabled={!matchedUser}
                  >
                    Block User
                  </button>
                  <button
                    type="button"
                    className="talkspace-danger-btn"
                    onClick={handleEndChat}
                    disabled={!privateRoomId}
                  >
                    End Chat
                  </button>
                </div>
              </section>
            </div>

            <button
              type="button"
              className="talkspace-cancel-btn"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

function MessageBubble({ message, isOwnMessage }) {
  return (
    <article className={`talkspace-message ${isOwnMessage ? "own" : ""}`}>
      <strong>{isOwnMessage ? "You" : message.sender}</strong>
      <p>{message.text}</p>
      <span>{formatTime(message.createdAt)}</span>
    </article>
  );
}

function normalizeMessage(message, fallbackRoom) {
  if (typeof message === "string") {
    return {
      sender: fallbackRoom === "private" ? "Private chat" : "Community",
      text: message,
      room: fallbackRoom,
      createdAt: new Date().toISOString(),
    };
  }

  return {
    sender: message?.nickname || message?.sender || message?.from || "Anonymous",
    text: message?.text || message?.message || "",
    room: message?.room || fallbackRoom,
    createdAt: message?.createdAt || new Date().toISOString(),
  };
}

function formatTypingLabel(users, scopeLabel) {
  if (!users.length) {
    return `${scopeLabel} is quiet right now`;
  }

  return `${users.join(", ")} typing...`;
}

function formatTime(value) {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

function capitalize(value) {
  if (!value) return "";
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export default TalkSpace;
