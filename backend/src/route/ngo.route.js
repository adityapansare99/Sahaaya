import Router from "express";
import {
  registerNgo,
  loginNgo,
  getNgoProfile,
  updateNgoProfile,
  updatePassword,
  deleteAccount,
  getAnalytics,
} from "../controller/ngo.controller.js";
import { authNgo } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";
import rateLimit from 'express-rate-limit';

const NgoRoute = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: "Too many login attempts, please try again later" },
  standardHeaders: true,
  legacyHeaders: false,
});

NgoRoute.route("/register").post(authLimiter, upload.single("image") ,registerNgo);
NgoRoute.route("/login").post(authLimiter, loginNgo);
NgoRoute.route("/profile").get(authNgo,getNgoProfile);
NgoRoute.route("/updateprofile").post(authNgo,updateNgoProfile);
NgoRoute.route("/updatepassword").post(authNgo,updatePassword);
NgoRoute.route("/deleteaccount").delete(authNgo,deleteAccount);
NgoRoute.route("/analytics").get(authNgo,getAnalytics);

export default NgoRoute;
