import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import chatbotRoute from "./route/chatbot.route.js";
import config from "./config.js";

const app = express();

app.set("trust proxy", 1);

app.use(
  cors({
    origin: config.corsOrigin.length ? config.corsOrigin : "*",
  })
);

app.use(express.json({ limit: "1mb" }));

const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: config.chatRateLimitPerMinute,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests — please slow down.",
  },
});
app.use("/chatbot/chat", chatLimiter);

app.use("/chatbot", chatbotRoute);

export default app;
