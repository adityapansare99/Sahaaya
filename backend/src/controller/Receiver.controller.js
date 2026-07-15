import { asynchandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import Donation from "../model/donation.model.js";
import Ride from "../model/ride.model.js";

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

export { donations, acceptOrder, receivedDonations };
