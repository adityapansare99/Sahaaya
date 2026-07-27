import Router from "express";
import {
  registerPartner,
  loginPartner,
  getPartnerProfile,
  updatePartnerProfile,
  getActivePartners,
  getPartnerRedemptions,
  getTopPartners,
  updatePassword,
  deleteAccount,
} from "../controller/partner.controller.js";
import { authRestaurant } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";
import rateLimit from 'express-rate-limit';

const partnerRoute = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: "Too many login attempts, please try again later" },
  standardHeaders: true,
  legacyHeaders: false,
});

partnerRoute.route("/register").post(authLimiter, upload.single("image"), registerPartner);
partnerRoute.route("/login").post(authLimiter, loginPartner);
partnerRoute.route("/list").get(getActivePartners);
partnerRoute.route("/top").get(getTopPartners);
partnerRoute.route("/profile").get(authRestaurant, getPartnerProfile);
partnerRoute.route("/updateprofile").post(authRestaurant, upload.single("image"), updatePartnerProfile);
partnerRoute.route("/updatepassword").post(authRestaurant, updatePassword);
partnerRoute.route("/deleteaccount").delete(authRestaurant, deleteAccount);
partnerRoute.route("/redemptions").get(authRestaurant, getPartnerRedemptions);

export default partnerRoute;
