import Router from "express";
import {
  registerPartner,
  loginPartner,
  getPartnerProfile,
  updatePartnerProfile,
  updatePassword,
  deleteAccount,
} from "../controller/Delivery.controller.js";
import { authPartner } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";
import rateLimit from "express-rate-limit";

const deliveryRoute = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: "Too many login attempts, please try again later",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

deliveryRoute
  .route("/register")
  .post(authLimiter, upload.single("image"), registerPartner);
deliveryRoute.route("/login").post(authLimiter, loginPartner);
deliveryRoute.route("/profile").get(authPartner, getPartnerProfile);
deliveryRoute
  .route("/updateprofile")
  .post(authPartner, upload.single("image"), updatePartnerProfile);
deliveryRoute.route("/updatepassword").post(authPartner, updatePassword);
deliveryRoute.route("/deleteaccount").delete(authPartner, deleteAccount);

export default deliveryRoute;
