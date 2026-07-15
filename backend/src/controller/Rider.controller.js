import { asynchandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import Ride from "../model/ride.model.js";
import { donations } from "./Receiver.controller.js";
import Donation from "../model/donation.model.js";

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
      0
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
        ride.donation.ExpiryTime
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
    { new: true }
  );

  if (!response) {
    return res
      .status(409)
      .json(new ApiResponse(409, {}, "Ride already accepted by another partner"));
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
    { new: true }
  );

  if (!response) {
    return res
      .status(409)
      .json(new ApiResponse(409, {}, "Ride cannot be marked as picked up — already in a different state"));
  }

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

  const response = await Ride.findOneAndUpdate(
    { _id: rideId, status: "picked up" },
    { status: "completed" },
    { new: true }
  );

  if (!response) {
    return res
      .status(409)
      .json(new ApiResponse(409, {}, "Ride already completed or cannot be marked complete in current state"));
  }

  if (response.donation) {
    await Donation.findByIdAndUpdate(
      response.donation,
      { Status: "Completed" },
      { new: true }
    );
  }

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

export {
  allRides,
  acceptRide,
  getRides,
  markPicked,
  markCompeted,
  getAllRides,
};
