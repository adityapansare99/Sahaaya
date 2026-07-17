import Router from "express";
import {
  registerPartner,
  loginPartner,
  getPartnerProfile,
  updatePartnerProfile,
  getActivePartners,
  getPartnerRedemptions,
  getTopPartners,
} from "../controller/partner.controller.js";
import { authRestaurant } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

const partnerRoute = Router();

partnerRoute.route("/register").post(upload.single("image"), registerPartner);
partnerRoute.route("/login").post(loginPartner);
partnerRoute.route("/list").get(getActivePartners);
partnerRoute.route("/top").get(getTopPartners);
partnerRoute.route("/profile").get(authRestaurant, getPartnerProfile);
partnerRoute.route("/updateprofile").post(authRestaurant, updatePartnerProfile);
partnerRoute.route("/redemptions").get(authRestaurant, getPartnerRedemptions);

export default partnerRoute;
