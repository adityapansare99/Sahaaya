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

const partnerRoute = Router();

partnerRoute.route("/register").post(upload.single("image"), registerPartner);
partnerRoute.route("/login").post(loginPartner);
partnerRoute.route("/list").get(getActivePartners);
partnerRoute.route("/top").get(getTopPartners);
partnerRoute.route("/profile").get(authRestaurant, getPartnerProfile);
partnerRoute.route("/updateprofile").post(authRestaurant, upload.single("image"), updatePartnerProfile);
partnerRoute.route("/updatepassword").post(authRestaurant, updatePassword);
partnerRoute.route("/deleteaccount").delete(authRestaurant, deleteAccount);
partnerRoute.route("/redemptions").get(authRestaurant, getPartnerRedemptions);

export default partnerRoute;
