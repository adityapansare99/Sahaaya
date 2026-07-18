import Router from "express";
import {
  login, getDashboard,
  getNGOs, toggleNGOApproval, deleteNGO,
  getDonors, toggleDonorApproval, deleteDonor,
  getDelivery, toggleDeliveryApproval, deleteDelivery,
  getPartners, togglePartnerApproval, deletePartner,
  getDonations, getRides,
} from "../controller/admin.controller.js";
import adminAuth from "../middleware/adminAuth.middleware.js";

const adminRoute = Router();

adminRoute.route("/login").post(login);
adminRoute.route("/dashboard").get(adminAuth, getDashboard);
adminRoute.route("/ngos").get(adminAuth, getNGOs);
adminRoute.route("/ngos/:id/approve").put(adminAuth, toggleNGOApproval);
adminRoute.route("/ngos/:id").delete(adminAuth, deleteNGO);
adminRoute.route("/donors").get(adminAuth, getDonors);
adminRoute.route("/donors/:id/approve").put(adminAuth, toggleDonorApproval);
adminRoute.route("/donors/:id").delete(adminAuth, deleteDonor);
adminRoute.route("/delivery").get(adminAuth, getDelivery);
adminRoute.route("/delivery/:id/approve").put(adminAuth, toggleDeliveryApproval);
adminRoute.route("/delivery/:id").delete(adminAuth, deleteDelivery);
adminRoute.route("/partners").get(adminAuth, getPartners);
adminRoute.route("/partners/:id/approve").put(adminAuth, togglePartnerApproval);
adminRoute.route("/partners/:id").delete(adminAuth, deletePartner);
adminRoute.route("/donations").get(adminAuth, getDonations);
adminRoute.route("/rides").get(adminAuth, getRides);

export default adminRoute;
