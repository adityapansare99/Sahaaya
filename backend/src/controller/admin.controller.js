import jwt from "jsonwebtoken";
import { asynchandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import Donor from "../model/donor.model.js";
import NGO from "../model/ngo.model.js";
import Delivery from "../model/delivery.model.js";
import Partner from "../model/partner.model.js";
import Donation from "../model/donation.model.js";
import Ride from "../model/ride.model.js";

const login = asynchandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password || String(email).trim().length === 0 || String(password).trim().length === 0) {
    return res.status(400).json(new ApiResponse(400, {}, "Email and password are required"));
  }

  if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json(new ApiResponse(401, {}, "Invalid admin credentials"));
  }

  const token = jwt.sign({ email, type: "admin" }, process.env.ADMIN_JWT_SECRET, {
    expiresIn: process.env.refreshtime || "1d",
  });

  const options = { httpOnly: true, secure: process.env.NODE_ENV === "production" };

  res.status(200).cookie("admintoken", token, options).json(new ApiResponse(200, { token }, "Admin login successful"));
});

const getDashboard = asynchandler(async (req, res) => {
  const [ngos, donors, delivery, partners, donations, allDonations, rides] = await Promise.all([
    NGO.aggregate([{ $group: { _id: "$approved", count: { $sum: 1 } } }]),
    Donor.aggregate([{ $group: { _id: "$approved", count: { $sum: 1 } } }]),
    Delivery.aggregate([{ $group: { _id: "$approved", count: { $sum: 1 } } }]),
    Partner.aggregate([{ $group: { _id: "$approved", count: { $sum: 1 } } }]),
    Donation.aggregate([{ $group: { _id: "$Status", count: { $sum: 1 } } }]),
    Donation.find().select("FoodType Status createdAt").sort({ createdAt: -1 }).limit(5).populate("Donor", "name").populate("Ngo", "name"),
    Ride.countDocuments(),
  ]);

  const toMap = (arr, keyField) => {
    const map = {};
    arr.forEach((item) => { map[item._id === true ? "approved" : item._id === false ? "pending" : item._id] = item.count; });
    return map;
  };

  res.status(200).json(
    new ApiResponse(200, {
      ngos: { total: ngos.reduce((s, g) => s + g.count, 0), ...toMap(ngos) },
      donors: { total: donors.reduce((s, g) => s + g.count, 0), ...toMap(donors) },
      delivery: { total: delivery.reduce((s, g) => s + g.count, 0), ...toMap(delivery) },
      partners: { total: partners.reduce((s, g) => s + g.count, 0), ...toMap(partners) },
      donations: { total: donations.reduce((s, g) => s + g.count, 0), ...toMap(donations) },
      rides: { total: rides },
      recentDonations: allDonations,
    })
  );
});

const searchQuery = (search) =>
  search
    ? { $or: [{ name: { $regex: search, $options: "i" } }, { email: { $regex: search, $options: "i" } }] }
    : {};

const listEntities = (Model, search) => Model.find(searchQuery(search)).select("-password").sort({ createdAt: -1 });

const toggleApproval = async (Model, id, field, name) => {
  const doc = await Model.findById(id);
  if (!doc) return null;
  doc[field] = !doc[field];
  await doc.save();
  return doc;
};

const getNGOs = asynchandler(async (req, res) => {
  const ngos = await listEntities(NGO, req.query.search);
  res.status(200).json(new ApiResponse(200, ngos, "NGOs fetched successfully"));
});

const toggleNGOApproval = asynchandler(async (req, res) => {
  const ngo = await toggleApproval(NGO, req.params.id, "approved");
  if (!ngo) return res.status(404).json(new ApiResponse(404, {}, "NGO not found"));
  res.status(200).json(new ApiResponse(200, ngo, `NGO ${ngo.approved ? "approved" : "disapproved"} successfully`));
});

const deleteNGO = asynchandler(async (req, res) => {
  const ngo = await NGO.findByIdAndDelete(req.params.id);
  if (!ngo) return res.status(404).json(new ApiResponse(404, {}, "NGO not found"));
  res.status(200).json(new ApiResponse(200, {}, "NGO deleted successfully"));
});

const getDonors = asynchandler(async (req, res) => {
  const donors = await listEntities(Donor, req.query.search);
  res.status(200).json(new ApiResponse(200, donors, "Donors fetched successfully"));
});

const toggleDonorApproval = asynchandler(async (req, res) => {
  const donor = await toggleApproval(Donor, req.params.id, "approved");
  if (!donor) return res.status(404).json(new ApiResponse(404, {}, "Donor not found"));
  res.status(200).json(new ApiResponse(200, donor, `Donor ${donor.approved ? "approved" : "disapproved"} successfully`));
});

const deleteDonor = asynchandler(async (req, res) => {
  const donor = await Donor.findByIdAndDelete(req.params.id);
  if (!donor) return res.status(404).json(new ApiResponse(404, {}, "Donor not found"));
  res.status(200).json(new ApiResponse(200, {}, "Donor deleted successfully"));
});

const getDelivery = asynchandler(async (req, res) => {
  const partners = await listEntities(Delivery, req.query.search);
  res.status(200).json(new ApiResponse(200, partners, "Delivery partners fetched successfully"));
});

const toggleDeliveryApproval = asynchandler(async (req, res) => {
  const partner = await toggleApproval(Delivery, req.params.id, "approved");
  if (!partner) return res.status(404).json(new ApiResponse(404, {}, "Delivery partner not found"));
  res.status(200).json(new ApiResponse(200, partner, `Delivery partner ${partner.approved ? "approved" : "disapproved"} successfully`));
});

const deleteDelivery = asynchandler(async (req, res) => {
  const partner = await Delivery.findByIdAndDelete(req.params.id);
  if (!partner) return res.status(404).json(new ApiResponse(404, {}, "Delivery partner not found"));
  res.status(200).json(new ApiResponse(200, {}, "Delivery partner deleted successfully"));
});

const getPartners = asynchandler(async (req, res) => {
  const partners = await listEntities(Partner, req.query.search);
  res.status(200).json(new ApiResponse(200, partners, "Restaurant partners fetched successfully"));
});

const togglePartnerApproval = asynchandler(async (req, res) => {
  const partner = await toggleApproval(Partner, req.params.id, "approved");
  if (!partner) return res.status(404).json(new ApiResponse(404, {}, "Restaurant partner not found"));
  res.status(200).json(new ApiResponse(200, partner, `Restaurant partner ${partner.approved ? "approved" : "disapproved"} successfully`));
});

const deletePartner = asynchandler(async (req, res) => {
  const partner = await Partner.findByIdAndDelete(req.params.id);
  if (!partner) return res.status(404).json(new ApiResponse(404, {}, "Restaurant partner not found"));
  res.status(200).json(new ApiResponse(200, {}, "Restaurant partner deleted successfully"));
});

const getDonations = asynchandler(async (req, res) => {
  const query = req.query.status && req.query.status !== "all" ? { Status: req.query.status } : {};
  const donations = await Donation.find(query)
    .populate("Donor", "name email phone")
    .populate("Ngo", "name")
    .sort({ createdAt: -1 });
  res.status(200).json(new ApiResponse(200, donations, "Donations fetched successfully"));
});

const getRides = asynchandler(async (req, res) => {
  const rides = await Ride.find()
    .populate("donor", "name email")
    .populate("receiver", "name")
    .populate("donation", "FoodType")
    .populate("rider", "name")
    .sort({ createdAt: -1 });
  res.status(200).json(new ApiResponse(200, rides, "Rides fetched successfully"));
});

export {
  login, getDashboard,
  getNGOs, toggleNGOApproval, deleteNGO,
  getDonors, toggleDonorApproval, deleteDonor,
  getDelivery, toggleDeliveryApproval, deleteDelivery,
  getPartners, togglePartnerApproval, deletePartner,
  getDonations, getRides,
};
