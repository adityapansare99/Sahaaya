import Donor from "../model/donor.model.js";
import { asynchandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import jwt from "jsonwebtoken";
import NGO from "../model/ngo.model.js";
import Delivery from "../model/delivery.model.js";
import Partner from "../model/partner.model.js";

const verifySessionToken = (token) => {
  const decoded = jwt.verify(token, process.env.refreshtoken);
  if (decoded?.purpose === "reset") {
    const err = new Error("reset token cannot be used as a session token");
    err.isResetToken = true;
    throw err;
  }
  return decoded;
};

const authDonor = asynchandler(async (req, res, next) => {
  const token =
    req.cookies.refreshtoken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res
      .status(401)
      .json(new ApiResponse(401, {}, "Please login to continue"));
  }

  try {
    const decodedToken = verifySessionToken(token);

    if (!decodedToken) {
      return res.status(401).json(new ApiResponse(401, {}, "Invalid Token"));
    }

    const email = decodedToken.email;

    const donor = await Donor.findOne({ email });

    if (!donor) {
      return res.status(401).json(new ApiResponse(401, {}, "No donor found"));
    }

    req.donor = donor;
    next();
  } catch (error) {
    console.log("Auth error:", error.message);
    return res.status(401).json(new ApiResponse(401, {}, "Invalid Token"));
  }
});

const authNgo = asynchandler(async (req, res, next) => {
  const token =
    req.cookies.refreshtoken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res
      .status(401)
      .json(new ApiResponse(401, {}, "Please login to continue"));
  }

  try {
    const decodedToken = verifySessionToken(token);

    if (!decodedToken) {
      return res.status(401).json(new ApiResponse(401, {}, "Invalid Token"));
    }

    const email = decodedToken.email;

    const Ngo = await NGO.findOne({ email });

    if (!Ngo) {
      return res.status(401).json(new ApiResponse(401, {}, "No Ngo found"));
    }

    req.Ngo = Ngo;
    next();
  } catch (error) {
    console.log("Auth error:", error.message);
    return res.status(401).json(new ApiResponse(401, {}, "Invalid Token"));
  }
});

const authPartner = asynchandler(async (req, res, next) => {
  const token =
    req.cookies.refreshtoken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res
      .status(401)
      .json(new ApiResponse(401, {}, "Please login to continue"));
  }

  try {
    const decodedToken = verifySessionToken(token);

    if (!decodedToken) {
      return res.status(401).json(new ApiResponse(401, {}, "Invalid Token"));
    }

    const email = decodedToken.email;

    const partner = await Delivery.findOne({ email });

    if (!partner) {
      return res
        .status(401)
        .json(new ApiResponse(401, {}, "No delivery partner found"));
    }

    req.partner = partner;
    next();
  } catch (error) {
    console.log("Auth error:", error.message);
    return res.status(401).json(new ApiResponse(401, {}, "Invalid Token"));
  }
});

const authRestaurant = asynchandler(async (req, res, next) => {
  const token =
    req.cookies.refreshtoken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res
      .status(401)
      .json(new ApiResponse(401, {}, "Please login to continue"));
  }

  try {
    const decodedToken = verifySessionToken(token);

    if (!decodedToken) {
      return res.status(401).json(new ApiResponse(401, {}, "Invalid Token"));
    }

    const email = decodedToken.email;

    const partner = await Partner.findOne({ email });

    if (!partner) {
      return res
        .status(401)
        .json(new ApiResponse(401, {}, "No restaurant partner found"));
    }

    req.partner = partner;
    next();
  } catch (error) {
    console.log("Auth error:", error.message);
    return res.status(401).json(new ApiResponse(401, {}, "Invalid Token"));
  }
});

const authAnyParty = asynchandler(async (req, res, next) => {
  const token =
    req.cookies.refreshtoken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res
      .status(401)
      .json(new ApiResponse(401, {}, "Please login to continue"));
  }

  try {
    const decodedToken = verifySessionToken(token);

    if (!decodedToken) {
      return res.status(401).json(new ApiResponse(401, {}, "Invalid Token"));
    }

    const email = decodedToken.email;

    const [donor, ngo, delivery, partner] = await Promise.all([
      Donor.findOne({ email }),
      NGO.findOne({ email }),
      Delivery.findOne({ email }),
      Partner.findOne({ email }),
    ]);

    if (donor) {
      req.user = { _id: donor._id, role: "donor", doc: donor };
    } else if (ngo) {
      req.user = { _id: ngo._id, role: "ngo", doc: ngo };
    } else if (delivery) {
      req.user = { _id: delivery._id, role: "delivery", doc: delivery };
    } else if (partner) {
      req.user = { _id: partner._id, role: "partner", doc: partner };
    } else {
      return res.status(401).json(new ApiResponse(401, {}, "No account found"));
    }

    next();
  } catch (error) {
    return res
      .status(401)
      .json(new ApiResponse(401, { error }, "Invalid Token"));
  }
});

export { authDonor, authNgo, authPartner, authRestaurant, authAnyParty };
