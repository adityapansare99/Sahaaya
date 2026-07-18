import { asynchandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import Ride from "../model/ride.model.js";
import { donations } from "./Receiver.controller.js";
import Donation from "../model/donation.model.js";
import Delivery from "../model/delivery.model.js";
import Redemption from "../model/redemption.model.js";
import Partner from "../model/partner.model.js";
import crypto from "crypto";
import { sendMessageToSocketId } from "../socket.js";
import { sendReceipt } from "../service/emailService.js";

const allRides = asynchandler(async (req, res) => {
  const partner = req.partner;

  if (!partner) {
    return res
      .status(404)
      .json(new ApiResponse(404, {}, "No delivery partner found"));
  }

  let rides = await Ride.find({ status: "pending" })
    .populate("donor")
    .populate("receiver")
    .populate("donation");

  const combineDateAndTime = (dateStr, timeStr) => {
    const date = new Date(dateStr);
    const [hours, minutes] = timeStr.split(":").map(Number);

    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      hours,
      minutes,
      0,
      0,
    );
  };

  const getRemainingTime = (expiry) => {
    const now = new Date();
    let diff = expiry - now;

    if (diff <= 0) return null;

    const hours = Math.floor(diff / (1000 * 60 * 60));
    diff -= hours * 1000 * 60 * 60;

    const minutes = Math.floor(diff / (1000 * 60));

    return `${hours}:${minutes}`;
  };

  rides = rides
    .map((ride) => {
      if (donations === null) {
        console.log(ride);
      }
      const expiry = combineDateAndTime(
        ride.donation.ExpiryDate,
        ride.donation.ExpiryTime,
      );

      const timeLeft = getRemainingTime(expiry);

      if (!timeLeft) return null;

      ride = ride.toObject();
      ride.timeLeft = timeLeft;

      return ride;
    })
    .filter((ride) => ride !== null);

  if (!rides) {
    return res.status(404).json(new ApiResponse(404, {}, "No rides found"));
  }

  res
    .status(200)
    .json(new ApiResponse(200, rides, "Rides fetched successfully"));
});

const acceptRide = asynchandler(async (req, res) => {
  const partner = req.partner;

  if (!partner) {
    return res
      .status(401)
      .json(new ApiResponse(401, {}, "Please login to continue"));
  }

  const { rideId } = req.body;

  if (!rideId || !rideId.trim()) {
    return res.status(401).json(new ApiResponse(401, {}, "Ride not found"));
  }

  const response = await Ride.findOneAndUpdate(
    { _id: rideId, status: "pending", rider: null },
    { status: "accepted", rider: partner._id },
    { new: true },
  );

  if (!response) {
    return res
      .status(409)
      .json(
        new ApiResponse(409, {}, "Ride already accepted by another partner"),
      );
  }

  const rideResponse = await Ride.findById(rideId)
    .populate("donor")
    .populate("receiver")
    .populate("donation");

  res
    .status(200)
    .json(new ApiResponse(200, rideResponse, "Ride accepted successfully"));
});

const getRides = asynchandler(async (req, res) => {
  const partner = req.partner;

  if (!partner) {
    return res
      .status(401)
      .json(new ApiResponse(401, {}, "Please login to continue"));
  }

  const rides = await Ride.find({
    rider: partner._id,
    status: { $ne: "completed" },
  })
    .populate("donor")
    .populate("receiver")
    .populate("donation");

  if (!rides) {
    return res.status(401).json(new ApiResponse(401, {}, "No rides found"));
  }

  res
    .status(200)
    .json(new ApiResponse(200, rides, "Rides fetched successfully"));
});

const markPicked = asynchandler(async (req, res) => {
  const partner = req.partner;

  if (!partner) {
    return res
      .status(401)
      .json(new ApiResponse(401, {}, "Please login to continue"));
  }

  const { rideId } = req.body;

  if (!rideId || !rideId.trim()) {
    return res.status(401).json(new ApiResponse(401, {}, "Ride not found"));
  }

  const response = await Ride.findOneAndUpdate(
    { _id: rideId, status: "accepted" },
    { status: "picked up" },
    { new: true },
  );

  if (!response) {
    return res
      .status(409)
      .json(
        new ApiResponse(
          409,
          {},
          "Ride cannot be marked as picked up — already in a different state",
        ),
      );
  }

  // Notify the donor and the NGO that the food has been picked up.
  const ride = await Ride.findById(response._id)
    .populate("donor")
    .populate("receiver");
  sendMessageToSocketId(ride?.donor?.socketId, {
    event: "statusUpdate",
    data: { ride, status: "picked up" },
  });
  sendMessageToSocketId(ride?.receiver?.socketId, {
    event: "statusUpdate",
    data: { ride, status: "picked up" },
  });

  res.status(200).json(new ApiResponse(200, {}, "Ride picked up successfully"));
});

const markCompeted = asynchandler(async (req, res) => {
  const partner = req.partner;

  if (!partner) {
    return res
      .status(401)
      .json(new ApiResponse(401, {}, "Please login to continue"));
  }

  const { rideId } = req.body;

  if (!rideId || !rideId.trim()) {
    return res.status(401).json(new ApiResponse(401, {}, "Ride not found"));
  }

  const POINTS_PER_DELIVERY = 10;

  const response = await Ride.findOneAndUpdate(
    { _id: rideId, status: "picked up" },
    { status: "completed", points: POINTS_PER_DELIVERY },
    { new: true },
  );

  if (!response) {
    return res
      .status(409)
      .json(
        new ApiResponse(
          409,
          {},
          "Ride already completed or cannot be marked complete in current state",
        ),
      );
  }

  if (response.donation) {
    await Donation.findByIdAndUpdate(
      response.donation,
      { Status: "Completed" },
      { new: true },
    );
  }

  // Re-fetch so we emit accurate points (req.partner is pre-increment).
  const updatedPartner = await Delivery.findByIdAndUpdate(
    partner._id,
    {
      $inc: {
        points: POINTS_PER_DELIVERY,
        totalDeliveries: 1,
      },
    },
    { new: true },
  );

  // Notify donor + NGO of completion, and the rider of points earned.
  const ride = await Ride.findById(response._id)
    .populate("donor")
    .populate("receiver");
  sendMessageToSocketId(ride?.donor?.socketId, {
    event: "statusUpdate",
    data: { ride, status: "completed" },
  });
  sendMessageToSocketId(ride?.receiver?.socketId, {
    event: "statusUpdate",
    data: { ride, status: "completed" },
  });
  sendMessageToSocketId(updatedPartner?.socketId, {
    event: "pointsAwarded",
    data: {
      points: updatedPartner?.points ?? 0,
    },
  });

  res.status(200).json(new ApiResponse(200, {}, "Ride completed successfully"));
});

const getAllRides = asynchandler(async (req, res) => {
  const partner = req.partner;

  if (!partner) {
    return res
      .status(401)
      .json(new ApiResponse(401, {}, "Please login to continue"));
  }

  const response = await Ride.find({ rider: partner._id })
    .populate("donor")
    .populate("receiver")
    .populate("donation");

  if (!response) {
    return res.status(401).json(new ApiResponse(401, {}, "No rides found"));
  }

  res
    .status(200)
    .json(new ApiResponse(200, response, "Rides fetched successfully"));
});

const getRewards = asynchandler(async (req, res) => {
  const partner = req.partner;

  if (!partner) {
    return res
      .status(401)
      .json(new ApiResponse(401, {}, "Please login to continue"));
  }

  const totalDeliveries = partner.totalDeliveries || 0;

  const MILESTONES = [
    { milestone: "50 Deliveries", threshold: 50, reward: "500 Points" },
    { milestone: "100 Deliveries", threshold: 100, reward: "1000 Points" },
    { milestone: "250 Deliveries", threshold: 250, reward: "2500 Points" },
    { milestone: "500 Deliveries", threshold: 500, reward: "5000 Points" },
  ];

  let foundInProgress = false;
  const milestones = MILESTONES.map((m) => {
    if (totalDeliveries >= m.threshold) {
      return { ...m, status: "completed", progress: 100 };
    }
    if (!foundInProgress) {
      foundInProgress = true;
      const progress = Math.round((totalDeliveries / m.threshold) * 100);
      return { ...m, status: "in-progress", progress };
    }
    return { ...m, status: "upcoming", progress: 0 };
  });

  res.status(200).json(
    new ApiResponse(
      200,
      {
        points: partner.points || 0,
        redeemedPoints: partner.redeemedPoints || 0,
        totalDeliveries,
        rating: partner.rating || 0,
        milestones,
      },
      "Rewards fetched successfully",
    ),
  );
});

const generateBookingCode = () =>
  `SAH-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;

const redeemPoints = asynchandler(async (req, res) => {
  const rider = req.partner;

  if (!rider) {
    return res
      .status(401)
      .json(new ApiResponse(401, {}, "Please login to continue"));
  }

  const { partnerId } = req.body;

  if (!partnerId) {
    return res
      .status(400)
      .json(new ApiResponse(400, {}, "Partner is required"));
  }

  const partner = await Partner.findOne({ _id: partnerId, isActive: true });

  if (!partner) {
    return res
      .status(404)
      .json(new ApiResponse(404, {}, "Partner not found or inactive"));
  }

  const pointsRequired = partner.pointsRequired || 0;

  if (pointsRequired <= 0) {
    return res
      .status(400)
      .json(new ApiResponse(400, {}, "This partner has no redemption set"));
  }

  const updatedRider = await Delivery.findOneAndUpdate(
    { _id: rider._id, points: { $gte: pointsRequired } },
    { $inc: { points: -pointsRequired, redeemedPoints: pointsRequired } },
    { new: true },
  );

  if (!updatedRider) {
    return res
      .status(400)
      .json(new ApiResponse(400, {}, "Insufficient points to redeem"));
  }

  console.log("booking code:", await generateBookingCode());

  // Points are spent — create the redemption record. Retry on bookingCode
  // collision (unique index); if it still fails, refund so the rider isn't charged.
  let redemption;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      redemption = await Redemption.create({
        rider: rider._id,
        partner: partner._id,
        pointsUsed: pointsRequired,
        discountPercentage: partner.discountPercentage,
        bookingCode:await generateBookingCode(),
      });
      break;
    } catch (error) {
      const isDuplicate = error.code === 11000;
      if (isDuplicate && attempt < 2) {
        continue;
      }
      await Delivery.findByIdAndUpdate(rider._id, {
        $inc: { points: pointsRequired, redeemedPoints: -pointsRequired },
      });
      console.log(error);
      return res
        .status(500)
        .json(new ApiResponse(500, {}, "Unable to create redemption"));
    }
  }

  // Receipt is best-effort: a missing/failed email must not fail the redemption.
  const emailResult = await sendReceipt({
    redemption,
    rider: updatedRider,
    partner,
  });

  res.status(201).json(
    new ApiResponse(
      201,
      {
        bookingCode: redemption.bookingCode,
        partner: partner.name,
        discountPercentage: redemption.discountPercentage,
        pointsUsed: redemption.pointsUsed,
        remainingPoints: updatedRider.points,
        receiptSent: emailResult.sent,
      },
      "Points redeemed successfully",
    ),
  );
});

const myRedemptions = asynchandler(async (req, res) => {
  const rider = req.partner;

  if (!rider) {
    return res.status(401).json(new ApiResponse(401, {}, "Please login to continue"));
  }

  const redemptions = await Redemption.find({ rider: rider._id })
    .populate("partner", "name logo address discountPercentage")
    .sort({ createdAt: -1 }).limit(5);

  res.status(200).json(new ApiResponse(200, redemptions, "Redemptions fetched successfully"));
});

export {
  allRides,
  acceptRide,
  getRides,
  markPicked,
  markCompeted,
  getAllRides,
  getRewards,
  redeemPoints,
  myRedemptions,
};
