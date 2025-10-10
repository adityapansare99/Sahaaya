import Router from "express";
import {createDonation,getAllDonations,editDonation,deleteDonation} from "../controller/Donation.controller.js";
import { authDonor } from "../middleware/auth.middleware.js";

const donationRouter=Router();

donationRouter.route("/createDonation").post(authDonor,createDonation);
donationRouter.route("/getAllDonations").get(authDonor,getAllDonations);
donationRouter.route("/editDonation").put(authDonor,editDonation);
donationRouter.route("/deleteDonation").delete(authDonor,deleteDonation);

export default donationRouter;