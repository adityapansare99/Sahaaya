import jwt from "jsonwebtoken";
import { ApiResponse } from "../utils/apiResponse.js";

const adminAuth = (req, res, next) => {
  const token =
    req.cookies?.admintoken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res
      .status(401)
      .json(new ApiResponse(401, {}, "Admin access required. Please login."));
  }

  try {
    const decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET);

    if (!decoded || decoded.type !== "admin") {
      return res
        .status(401)
        .json(new ApiResponse(401, {}, "Invalid admin token"));
    }

    req.admin = { email: decoded.email };
    next();
  } catch (error) {
    return res
      .status(401)
      .json(new ApiResponse(401, {}, "Invalid or expired admin token"));
  }
};

export default adminAuth;
