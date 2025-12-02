import Delivery from "../model/delivery.model.js";
import { asynchandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { uploadoncloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";

const registerPartner = asynchandler(async (req, res) => {
  const data=JSON.parse(req.body.data);

  const {
    name,
    address,
    phone,
    email,
    emergencyNumber,
    password,
    vehicleCapacity,
    licenseNumber,
    vehicleNumber,
    typeOfVehicle,
  } = data;

  const image = req.file;

  if (
    [
      name,
      address,
      phone,
      email,
      emergencyNumber,
      password,
      vehicleCapacity,
      licenseNumber,
      vehicleNumber,
      typeOfVehicle,
    ].some((item) => item.trim().length === 0)
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

  const response = await Delivery.findOne({ email });

  if (response) {
    return res
      .status(400)
      .json(new ApiResponse(400, {}, "Email already registered"));
  }

  try {
    const newpartner =await Delivery.create({
      name: name,
      email: email,
      phone: phone,
      address: address,
      password: password,
      emergencyNumber: emergencyNumber,
      vehicleCapacity: vehicleCapacity,
      licenseNumber: licenseNumber,
      vehicleNumber: vehicleNumber,
      typeOfVehicle: typeOfVehicle,
    });

    if (!newpartner) {
      return res
        .status(500)
        .json(
          new ApiResponse(500, {}, "Error in delivery partner registration")
        );
    }

    if (image) {
      const imageurl = await uploadoncloudinary(image.path);

      if (!imageurl) {
        return res
          .status(500)
          .json(new ApiResponse(500, {}, "Error in image upload"));
      }

      await Delivery.findOneAndUpdate(
        { email },
        {
          image: imageurl.url,
        }
      );
    }

    const token = jwt.sign(
      { email: newpartner.email },
      process.env.refreshtoken,
      { expiresIn: process.env.refreshtime }
    );

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    };

    const finalpartner = await Delivery.findOne({ email });

    if (!finalpartner) {
      return res
        .status(500)
        .json(
          new ApiResponse(500, {}, "Error in delivery partner registration")
        );
    }

    res
      .status(201)
      .cookie("refreshtoken", token, options)
      .json(
        new ApiResponse(
          201,
          {finalpartner,token},
          "Delivery partner registered successfully"
        )
      );
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json(new ApiResponse(500, {}, "Error in delivery partner registration"));
  }
});

const loginPartner = asynchandler(async (req, res) => {
  const { email, password } = req.body;

  if ([email, password].some((item) => item.trim().length === 0)) {
    return res
      .status(400)
      .json(new ApiResponse(400, {}, "All fields are required"));
  }

  const partner = await Delivery.findOne({ email });

  if (!partner) {
    return res
      .status(400)
      .json(new ApiResponse(400, {}, "Invalid credentials"));
  }

  const isPasswordCorrect = await partner.isPasswordCorrect(password);

  if (!isPasswordCorrect) {
    return res.status(400).json(new ApiResponse(400, {}, "Invalid password"));
  }

  const token = jwt.sign({ email: partner.email }, process.env.refreshtoken, {
    expiresIn: process.env.refreshtime,
  });

  if (!token) {
    return res
      .status(500)
      .json(new ApiResponse(500, {}, "Unable to login,Try again later"));
  }

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  res
    .status(200)
    .cookie("refreshtoken", token, options)
    .json(new ApiResponse(200, {partner,token}, "Login successful"));
});

const getPartnerProfile = asynchandler(async (req, res) => {
  const partner = req.partner;

  if (!partner) {
    return res
      .status(404)
      .json(new ApiResponse(404, {}, "No delivery partner found"));
  }

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        partner,
        "Delivery partner profile fetched successfully"
      )
    );
});

const updatePartnerProfile = asynchandler(async (req, res) => {
  const partner = req.partner;

  const email = partner.email;

  if (!partner) {
    return res.status(404).json(new ApiResponse(404, {}, "No delivery partner found"));
  }

  const {
    name,
    address,
    phone,
    emergencyNumber,
    vehicleCapacity,
    licenseNumber,
    vehicleNumber,
    typeOfVehicle,
  } = req.body;

  if (
    [
      name,
      address,
      phone,
      emergencyNumber,
      vehicleCapacity,
      licenseNumber,
      vehicleNumber,
      typeOfVehicle,
    ].some((item) => String(item).trim().length === 0)
  ) {
    return res
      .status(400)
      .json(new ApiResponse(400, {}, "All fields are required"));
  }

  const updatedPartner = await Delivery.findOneAndUpdate(
    { email },
    {
      name: name,
      phone: phone,
      address: address,
      emergencyNumber: emergencyNumber,
      vehicleCapacity: vehicleCapacity,
      licenseNumber: licenseNumber,
      vehicleNumber: vehicleNumber,
      typeOfVehicle: typeOfVehicle,
    },
    { new: true }
  );

  if (!updatedPartner) {
    return res
      .status(500)
      .json(
        new ApiResponse(500, {}, "Unable to update profile,Try again later")
      );
  }

  //not necessary to create new token but doing it anyway
  const token = jwt.sign(
    { email: updatedPartner.email },
    process.env.refreshtoken,
    { expiresIn: process.env.refreshtime }
  );

  if (!token) {
    return res
      .status(500)
      .json(
        new ApiResponse(500, {}, "Unable to update profile,Try again later")
      );
  }

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  res
    .status(200)
    .cookie("refreshtoken", token, options)
    .json(new ApiResponse(200, updatedPartner, "Profile updated successfully"));
});

const updatePassword = asynchandler(async (req, res) => {
  const partner = req.partner;

  if (!partner) {
    return res
      .status(404)
      .json(new ApiResponse(404, {}, "No delivery partner found"));
  }

  const { oldpassword, newpassword } = req.body;

  if ([oldpassword, newpassword].some((item) => item.trim().length === 0)) {
    return res
      .status(400)
      .json(new ApiResponse(400, {}, "All fields are required"));
  }

  if (newpassword.length < 6) {
    return res
      .status(400)
      .json(new ApiResponse(400, {}, "Password must be at least 6 characters"));
  }

  const isPasswordCorrect = await partner.isPasswordCorrect(oldpassword);

  if (!isPasswordCorrect) {
    return res
      .status(400)
      .json(new ApiResponse(400, {}, "Old password is incorrect"));
  }

  partner.password = newpassword;
  const updatedPartner = await partner.save();

  if (!updatedPartner) {
    return res
      .status(500)
      .json(
        new ApiResponse(500, {}, "Unable to update password,Try again later")
      );
  }

  res
    .status(200)
    .json(new ApiResponse(200, updatedPartner, "Password updated successfully"));
});

const deleteAccount = asynchandler(async (req, res) => {
  const partner = req.partner;

  if (!partner) {
    return res.status(404).json(new ApiResponse(404, {}, "No delivery partner found"));
  }

  const email = partner.email;

  const deletedPartner = await Delivery.findOneAndDelete({ email });

  if (!deletedPartner) {
    return res
      .status(500)
      .json(
        new ApiResponse(500, {}, "Unable to delete account,Try again later")
      );
  }

  res
    .status(200)
    .json(new ApiResponse(200, {}, "Account deleted successfully"));
});

export {
  registerPartner,
  loginPartner,
  getPartnerProfile,
  updatePartnerProfile,
  updatePassword,
  deleteAccount,
};
