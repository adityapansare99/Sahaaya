import Router from "express";
import {
  registerDonor,
  loginDonor,
  getDonorProfile,
  updateDonorProfile,
  updatePassword,
  deleteAccount,
} from "../controller/Donor.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { authDonor } from "../middleware/auth.middleware.js";

const donorrouter = Router();

donorrouter.route("/register").post(upload.single("image"), registerDonor);
donorrouter.route("/login").post(loginDonor);
donorrouter.route("/profile").get(authDonor, getDonorProfile);
donorrouter.route("/updateprofile").post(authDonor, updateDonorProfile);
donorrouter.route("/updatepassword").post(authDonor, updatePassword);
donorrouter.route("/deleteaccount").delete(authDonor, deleteAccount);

export default donorrouter;
