import express from "express";
import cors from "cors";
import chatbotRoute from "./route/chatbot.route.js";

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json({ limit: "1mb" }));

app.use("/chatbot", chatbotRoute);

export default app;
