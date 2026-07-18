import Donation from "../model/donation.model.js";
import {ApiResponse} from "../utils/apiResponse.js";
import { asynchandler } from "../utils/asyncHandler.js";

const healthcheck=asynchandler(async(req,res)=>{
    res.status(200).json(new ApiResponse(200, null, "Server is working fine"));
})

const publicStats = asynchandler(async (req, res) => {
  const totalDonations = await Donation.countDocuments();
  const completedDonations = await Donation.countDocuments({ Status: "Completed" });
  const totalMeals = await Donation.aggregate([
    { $match: { Status: "Completed" } },
    { $group: { _id: null, total: { $sum: "$serves" } } },
  ]);

  res.status(200).json(
    new ApiResponse(200, {
      totalDonations,
      completedDonations,
      totalMealsServed: totalMeals.length > 0 ? totalMeals[0].total : 0,
    })
  );
});

export {healthcheck, publicStats};