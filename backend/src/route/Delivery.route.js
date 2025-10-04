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

const deliveryRoute = Router();

deliveryRoute.route("/register").post(upload.single("image"), registerPartner);
deliveryRoute.route("/login").post(loginPartner);
deliveryRoute.route("/profile").get(authPartner, getPartnerProfile);
deliveryRoute.route("/updateprofile").post(authPartner, updatePartnerProfile);
deliveryRoute.route("/updatepassword").post(authPartner, updatePassword);
deliveryRoute.route("/deleteaccount").delete(authPartner, deleteAccount);

export default deliveryRoute;
