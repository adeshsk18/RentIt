import dotenv from "dotenv";
import express from "express";
import http from "http";
import { Server } from "socket.io";

import { changeSeenStatus } from "../controllers/user.js";

dotenv.config();
const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [process.env.CLIENT_URL],
    methods: ["GET", "POST"],
  },
});

export const getReceiverSocketId = (receiverId) => {
  return userSocketMap[String(receiverId)];
};

const userSocketMap = {};

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId != "undefined") {
    userSocketMap[userId] = socket.id;
  }

  socket.on("updateSeenStatus", async (data) => {
    try {
      const { requestId, seenf, receiverId } = data;
      await changeSeenStatus(requestId, seenf, receiverId);
    } catch (error) {
      socket.emit("error", { message: "Failed to update seen status." });
    }
  });

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
    delete userSocketMap[userId];
  });
});

export { app, io, server };
