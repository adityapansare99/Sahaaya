import Router from "express"
import {allRides,acceptRide,getRides,markPicked,markCompeted,getAllRides} from "../controller/Rider.controller.js"
import { authPartner } from "../middleware/auth.middleware.js";

const riderRouter=Router();

riderRouter.route("/allRides").get(authPartner,allRides);
riderRouter.route("/acceptRide").put(authPartner,acceptRide);
riderRouter.route("/getRides").get(authPartner,getRides);
riderRouter.route("/markPicked").put(authPartner,markPicked);
riderRouter.route("/markCompeted").put(authPartner,markCompeted);
riderRouter.route("/getAllRides").get(authPartner,getAllRides);

export default riderRouter