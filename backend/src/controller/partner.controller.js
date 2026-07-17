import Partner from "../model/partner.model.js";
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
      (item) => !item || String(item).trim().length === 0
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
      { expiresIn: process.env.refreshtime }
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
          "Partner registered successfully"
        )
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

  if ([email, password].some((item) => !item || String(item).trim().length === 0)) {
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
    { expiresIn: process.env.refreshtime }
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
    return res
      .status(404)
      .json(new ApiResponse(404, {}, "No partner found"));
  }

  res
    .status(200)
    .json(new ApiResponse(200, partner, "Profile fetched successfully"));
});

const updatePartnerProfile = asynchandler(async (req, res) => {
  const partner = req.partner;

  if (!partner) {
    return res
      .status(404)
      .json(new ApiResponse(404, {}, "No partner found"));
  }

  const {
    name,
    phone,
    address,
    discountPercentage,
    pointsRequired,
    description,
  } = req.body;

  const updated = await Partner.findByIdAndUpdate(
    partner._id,
    {
      ...(name && { name }),
      ...(phone && { phone }),
      ...(address && { address }),
      ...(discountPercentage && { discountPercentage }),
      ...(pointsRequired && { pointsRequired }),
      ...(description !== undefined && { description }),
    },
    { new: true }
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

export {
  registerPartner,
  loginPartner,
  getPartnerProfile,
  updatePartnerProfile,
};
