import Router from "express";
import {
  registerDonor,
  loginDonor,
  getDonorProfile,
  updateDonorProfile,
  updatePassword,
  deleteAccount,
  getImpact,
} from "../controller/Donor.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { authDonor } from "../middleware/auth.middleware.js";
import rateLimit from 'express-rate-limit';

const donorrouter = Router();

// Stricter rate limit for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: "Too many login attempts, please try again later" },
  standardHeaders: true,
  legacyHeaders: false,
});

donorrouter.route("/register").post(authLimiter, upload.single("image"), registerDonor);
donorrouter.route("/login").post(authLimiter, loginDonor);
donorrouter.route("/profile").get(authDonor, getDonorProfile);
donorrouter.route("/updateprofile").post(authDonor, updateDonorProfile);
donorrouter.route("/updatepassword").post(authDonor, updatePassword);
donorrouter.route("/deleteaccount").delete(authDonor, deleteAccount);
donorrouter.route("/impact").get(authDonor, getImpact);

export default donorrouter;
