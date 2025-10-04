import Router from "express";
import {
  registerNgo,
  loginNgo,
  getNgoProfile,
  updateNgoProfile,
  updatePassword,
  deleteAccount,
} from "../controller/ngo.controller.js";
import { authNgo } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

const NgoRoute = Router();

NgoRoute.route("/register").post(upload.single("image") ,registerNgo);
NgoRoute.route("/login").post(loginNgo);
NgoRoute.route("/profile").get(authNgo,getNgoProfile);
NgoRoute.route("/updateprofile").post(authNgo,updateNgoProfile);
NgoRoute.route("/updatepassword").post(authNgo,updatePassword);
NgoRoute.route("/deleteaccount").delete(authNgo,deleteAccount);

export default NgoRoute;
