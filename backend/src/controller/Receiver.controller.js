import { asynchandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import Donation from "../model/donation.model.js";
import Ride from "../model/ride.model.js";
import Delivery from "../model/delivery.model.js";
import { sendMessageToSocketId, broadcastToUserType } from "../socket.js";

//take the donation with pending and not expired
const donations = asynchandler(async (req, res) => {
  try {
    const Ngo = req.Ngo;

    if (!Ngo) {
      return res
        .status(401)
        .json(new ApiResponse(401, {}, "Please login to continue"));
    }

    let donations = await Donation.find({
      Status: "Pending",
    })
      .populate("Donor")
      .populate("Ngo");

    //logic for the get distance donation
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

    donations = donations
      .map((donation) => {
        const expiry = combineDateAndTime(
          donation.ExpiryDate,
          donation.ExpiryTime
        );

        const timeLeft = getRemainingTime(expiry);

        if (!timeLeft) return null;

        donation = donation.toObject();
        donation.timeLeft = timeLeft;

        return donation;
      })
      .filter((donation) => donation !== null);

    return res
      .status(200)
      .json(new ApiResponse(200, donations, "Donations fetched successfully"));
  } catch (error) {
    console.log(error);
  }
});

const acceptOrder = asynchandler(async (req, res) => {
  const Ngo = req.Ngo;

  if (!Ngo) {
    return res
      .status(401)
      .json(new ApiResponse(401, {}, "Please login to continue"));
  }

  const { donationId } = req.body;

  if (!donationId || !donationId.trim()) {
    return res.status(401).json(new ApiResponse(401, {}, "Donation not found"));
  }

  const reponse = await Donation.findOneAndUpdate(
    { _id: donationId, Status: "Pending" },
    { Status: "Accepted", Ngo: Ngo._id },
    { new: true }
  );

  if (!reponse) {
    return res
      .status(409)
      .json(new ApiResponse(409, {}, "Donation already accepted by another NGO or not found"));
  }

  const donationResponse = await Donation.findById(donationId)
    .populate("Donor")
    .populate("Ngo");

  const ride = await Ride.create({
    donor: donationResponse.Donor._id,
    receiver: donationResponse.Ngo._id,
    pickup: donationResponse.PickupLocation,
    destination: donationResponse.Ngo.address,
    donation: donationResponse._id,
  });

  // add the time and distance logic here

  if (!ride) {
    return res.status(401).json(new ApiResponse(401, {}, "Ride not created"));
  }

  const rideResponse = await Ride.findById(ride._id)
    .populate("donor")
    .populate("receiver")
    .populate("donation");

  if (!rideResponse) {
    return res.status(401).json(new ApiResponse(401, {}, "Ride not found"));
  }

  // Tell the donor their donation was accepted, and alert all riders to the new ride.
  sendMessageToSocketId(donationResponse.Donor?.socketId, {
    event: "donationAccepted",
    data: { donation: donationResponse },
  });
  broadcastToUserType("delivery", {
    event: "rideCreated",
    data: { ride: rideResponse },
  });

  res
    .status(200)
    .json(new ApiResponse(200, rideResponse, "Donation accepted successfully"));
});

const receivedDonations = asynchandler(async (req, res) => {
  const Ngo = req.Ngo;

  if (!Ngo) {
    return res
      .status(401)
      .json(new ApiResponse(401, {}, "Please login to continue"));
  }

  const NgoId = Ngo._id;

  const response = await Donation.find({ Ngo: NgoId }).populate("Donor");

  if (!response) {
    return res.status(401).json(new ApiResponse(401, {}, "No donations found"));
  }

  const total = response.length;
  const completed = response.filter((item) => item.Status === "Completed").length;

  const pending = response.filter((item) => item.Status === "Accepted").length;

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { response, total, completed, pending },
        "Donations fetched successfully"
      )
    );
});

// ─── Rating system ─────────────────────────────────────────

const completedDeliveries = asynchandler(async (req, res) => {
  const Ngo = req.Ngo;

  if (!Ngo) {
    return res
      .status(401)
      .json(new ApiResponse(401, {}, "Please login to continue"));
  }

  const rides = await Ride.find({
    receiver: Ngo._id,
    status: "completed",
  })
    .populate("donor", "name email")
    .populate("rider", "name phone")
    .populate("donation", "FoodType FoodDescription Quantity ExpiryDate")
    .sort({ updatedAt: -1 });

  res
    .status(200)
    .json(new ApiResponse(200, rides, "Completed deliveries fetched successfully"));
});

const rateDelivery = asynchandler(async (req, res) => {
  const Ngo = req.Ngo;
  const { rideId, rating } = req.body;

  if (!Ngo) {
    return res
      .status(401)
      .json(new ApiResponse(401, {}, "Please login to continue"));
  }

  if (!rideId || !rideId.trim()) {
    return res.status(400).json(new ApiResponse(400, {}, "Ride ID is required"));
  }

  const ratingNum = Number(rating);
  if (!Number.isInteger(ratingNum) || ratingNum < 1 || ratingNum > 5) {
    return res
      .status(400)
      .json(new ApiResponse(400, {}, "Rating must be an integer between 1 and 5"));
  }

  // Find the ride and verify it belongs to this NGO
  const ride = await Ride.findOne({
    _id: rideId,
    receiver: Ngo._id,
    status: "completed",
  }).populate("rider");

  if (!ride) {
    return res
      .status(404)
      .json(new ApiResponse(404, {}, "Completed ride not found"));
  }

  if (ride.riderRating > 0) {
    return res
      .status(400)
      .json(new ApiResponse(400, {}, "Rider already rated for this delivery"));
  }

  if (!ride.rider) {
    return res
      .status(400)
      .json(new ApiResponse(400, {}, "No rider assigned to this ride"));
  }

  // Update the ride with the rating
  ride.riderRating = ratingNum;
  await ride.save();

  // Recalculate the rider's average rating across all completed rides
  const allRides = await Ride.find({
    rider: ride.rider._id,
    riderRating: { $gt: 0 },
  });

  const totalRatings = allRides.length;
  const sumRatings = allRides.reduce((sum, r) => sum + r.riderRating, 0);
  const averageRating = Math.round((sumRatings / totalRatings) * 10) / 10;

  await Delivery.findByIdAndUpdate(ride.rider._id, { rating: averageRating });

  // Notify the rider they got a rating
  sendMessageToSocketId(ride.rider.socketId, {
    event: "riderRated",
    data: { rating: ratingNum, averageRating },
  });

  res.status(200).json(
    new ApiResponse(200, { rating: ratingNum, averageRating }, "Rating submitted successfully")
  );
});

export { donations, acceptOrder, receivedDonations, completedDeliveries, rateDelivery };
