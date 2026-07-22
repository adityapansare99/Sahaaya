import { Server } from "socket.io";
import NGO from "./model/ngo.model.js";
import Donor from "./model/donor.model.js";
import Delivery from "./model/delivery.model.js";
import Ride from "./model/ride.model.js";

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
      socket.data = { userId, userType };

      try {
        if (userType === "ngo") {
          await NGO.findByIdAndUpdate(userId, { socketId: socket.id });
        } else if (userType === "donor") {
          await Donor.findByIdAndUpdate(userId, { socketId: socket.id });
        } else if (userType === "delivery") {
          await Delivery.findByIdAndUpdate(userId, { socketId: socket.id });
        }

        if (["ngo", "donor", "delivery"].includes(userType)) {
          socket.join(userType);
        }

        socket.emit("joined", { success: true });
        console.log("JOIN SUCCESS:", userId);
      } catch (error) {
        socket.emit("error", { message: "Join failed" });
      }
    });

    socket.on("joinRide", (data) => {
      const { rideId } = data || {};
      if (rideId) {
        socket.join(`ride:${rideId}`);
        socket.emit("joinedRide", { rideId, ok: true });
      }
    });

    socket.on("leaveRide", (data) => {
      const { rideId } = data || {};
      if (rideId) socket.leave(`ride:${rideId}`);
    });

    socket.on("updateRiderLocation", async (data) => {
      const { latitude, longitude } = data || {};
      if (latitude == null || longitude == null) return;
      const { userId, userType } = socket.data || {};
      if (!userId || userType !== "delivery") return;

      try {
        const ride = await Ride.findOne({
          rider: userId,
          status: { $in: ["accepted", "picked up"] },
        }).lean();
        if (!ride) return;
        io.to(`ride:${ride._id}`).emit("riderLocation", {
          rideId: String(ride._id),
          latitude,
          longitude,
          lastActiveAt: new Date().toISOString(),
        });
      } catch (err) {
        console.log("updateRiderLocation error:", err.message);
      }
    });

    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });
};

const sendMessageToSocketId = (socketId, messageObject) => {
  if (io && socketId) {
    io.to(socketId).emit(messageObject.event, messageObject.data);
  } else if (!io) {
    console.log("Socket.io not initialized.");
  }
};

const broadcastToUserType = (userType, messageObject) => {
  if (io) {
    io.to(userType).emit(messageObject.event, messageObject.data);
    console.log("BROADCAST SUCCESS:", userType," event: ",messageObject.event ," data: ", messageObject.data);
  } else {
    console.log("Socket.io not initialized.");
  }
};

// Emit to everyone viewing a ride's live-location page (donor + NGO + rider).
const broadcastToRide = (rideId, messageObject) => {
  if (io && rideId) {
    io.to(`ride:${rideId}`).emit(messageObject.event, messageObject.data);
  } else if (!io) {
    console.log("Socket.io not initialized.");
  }
};

export { initializeSocket, sendMessageToSocketId, broadcastToUserType, broadcastToRide };
