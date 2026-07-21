import NGO from "../model/ngo.model.js";
import Donation from "../model/donation.model.js";
import { asynchandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { uploadoncloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";

const registerNgo = asynchandler(async (req, res) => {
  const data=JSON.parse(req.body.data);

  const {
    name,
    email,
    phone,
    address,
    contactPerson,
    DailyCapacity,
    password,
    RegistrationNumber,
    typeofNgo,
    latitude,
    longitude,
  } = data;

  const image = req.file;

  if (
    [
      name,
      email,
      phone,
      address,
      contactPerson,
      DailyCapacity,
      password,
      RegistrationNumber,
      typeofNgo,
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

  const response = await NGO.findOne({ email });

  if (response) {
    return res
      .status(400)
      .json(new ApiResponse(400, {}, "Email already registered"));
  }

  try {
    const newNgo =await NGO.create({
      name: name,
      email: email,
      phone: phone,
      address: address,
      password: password,
      contactPerson: contactPerson,
      DailyCapacity: DailyCapacity,
      RegistrationNumber: RegistrationNumber,
      typeofNgo: typeofNgo,
      latitude: latitude != null ? Number(latitude) : null,
      longitude: longitude != null ? Number(longitude) : null,
    });

    if (!newNgo) {
      return res
        .status(500)
        .json(new ApiResponse(500, {}, "Error in Ngo registration"));
    }

    if (image) {
      const imageurl = await uploadoncloudinary(image.path);

      if (!imageurl) {
        return res
          .status(500)
          .json(new ApiResponse(500, {}, "Error in image upload"));
      }

      await NGO.findOneAndUpdate(
        { email },
        {
          image: imageurl.url,
        }
      );
    }

    const token = jwt.sign({ email: newNgo.email }, process.env.refreshtoken, {
      expiresIn: process.env.refreshtime,
    });

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    };

    const finalNgo = await NGO.findOne({ email });

    if (!finalNgo) {
      return res
        .status(500)
        .json(new ApiResponse(500, {}, "Error in Ngo registration"));
    }

    res
      .status(201)
      .cookie("refreshtoken", token, options)
      .json(new ApiResponse(201, {finalNgo,token}, "Ngo registered successfully"));
  } catch (error) {
    console.log(error);
    res.status(500).json(new ApiResponse(500, {}, "Error in Ngo registration"));
  }
});

const loginNgo = asynchandler(async (req, res) => {
  const { email, password } = req.body;

  if ([email, password].some((item) => item.trim().length === 0)) {
    return res
      .status(400)
      .json(new ApiResponse(400, {}, "All fields are required"));
  }

  const Ngo = await NGO.findOne({ email });

  if (!Ngo) {
    return res
      .status(400)
      .json(new ApiResponse(400, {}, "Invalid credentials"));
  }

  const isPasswordCorrect = await Ngo.isPasswordCorrect(password);

  if (!isPasswordCorrect) {
    console.log(isPasswordCorrect);
    return res.status(400).json(new ApiResponse(400, {}, "Invalid password"));
  }

  const token = jwt.sign({ email: Ngo.email }, process.env.refreshtoken, {
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
    .json(new ApiResponse(200, {Ngo,token}, "Login successful"));
});

const getNgoProfile = asynchandler(async (req, res) => {
  const Ngo = req.Ngo;

  if (!Ngo) {
    return res.status(404).json(new ApiResponse(404, {}, "No Ngo found"));
  }

  res
    .status(200)
    .json(new ApiResponse(200, Ngo, "Ngo profile fetched successfully"));
});

const updateNgoProfile = asynchandler(async (req, res) => {
  const Ngo = req.Ngo;

  const email = Ngo.email;

  if (!Ngo) {
    return res.status(404).json(new ApiResponse(404, {}, "No Ngo found"));
  }

  const {
    name,
    phone,
    address,
    typeofNgo,
    RegistrationNumber,
    contactPerson,
    DailyCapacity,
    Description,
    latitude,
    longitude,
  } = req.body;

  if (
    [
      name,
      phone,
      address,
      typeofNgo,
      RegistrationNumber,
      contactPerson,
      DailyCapacity,
      Description,
    ].some((item) => String(item).trim().length === 0)
  ) {
    return res
      .status(400)
      .json(new ApiResponse(400, {}, "All fields are required"));
  }

  const updatedNgo = await NGO.findOneAndUpdate(
    { email },
    {
      name,
      phone,
      address,
      typeofNgo,
      RegistrationNumber,
      contactPerson,
      DailyCapacity,
      Description,
      ...(latitude != null && { latitude: Number(latitude) }),
      ...(longitude != null && { longitude: Number(longitude) }),
    },
    { new: true }
  );

  if (!updatedNgo) {
    return res
      .status(500)
      .json(
        new ApiResponse(500, {}, "Unable to update profile,Try again later")
      );
  }

  //not necessary to create new token but doing it anyway
  const token = jwt.sign(
    { email: updatedNgo.email },
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
    .json(new ApiResponse(200, updatedNgo, "Profile updated successfully"));
});

const updatePassword = asynchandler(async (req, res) => {
  const Ngo = req.Ngo;

  if (!Ngo) {
    return res.status(404).json(new ApiResponse(404, {}, "No Ngo found"));
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

  const isPasswordCorrect = await Ngo.isPasswordCorrect(oldpassword);

  if (!isPasswordCorrect) {
    return res
      .status(400)
      .json(new ApiResponse(400, {}, "Old password is incorrect"));
  }

  Ngo.password = newpassword;
  const updatedNgo = await Ngo.save();

  if (!updatedNgo) {
    return res
      .status(500)
      .json(
        new ApiResponse(500, {}, "Unable to update password,Try again later")
      );
  }

  res
    .status(200)
    .json(new ApiResponse(200, updatedNgo, "Password updated successfully"));
});

const deleteAccount = asynchandler(async (req, res) => {
  const Ngo = req.Ngo;

  if (!Ngo) {
    return res.status(404).json(new ApiResponse(404, {}, "No Ngo found"));
  }

  const email = Ngo.email;

  const deletedNgo = await NGO.findOneAndDelete({ email });

  if (!deletedNgo) {
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

const getAnalytics = asynchandler(async (req, res) => {
  const Ngo = req.Ngo;

  if (!Ngo) {
    return res.status(404).json(new ApiResponse(404, {}, "No Ngo found"));
  }

  const allDonations = await Donation.find({ Ngo: Ngo._id })
    .populate("Donor", "name email phone")
    .sort({ createdAt: -1 });

  const total = allDonations.length;
  const completed = allDonations.filter((d) => d.Status === "Completed").length;
  const accepted = allDonations.filter((d) => d.Status === "Accepted").length;
  const cancelled = allDonations.filter((d) => d.Status === "Cancelled").length;
  const pending = allDonations.filter((d) => d.Status === "Pending").length;

  // Top donors aggregation
  const donorMap = {};
  allDonations.forEach((d) => {
    if (d.Donor && d.Donor._id) {
      const id = d.Donor._id.toString();
      if (!donorMap[id]) {
        donorMap[id] = { name: d.Donor.name, donations: 0 };
      }
      donorMap[id].donations++;
    }
  });
  const topDonors = Object.values(donorMap)
    .sort((a, b) => b.donations - a.donations)
    .slice(0, 5);

  // Monthly trend (last 6 months)
  const monthlyTrend = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const month = d.toLocaleString("en-US", { month: "short" });
    const count = allDonations.filter((don) => {
      const donDate = new Date(don.createdAt);
      return (
        donDate.getMonth() === d.getMonth() &&
        donDate.getFullYear() === d.getFullYear()
      );
    }).length;
    monthlyTrend.push({ month, donations: count });
  }

  // Impact + efficiency metrics over completed donations.
  const num = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  };
  const completedDonations = allDonations.filter((d) => d.Status === "Completed");
  const peopleServed = completedDonations.reduce((s, d) => s + num(d.serves), 0);
  const wasteReduced = completedDonations.reduce((s, d) => s + num(d.weightKg), 0);
  const avgServes = completedDonations.length
    ? Math.round(peopleServed / completedDonations.length)
    : 0;
  const avgWeight = completedDonations.length
    ? Math.round((wasteReduced / completedDonations.length) * 10) / 10
    : 0;

  // Month-over-month % change (this month vs last). null when last month had 0,
  // since a % off zero isn't meaningful.
  const lastMonth = monthlyTrend[monthlyTrend.length - 1]?.donations ?? 0;
  const prevMonth = monthlyTrend[monthlyTrend.length - 2]?.donations ?? 0;
  const momChange = prevMonth > 0
    ? Math.round(((lastMonth - prevMonth) / prevMonth) * 100)
    : null;

  res.status(200).json(
    new ApiResponse(
      200,
      {
        total,
        completed,
        accepted,
        cancelled,
        pending,
        topDonors,
        monthlyTrend,
        peopleServed,
        wasteReduced,
        avgServes,
        avgWeight,
        momChange,
      },
      "Analytics fetched successfully"
    )
  );
});

export {
  registerNgo,
  loginNgo,
  getNgoProfile,
  updateNgoProfile,
  updatePassword,
  deleteAccount,
  getAnalytics,
};
