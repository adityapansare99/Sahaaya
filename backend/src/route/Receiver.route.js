import Router from "express"
import {donations,acceptOrder,receivedDonations,completedDeliveries,rateDelivery} from "../controller/Receiver.controller.js"
import {authNgo} from "../middleware/auth.middleware.js"

const receiverRouter=Router();

receiverRouter.route("/donations").get(authNgo,donations);
receiverRouter.route("/acceptOrder").put(authNgo,acceptOrder);
receiverRouter.route("/receivedDonations").get(authNgo,receivedDonations);
receiverRouter.route("/completedDeliveries").get(authNgo,completedDeliveries);
receiverRouter.route("/rateDelivery").post(authNgo,rateDelivery);

export default receiverRouter