import Router from "express"
import {donations,acceptOrder,receivedDonations} from "../controller/Receiver.controller.js"
import {authNgo} from "../middleware/auth.middleware.js"

const receiverRouter=Router();

receiverRouter.route("/donations").get(authNgo,donations);
receiverRouter.route("/acceptOrder").put(authNgo,acceptOrder);
receiverRouter.route("/receivedDonations").get(authNgo,receivedDonations);

export default receiverRouter