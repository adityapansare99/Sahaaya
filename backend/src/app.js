import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

const app = express();

app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: {
    success: false,
    message: "Too many requests, please try again later",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

const allowedOrigins = (process.env.FRONTEND_URL || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const corsOrigins = allowedOrigins.length
  ? allowedOrigins
  : ["http://localhost:5173", "http://localhost:4173", "http://localhost:5174"];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || corsOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(null, false);
    },
    credentials: true,
  }),
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

import healthcheckRoute from "./route/healthcheck.route.js";
app.use("/", healthcheckRoute);

import donorrouter from "./route/donor.route.js";
app.use("/donor", donorrouter);

import NgoRoute from "./route/ngo.route.js";
app.use("/ngo", NgoRoute);

import deliveryRoute from "./route/Delivery.route.js";
app.use("/delivery", deliveryRoute);

import donationRouter from "./route/Donation.route.js";
app.use("/donation", donationRouter);

import receiverRouter from "./route/Receiver.route.js";
app.use("/receiver", receiverRouter);

import riderRouter from "./route/Rider.route.js";
app.use("/rider", riderRouter);

import partnerRoute from "./route/partner.route.js";
app.use("/partner", partnerRoute);

import adminRoute from "./route/admin.route.js";
app.use("/admin", adminRoute);

import forgotRoute from "./route/forgot.route.js";
app.use("/forgot", forgotRoute);

import trackRoute from "./route/track.route.js";
app.use("/track", trackRoute);

app.use((err, req, res, next) => {
  let statuscode = err?.statuscode || err?.statusCode || 500;
  if (err?.code === "LIMIT_FILE_SIZE") statuscode = 413;
  const message = err?.message || "Internal Server Error";
  if (statuscode >= 500) {
    console.error(`[error] ${req.method} ${req.originalUrl} →`, err);
  }
  res.status(statuscode).json({
    statuscode,
    data: err?.errors || null,
    message,
    success: statuscode < 400,
    ...(process.env.NODE_ENV !== "production" && statuscode >= 500
      ? { stack: err.stack }
      : {}),
  });
});

export default app;
