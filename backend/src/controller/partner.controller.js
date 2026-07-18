import Partner from "../model/partner.model.js";
import Redemption from "../model/redemption.model.js";
import { asynchandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { uploadoncloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";

const registerPartner = asynchandler(async (req, res) => {
  const data = req.body;

  const {
    name,
    email,
    phone,
    address,
    password,
    discountPercentage,
    pointsRequired,
    description,
  } = data;

  const image = req.file;

  if (
    [name, email, phone, address, password].some(
      (item) => !item || String(item).trim().length === 0,
    )
  ) {
    return res
      .status(400)
      .json(new ApiResponse(400, {}, "All fields are required"));
  }

  if (password.length < 6) {
    return res
      .status(400)
      .json(new ApiResponse(400, {}, "Password must be at least 6 characters"));
  }

  const existing = await Partner.findOne({ email });

  if (existing) {
    return res
      .status(400)
      .json(new ApiResponse(400, {}, "Email already registered"));
  }

  try {
    const partner = await Partner.create({
      name,
      email,
      phone,
      address,
      password,
      discountPercentage: discountPercentage || 10,
      pointsRequired: pointsRequired || 50,
      description: description || "",
    });

    if (!partner) {
      return res
        .status(500)
        .json(new ApiResponse(500, {}, "Error in partner registration"));
    }

    if (image) {
      const imageurl = await uploadoncloudinary(image.path);

      if (imageurl) {
        await Partner.findByIdAndUpdate(partner._id, { logo: imageurl.url });
      }
    }

    const token = jwt.sign(
      { email: partner.email, type: "partner" },
      process.env.refreshtoken,
      { expiresIn: process.env.refreshtime },
    );

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    };

    const finalPartner = await Partner.findById(partner._id);

    res
      .status(201)
      .cookie("refreshtoken", token, options)
      .json(
        new ApiResponse(
          201,
          { finalPartner, token },
          "Partner registered successfully",
        ),
      );
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json(new ApiResponse(500, {}, "Error in partner registration"));
  }
});

const loginPartner = asynchandler(async (req, res) => {
  const { email, password } = req.body;

  if (
    [email, password].some((item) => !item || String(item).trim().length === 0)
  ) {
    return res
      .status(400)
      .json(new ApiResponse(400, {}, "All fields are required"));
  }

  const partner = await Partner.findOne({ email });

  if (!partner) {
    return res
      .status(400)
      .json(new ApiResponse(400, {}, "Invalid credentials"));
  }

  const isPasswordCorrect = await partner.isPasswordCorrect(password);

  if (!isPasswordCorrect) {
    return res.status(400).json(new ApiResponse(400, {}, "Invalid password"));
  }

  const token = jwt.sign(
    { email: partner.email, type: "partner" },
    process.env.refreshtoken,
    { expiresIn: process.env.refreshtime },
  );

  if (!token) {
    return res
      .status(500)
      .json(new ApiResponse(500, {}, "Unable to login, try again later"));
  }

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  res
    .status(200)
    .cookie("refreshtoken", token, options)
    .json(new ApiResponse(200, { partner, token }, "Login successful"));
});

const getPartnerProfile = asynchandler(async (req, res) => {
  const partner = req.partner;

  if (!partner) {
    return res.status(404).json(new ApiResponse(404, {}, "No partner found"));
  }

  res
    .status(200)
    .json(new ApiResponse(200, partner, "Profile fetched successfully"));
});

const updatePartnerProfile = asynchandler(async (req, res) => {
  const partner = req.partner;

  if (!partner) {
    return res.status(404).json(new ApiResponse(404, {}, "No partner found"));
  }

  // Support both JSON and multipart/form-data
  const body = req.body?.data ? JSON.parse(req.body.data) : req.body;

  const {
    name,
    phone,
    address,
    discountPercentage,
    pointsRequired,
    description,
  } = body;

  const updateData = {
    ...(name && { name }),
    ...(phone && { phone }),
    ...(address && { address }),
    ...(discountPercentage && { discountPercentage }),
    ...(pointsRequired && { pointsRequired }),
    ...(description !== undefined && { description }),
  };

  // Handle logo upload
  if (req.file) {
    const imageurl = await uploadoncloudinary(req.file.path);
    if (imageurl) {
      updateData.logo = imageurl.url;
    }
  }

  const updated = await Partner.findByIdAndUpdate(
    partner._id,
    updateData,
    { new: true },
  );

  if (!updated) {
    return res
      .status(500)
      .json(new ApiResponse(500, {}, "Unable to update profile"));
  }

  res
    .status(200)
    .json(new ApiResponse(200, updated, "Profile updated successfully"));
});

const updatePassword = asynchandler(async (req, res) => {
  const partner = req.partner;

  if (!partner) {
    return res.status(404).json(new ApiResponse(404, {}, "No partner found"));
  }

  const { oldpassword, newpassword } = req.body;

  if ([oldpassword, newpassword].some((item) => !item || String(item).trim().length === 0)) {
    return res.status(400).json(new ApiResponse(400, {}, "All fields are required"));
  }

  if (newpassword.length < 6) {
    return res.status(400).json(new ApiResponse(400, {}, "Password must be at least 6 characters"));
  }

  const isPasswordCorrect = await partner.isPasswordCorrect(oldpassword);

  if (!isPasswordCorrect) {
    return res.status(400).json(new ApiResponse(400, {}, "Old password is incorrect"));
  }

  partner.password = newpassword;
  const updated = await partner.save();

  if (!updated) {
    return res.status(500).json(new ApiResponse(500, {}, "Unable to update password"));
  }

  res.status(200).json(new ApiResponse(200, {}, "Password updated successfully"));
});

const deleteAccount = asynchandler(async (req, res) => {
  const partner = req.partner;

  if (!partner) {
    return res.status(404).json(new ApiResponse(404, {}, "No partner found"));
  }

  await Partner.findByIdAndDelete(partner._id);

  res.status(200).json(new ApiResponse(200, {}, "Account deleted successfully"));
});

const getActivePartners = asynchandler(async (req, res) => {
  const activePartners = await Partner.find({ isActive: true }).select("-password -__v");
  res
    .status(200)
    .json(
      new ApiResponse(200, activePartners, "Partners fetched successfully"),
    );
});

const getPartnerRedemptions = asynchandler(async (req, res) => {
  const partner = req.partner;

  if (!partner) {
    return res
      .status(404)
      .json(new ApiResponse(404, {}, "No partner found"));
  }

  const redemptions = await Redemption.find({ partner: partner._id })
    .populate("rider", "name email phone address")
    .sort({ createdAt: -1 });

  res
    .status(200)
    .json(
      new ApiResponse(200, redemptions, "Redemptions fetched successfully"),
    );
});

// Public popularity board — top 5 partners by redemption count.
// Aggregates from Redemption so a partner with no redemptions never appears.
const getTopPartners = asynchandler(async (req, res) => {
  const top = await Redemption.aggregate([
    { $group: { _id: "$partner", redemptionCount: { $sum: 1 } } },
    {
      $lookup: {
        from: "partners",
        localField: "_id",
        foreignField: "_id",
        as: "partner",
      },
    },
    { $unwind: "$partner" },
    { $match: { "partner.isActive": true } },
    { $sort: { redemptionCount: -1 } },
    { $limit: 5 },
    {
      $project: {
        _id: "$partner._id",
        name: "$partner.name",
        logo: "$partner.logo",
        description: "$partner.description",
        discountPercentage: "$partner.discountPercentage",
        pointsRequired: "$partner.pointsRequired",
        redemptionCount: "$redemptionCount",
        address:"$partner.address"
      },
    },
  ]);

  res
    .status(200)
    .json(new ApiResponse(200, top, "Top partners fetched successfully"));
});

export {
  registerPartner,
  loginPartner,
  getPartnerProfile,
  updatePartnerProfile,
  updatePassword,
  deleteAccount,
  getActivePartners,
  getPartnerRedemptions,
  getTopPartners,
};
