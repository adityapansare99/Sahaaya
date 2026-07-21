import { asynchandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import Donation from "../model/donation.model.js";
import NGO from "../model/ngo.model.js";
import { sendMessageToSocketId, broadcastToUserType } from "../socket.js";
import { haversineDistance } from "../utils/haversine.js";

// Coerce a numeric field from req.body into a non-negative Number (defaults to 0).
const toNonNegativeNumber = (value) => {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : 0;
};

//create a donation
const createDonation = asynchandler(async (req, res) => {
  const {
    donorType,
    foodType,
    description,
    pickup,
    expiryDate,
    expiryTime,
    weightKg,
    serves,
    pickupLatitude,
    pickupLongitude,
  } = req.body;
  const donor = req.donor;

  if (
    [donorType, foodType, description, pickup, expiryDate, expiryTime].some(
      (field) => !field || String(field).trim().length === 0
    )
  ) {
    return res
      .status(400)
      .json(new ApiResponse(400, {}, "All fields are required"));
  }

  const donation = await Donation.create({
    Donor: donor._id,
    FoodType: foodType,
    FoodDescription: description,
    PickupLocation: pickup,
    ExpiryDate: expiryDate,
    ExpiryTime: expiryTime,
    typeOfDonor: donorType,
    weightKg: toNonNegativeNumber(weightKg),
    serves: toNonNegativeNumber(serves),
    pickupLatitude: pickupLatitude != null ? Number(pickupLatitude) : null,
    pickupLongitude: pickupLongitude != null ? Number(pickupLongitude) : null,
  });

  if (!donation) {
    return res
      .status(400)
      .json(new ApiResponse(400, {}, "Donation creation failed"));
  }

  const reponse = await Donation.findById(donation._id)
    .populate("Donor")
    .populate("Ngo");

  if (!reponse) {
    return res
      .status(400)
      .json(new ApiResponse(400, {}, "Donation creation failed"));
  }

  // Notify only NGOs within 20km of the pickup location
  if (reponse.pickupLatitude != null && reponse.pickupLongitude != null) {
    try {
      const allNgos = await NGO.find({ approved: true });
      for (const ngo of allNgos) {
        const dist = haversineDistance(
          reponse.pickupLatitude,
          reponse.pickupLongitude,
          ngo.latitude,
          ngo.longitude
        );
        if (dist !== null && dist <= 20) {
          sendMessageToSocketId(ngo.socketId, {
            event: "newDonation",
            data: { donation: reponse, distanceKm: Math.round(dist * 10) / 10 },
          });
        }
      }
    } catch (err) {
      console.error("[donation] Error sending proximity notifications:", err.message);
    }
  } else {
    // Fallback: no coordinates — broadcast to all
    broadcastToUserType("ngo", { event: "newDonation", data: { donation: reponse } });
  }

  return res
    .status(201)
    .json(new ApiResponse(201, reponse, "Donation created successfully"));
});

//get all the donations
const getAllDonations = asynchandler(async (req, res) => {
  const donor = req.donor;

  if (!donor) {
    return res
      .status(401)
      .json(new ApiResponse(401, {}, "Please login to continue"));
  }

  const donations = await Donation.find({ Donor: donor._id })
    .populate("Ngo")
    .populate("Donor");

  return res
    .status(200)
    .json(
      new ApiResponse(200, donations, "All donations fetched successfully")
    );
});

//edit the donoation
const editDonation = asynchandler(async (req, res) => {
  const donor = req.donor;

  const {
    donationId,
    foodType,
    description,
    pickup,
    expiryDate,
    expiryTime,
    weightKg,
    serves,
  } = req.body;

  if (
    [foodType, description, pickup, expiryDate, expiryTime].some(
      (field) => !field || String(field).trim().length === 0
    )
  ) {
    return res
      .status(400)
      .json(new ApiResponse(400, {}, "All fields are required"));
  }

  const donation = await Donation.findByIdAndUpdate(donationId, {
    FoodType: foodType,
    FoodDescription: description,
    PickupLocation: pickup,
    ExpiryDate: expiryDate,
    ExpiryTime: expiryTime,
    weightKg: toNonNegativeNumber(weightKg),
    serves: toNonNegativeNumber(serves),
  });

  donation.save();

  const updatedDonation = await Donation.findById(donation._id)
    .populate("Ngo")
    .populate("Donor");

  if (!updatedDonation) {
    return res
      .status(400)
      .json(new ApiResponse(400, {}, "Donation creation failed"));
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedDonation, "Donation updated successfully")
    );
});

//delete the donation
const deleteDonation = asynchandler(async (req, res) => {
  const donor = req.donor;
  const { donationId } = req.body;

  if (!donor) {
    return res
      .status(401)
      .json(new ApiResponse(401, {}, "Please login to continue"));
  }

  if (!donationId || donationId.trim().length === 0) {
    return res.status(400).json(new ApiResponse(400, {}, "Donation not found"));
  }

  const donation = await Donation.findByIdAndDelete(donationId);

  if (!donation) {
    return res.status(400).json(new ApiResponse(400, {}, "Donation not found"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, donation, "Donation deleted successfully"));
});

export { createDonation, getAllDonations, editDonation, deleteDonation };
