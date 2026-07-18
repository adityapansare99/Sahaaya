import Router from "express";
import { sendOtp, verifyOtp, resetPassword } from "../controller/forgot.controller.js";

const forgotRoute = Router();

forgotRoute.route("/send-otp").post(sendOtp);
forgotRoute.route("/verify-otp").post(verifyOtp);
forgotRoute.route("/reset-password").post(resetPassword);

export default forgotRoute;
