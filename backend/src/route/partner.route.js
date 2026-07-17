import Router from "express";
import {
  registerPartner,
  loginPartner,
  getPartnerProfile,
  updatePartnerProfile,
} from "../controller/partner.controller.js";
import { authRestaurant } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

const partnerRoute = Router();

partnerRoute.route("/register").post(upload.single("image"), registerPartner);
partnerRoute.route("/login").post(loginPartner);
partnerRoute.route("/profile").get(authRestaurant, getPartnerProfile);
partnerRoute.route("/updateprofile").post(authRestaurant, updatePartnerProfile);

export default partnerRoute;
