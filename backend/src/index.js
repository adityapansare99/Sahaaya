import app from "./app.js";
import connectdb from "./db/index.js";
import dotenv from "dotenv";
import { createServer } from "http";
import mongoose from "mongoose";
import { initializeSocket } from "./socket.js";
import startExpiryCleanup from "./utils/expiryCleanup.js";

dotenv.config({
  path: "./.env",
});

const missingSecrets = [];
if (!process.env.refreshtoken) missingSecrets.push("refreshtoken (JWT secret)");
if (process.env.NODE_ENV === "production" && !process.env.ADMIN_JWT_SECRET) {
  missingSecrets.push("ADMIN_JWT_SECRET (required in production)");
}
if (missingSecrets.length) {
  console.error(
    `FATAL: missing required secret(s): ${missingSecrets.join(", ")}. Set them in .env before starting.`,
  );
  process.exit(1);
}

const PORT = process.env.PORT || 8000;

const server = createServer(app);
initializeSocket(server);

connectdb()
  .then(() => {
    startExpiryCleanup();
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Failed to connect to database", err);
  });

// Graceful shutdown
const shutdown = async (signal) => {
  console.log(`\n[${signal}] Shutting down gracefully...`);
  await new Promise((resolve) => server.close(resolve));
  console.log("HTTP server closed");
  await mongoose.connection.close();
  console.log("MongoDB connection closed");
  process.exit(0);
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
