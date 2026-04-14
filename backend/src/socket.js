import { Server } from "socket.io";
import NGO from "./model/ngo.model.js";
import Donor from "./model/donor.model.js";
import Delivery from "./model/delivery.model.js";

let io;

const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`Client connected: ${socket.id}`);

    socket.on("join", async (data) => {
      const { userId, userType } = data;

      try {
        if (userType === "ngo") {
          await NGO.findByIdAndUpdate(userId, { socketId: socket.id });
        } else if (userType === "donor") {
          await Donor.findByIdAndUpdate(userId, { socketId: socket.id });
        } else if (userType === "delivery") {
          await Delivery.findByIdAndUpdate(userId, { socketId: socket.id });
        }

        socket.emit("joined", { success: true });
        console.log("JOIN SUCCESS:", userId);
      } catch (error) {
        socket.emit("error", { message: "Join failed" });
      }
    });

    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });
};

const sendMessageToSocketId = (socketId, messageObject) => {
  if (io) {
    io.to(socketId).emit(messageObject.event, messageObject.data);
  } else {
    console.log("Socket.io not initialized.");
  }
};

export { initializeSocket, sendMessageToSocketId };
