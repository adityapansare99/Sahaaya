import Router from "express";
import { authAnyParty } from "../middleware/auth.middleware.js";
import {
  getTrackByRide,
  getRideByDonation,
} from "../controller/track.controller.js";

const trackRoute = Router();

trackRoute.route("/by-donation/:donationId").get(authAnyParty, getRideByDonation);
trackRoute.route("/:rideId").get(authAnyParty, getTrackByRide);

export default trackRoute;
