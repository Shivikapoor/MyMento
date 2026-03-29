const ChatUser = require("../models/ChatUser");
const CommunityMessage = require("../models/CommunityMessage");
const PrivateChat = require("../models/PrivateChat");

const COMMUNITY_ROOM = "community";
const waitingQueue = [];
const onlineUsers = new Map();
const privateRoomBySocket = new Map();
let profanityFilter = null;

function registerChatSocket(io) {
  io.on("connection", (socket) => {
    socket.emit("chat status", { status: "connected" });

    socket.on("set_nickname", async ({ nickname }) => {
      const user = await ensureNickname(socket, nickname);
      if (!user) return;
      socket.emit("nickname set", { nickname: user.nickname });
    });

    socket.on("join_community", async ({ nickname }) => {
      const user = await ensureNickname(socket, nickname);
      if (!user) return;

      socket.join(COMMUNITY_ROOM);
      socket.emit("community joined", { room: COMMUNITY_ROOM });

      const recentMessages = await CommunityMessage.find()
        .sort({ createdAt: -1 })
        .limit(30)
        .lean();

      socket.emit(
        "community history",
        recentMessages.reverse().map((item) => ({
          nickname: item.nickname,
          message: item.message,
          createdAt: item.createdAt,
        }))
      );
    });

    socket.on("community message", async ({ message }) => {
      const user = onlineUsers.get(socket.id);
      const cleanMessage = await sanitizeMessage(message);
      if (!user || !cleanMessage) return;

      const saved = await CommunityMessage.create({
        nickname: user.nickname,
        message: cleanMessage,
      });

      io.to(COMMUNITY_ROOM).emit("community message", {
        nickname: user.nickname,
        message: saved.message,
        createdAt: saved.createdAt,
      });
    });

    socket.on("request_private_chat", async ({ nickname }) => {
      const user = await ensureNickname(socket, nickname);
      if (!user) return;
      if (waitingQueue.includes(socket.id)) return;

      waitingQueue.push(socket.id);
      socket.emit("matching status", { waiting: true });
      await tryMatchUsers(io);
    });

    socket.on("private message", async ({ message }) => {
      const user = onlineUsers.get(socket.id);
      const roomId = privateRoomBySocket.get(socket.id);
      const cleanMessage = await sanitizeMessage(message);
      if (!user || !roomId || !cleanMessage) return;

      const chat = await PrivateChat.findById(roomId);
      if (!chat) return;

      chat.messages.push({
        nickname: user.nickname,
        message: cleanMessage,
      });
      await chat.save();

      io.to(roomId).emit("private message", {
        nickname: user.nickname,
        message: cleanMessage,
        createdAt: new Date(),
        room: roomId,
      });
    });

    socket.on("user typing", ({ scope }) => {
      const user = onlineUsers.get(socket.id);
      if (!user) return;

      if (scope === "private") {
        const roomId = privateRoomBySocket.get(socket.id);
        if (!roomId) return;
        socket.to(roomId).emit("user typing", {
          nickname: user.nickname,
          scope: "private",
        });
        return;
      }

      socket.to(COMMUNITY_ROOM).emit("user typing", {
        nickname: user.nickname,
        scope: "community",
      });
    });

    socket.on("end chat", async () => {
      await endPrivateChat(io, socket.id, { clearMessages: true });
    });

    socket.on("report user", ({ reportedNickname }) => {
      socket.emit("user reported", { reportedNickname, success: true });
    });

    socket.on("block user", async ({ blockedNickname }) => {
      await endPrivateChat(io, socket.id, {
        clearMessages: true,
        blockedNickname,
      });
      socket.emit("user blocked", { blockedNickname, success: true });
    });

    socket.on("disconnect", async () => {
      removeFromQueue(socket.id);
      await ChatUser.findOneAndUpdate(
        { socketId: socket.id },
        { isOnline: false }
      );
      onlineUsers.delete(socket.id);
      await endPrivateChat(io, socket.id, { clearMessages: true, disconnecting: true });
    });
  });
}

async function ensureNickname(socket, nickname) {
  const existing = onlineUsers.get(socket.id);
  if (existing?.nickname) return existing;

  const cleanNickname = sanitizeNickname(nickname);
  if (!cleanNickname) return null;

  const user = {
    nickname: cleanNickname,
    socketId: socket.id,
  };

  onlineUsers.set(socket.id, user);

  await ChatUser.findOneAndUpdate(
    { nickname: cleanNickname },
    {
      nickname: cleanNickname,
      socketId: socket.id,
      isOnline: true,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  return user;
}

async function tryMatchUsers(io) {
  while (waitingQueue.length >= 2) {
    const firstSocketId = waitingQueue.shift();
    const secondSocketId = waitingQueue.shift();

    const firstSocket = io.sockets.sockets.get(firstSocketId);
    const secondSocket = io.sockets.sockets.get(secondSocketId);
    const firstUser = onlineUsers.get(firstSocketId);
    const secondUser = onlineUsers.get(secondSocketId);

    if (!firstSocket || !secondSocket || !firstUser || !secondUser) {
      continue;
    }

    const chat = await PrivateChat.create({
      users: [firstUser.nickname, secondUser.nickname],
      messages: [],
    });

    const roomId = chat._id.toString();

    firstSocket.join(roomId);
    secondSocket.join(roomId);

    privateRoomBySocket.set(firstSocketId, roomId);
    privateRoomBySocket.set(secondSocketId, roomId);

    firstSocket.emit("user matched for private chat", {
      roomId,
      partner: secondUser.nickname,
    });
    secondSocket.emit("user matched for private chat", {
      roomId,
      partner: firstUser.nickname,
    });
  }
}

async function endPrivateChat(io, socketId, options = {}) {
  const roomId = privateRoomBySocket.get(socketId);
  if (!roomId) return;

  const sockets = await io.in(roomId).fetchSockets();
  const participantIds = sockets.map((item) => item.id);

  participantIds.forEach((id) => {
    privateRoomBySocket.delete(id);
    const liveSocket = io.sockets.sockets.get(id);
    if (liveSocket) {
      liveSocket.leave(roomId);
      liveSocket.emit("chat ended", {
        roomId,
        blockedNickname: options.blockedNickname || null,
      });
    }
  });

  if (options.clearMessages) {
    await PrivateChat.findByIdAndDelete(roomId);
  }
}

function removeFromQueue(socketId) {
  const index = waitingQueue.indexOf(socketId);
  if (index >= 0) {
    waitingQueue.splice(index, 1);
  }
}

function sanitizeNickname(value) {
  if (!value || typeof value !== "string") return "";
  return value.trim().slice(0, 30);
}

async function getProfanityFilter() {
  if (profanityFilter) return profanityFilter;

  const badWordsModule = await import("bad-words");
  const Filter = badWordsModule.Filter || badWordsModule.default;
  profanityFilter = new Filter();
  return profanityFilter;
}

async function sanitizeMessage(value) {
  if (!value || typeof value !== "string") return "";
  const filter = await getProfanityFilter();
  return filter.clean(value.trim()).slice(0, 500);
}

module.exports = {
  registerChatSocket,
};
