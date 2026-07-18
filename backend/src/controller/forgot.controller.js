import crypto from "crypto";
import { asynchandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import Otp from "../model/otp.model.js";
import Donor from "../model/donor.model.js";
import NGO from "../model/ngo.model.js";
import Delivery from "../model/delivery.model.js";
import Partner from "../model/partner.model.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

const getModel = (userType) => {
  switch (userType) {
    case "donor": return Donor;
    case "ngo": return NGO;
    case "delivery": return Delivery;
    case "partner": return Partner;
    default: return null;
  }
};

const getTransporter = () => {
  if (!process.env.email_user || !process.env.email_pass) return null;
  return nodemailer.createTransport({
    host: process.env.email_host || "smtp.gmail.com",
    port: Number(process.env.email_port) || 587,
    secure: Number(process.env.email_port) === 465,
    auth: { user: process.env.email_user, pass: process.env.email_pass },
  });
};

const sendOtp = asynchandler(async (req, res) => {
  const { email, userType } = req.body;

  if (!email || !userType) {
    return res.status(400).json(new ApiResponse(400, {}, "Email and user type are required"));
  }

  const Model = getModel(userType);
  if (!Model) {
    return res.status(400).json(new ApiResponse(400, {}, "Invalid user type"));
  }

  const user = await Model.findOne({ email });
  if (!user) {
    return res.status(404).json(new ApiResponse(404, {}, "No account found with this email"));
  }

  // Generate 6-digit OTP
  const otp = crypto.randomInt(100000, 999999).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  await Otp.create({ email, userType, otp, expiresAt });

  // Send email via nodemailer
  const transport = getTransporter();
  if (transport) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
        <div style="background: #ef4444; color: #fff; padding: 20px; text-align: center;">
          <h2 style="margin: 0;">Password Reset OTP</h2>
        </div>
        <div style="padding: 24px; text-align: center;">
          <p style="color: #6b7280; font-size: 14px;">Your OTP for password reset is:</p>
          <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #ef4444; margin: 16px 0;">${otp}</div>
          <p style="color: #6b7280; font-size: 12px;">This OTP is valid for 10 minutes.</p>
        </div>
      </div>
    `;
    try {
      await transport.sendMail({
        from: process.env.email_from || process.env.email_user,
        to: email,
        subject: "Sahaaya — Password Reset OTP",
        html,
      });
    } catch (err) {
      console.log("[email] Failed to send OTP:", err);
    }
  }

  res.status(200).json(new ApiResponse(200, {}, "OTP sent to your email"));
});

const verifyOtp = asynchandler(async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json(new ApiResponse(400, {}, "Email and OTP are required"));
  }

  const record = await Otp.findOne({
    email,
    otp,
    used: false,
    expiresAt: { $gt: new Date() },
  }).sort({ createdAt: -1 });

  if (!record) {
    return res.status(400).json(new ApiResponse(400, {}, "Invalid or expired OTP"));
  }

  // Mark OTP as used
  await Otp.findByIdAndUpdate(record._id, { used: true });

  // Generate a temporary reset token (valid 10 minutes)
  const resetToken = jwt.sign(
    { email, userType: record.userType, purpose: "reset" },
    process.env.refreshtoken,
    { expiresIn: "10m" }
  );

  res.status(200).json(new ApiResponse(200, { resetToken }, "OTP verified successfully"));
});

const resetPassword = asynchandler(async (req, res) => {
  const { resetToken, newPassword } = req.body;

  if (!resetToken || !newPassword) {
    return res.status(400).json(new ApiResponse(400, {}, "Reset token and new password are required"));
  }

  if (newPassword.length < 6) {
    return res.status(400).json(new ApiResponse(400, {}, "Password must be at least 6 characters"));
  }

  let decoded;
  try {
    decoded = jwt.verify(resetToken, process.env.refreshtoken);
  } catch (err) {
    return res.status(400).json(new ApiResponse(400, {}, "Invalid or expired reset token"));
  }

  if (decoded.purpose !== "reset") {
    return res.status(400).json(new ApiResponse(400, {}, "Invalid reset token"));
  }

  const Model = getModel(decoded.userType);
  if (!Model) {
    return res.status(400).json(new ApiResponse(400, {}, "Invalid user type"));
  }

  const user = await Model.findOne({ email: decoded.email });
  if (!user) {
    return res.status(404).json(new ApiResponse(404, {}, "User not found"));
  }

  user.password = newPassword;
  await user.save();

  res.status(200).json(new ApiResponse(200, {}, "Password reset successfully"));
});

export { sendOtp, verifyOtp, resetPassword };
