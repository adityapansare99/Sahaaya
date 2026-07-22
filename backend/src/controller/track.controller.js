import { asynchandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import Ride from "../model/ride.model.js";

const getTrackByRide = asynchandler(async (req, res) => {
  const { rideId } = req.params;

  const ride = await Ride.findById(rideId)
    .populate("donor")
    .populate("receiver")
    .populate("donation")
    .populate("rider");

  if (!ride) {
    return res.status(404).json(new ApiResponse(404, {}, "Ride not found"));
  }

  const me = String(req.user._id);
  const isParty =
    (ride.donor && String(ride.donor._id) === me) ||
    (ride.receiver && String(ride.receiver._id) === me) ||
    (ride.rider && String(ride.rider._id) === me);

  if (!isParty) {
    return res
      .status(403)
      .json(new ApiResponse(403, {}, "Not authorized for this ride"));
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        status: ride.status,
        pickup: {
          lat: ride.donation?.pickupLatitude ?? null,
          lng: ride.donation?.pickupLongitude ?? null,
          label: ride.donation?.PickupLocation || ride.pickup || "Pickup",
        },
        destination: {
          lat: ride.receiver?.latitude ?? null,
          lng: ride.receiver?.longitude ?? null,
          label: ride.receiver?.address || ride.destination || "Destination",
        },
        rider: ride.rider
          ? {
              lat: ride.rider.latitude ?? null,
              lng: ride.rider.longitude ?? null,
              name: ride.rider.name || "",
              lastActiveAt: ride.rider.lastActiveAt ?? null,
            }
          : null,
        riderId: ride.rider ? String(ride.rider._id) : null,
        rideId: String(ride._id),
        viewerRole: req.user.role,
        viewerIsRider:
          req.user.role === "delivery" &&
          !!ride.rider &&
          String(ride.rider._id) === String(req.user._id),
      },
      "Track data fetched successfully",
    ),
  );
});

const getRideByDonation = asynchandler(async (req, res) => {
  const { donationId } = req.params;

  const ride = await Ride.findOne({
    donation: donationId,
    status: { $in: ["accepted", "picked up"] },
  })
    .populate("donor")
    .populate("receiver")
    .populate("rider");

  if (!ride) {
    return res
      .status(404)
      .json(new ApiResponse(404, {}, "No active ride for this donation"));
  }

  const me = String(req.user._id);
  const ok =
    (req.user.role === "donor" &&
      ride.donor &&
      String(ride.donor._id) === me) ||
    (req.user.role === "ngo" &&
      ride.receiver &&
      String(ride.receiver._id) === me) ||
    (req.user.role === "delivery" &&
      ride.rider &&
      String(ride.rider._id) === me);

  if (!ok) {
    return res
      .status(403)
      .json(new ApiResponse(403, {}, "Not authorized for this ride"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { rideId: String(ride._id) }, "Ride resolved"));
});

export { getTrackByRide, getRideByDonation };
