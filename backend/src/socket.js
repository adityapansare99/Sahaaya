import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import NGO from "./model/ngo.model.js";
import Donor from "./model/donor.model.js";
import Delivery from "./model/delivery.model.js";
import Partner from "./model/partner.model.js";
import Ride from "./model/ride.model.js";

let io;

const initializeSocket = (server) => {
  const allowedOrigins = (process.env.FRONTEND_URL || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const corsOrigins = allowedOrigins.length
    ? allowedOrigins
    : [
        "http://localhost:5173",
        "http://localhost:4173",
        "http://localhost:5174",
      ];

  io = new Server(server, {
    cors: {
      origin: corsOrigins,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.use(async (socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        String(socket.handshake.headers.authorization || "").replace(
          "Bearer ",
          "",
        );
      if (!token) return next(new Error("unauthorized"));
      let decoded;
      try {
        decoded = jwt.verify(token, process.env.refreshtoken);
      } catch {
        return next(new Error("unauthorized"));
      }
      if (decoded.purpose === "reset") return next(new Error("unauthorized"));
      const email = decoded.email;
      if (!email) return next(new Error("unauthorized"));

      const [ngo, donor, delivery, partner] = await Promise.all([
        NGO.findOne({ email }).select("_id"),
        Donor.findOne({ email }).select("_id"),
        Delivery.findOne({ email }).select("_id"),
        Partner.findOne({ email }).select("_id"),
      ]);
      const user = ngo
        ? { id: String(ngo._id), type: "ngo" }
        : donor
          ? { id: String(donor._id), type: "donor" }
          : delivery
            ? { id: String(delivery._id), type: "delivery" }
            : partner
              ? { id: String(partner._id), type: "partner" }
              : null;
      if (!user) return next(new Error("unauthorized"));

      socket.data.user = user;
      next();
    } catch {
      next(new Error("unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`Client connected: ${socket.id}`);

    socket.on("join", async () => {
      const user = socket.data.user;
      if (!user) return socket.emit("error", { message: "Unauthorized" });
      const { id: userId, type: userType } = user;

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
      } catch {
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
      const user = socket.data.user || {};
      if (!user.id || user.type !== "delivery") return;

      try {
        const ride = await Ride.findOne({
          rider: user.id,
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
  } else {
    console.log("Socket.io not initialized.");
  }
};

const broadcastToRide = (rideId, messageObject) => {
  if (io && rideId) {
    io.to(`ride:${rideId}`).emit(messageObject.event, messageObject.data);
  } else if (!io) {
    console.log("Socket.io not initialized.");
  }
};

export {
  initializeSocket,
  sendMessageToSocketId,
  broadcastToUserType,
  broadcastToRide,
};
