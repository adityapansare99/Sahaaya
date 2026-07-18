import Router from "express";
import { chat, health } from "../controller/chatbot.controller.js";

const chatbotRoute = Router();

chatbotRoute.route("/").get(health);
chatbotRoute.route("/chat").post(chat);

export default chatbotRoute;
