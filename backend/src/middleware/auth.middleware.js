import Donor from "../model/donor.model.js";
import { asynchandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import jwt from "jsonwebtoken";

const authDonor = asynchandler(async (req, _, next) => {
  const token =
    req.cookies.refreshtoken ||
    req.header("Authorization")?.replace("Bearer ", "") ||
    req.body.refreshtoken;

    if(!token){
        return res.status(401).json(new ApiResponse(401,{},"Please login to continue"));
    }

    try {
        const decodedToken=jwt.verify(token,process.env.refreshtoken);

        if(!decodedToken){
            return res.status(401).json(new ApiResponse(401,{},"Invalid Token"));
        }

        const email=decodedToken.email;

        const donor=await Donor.findOne({email});

        if(!donor){
            return res.status(401).json(new ApiResponse(401,{},"No donor found"));
        }

        req.donor=donor;
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json(new ApiResponse(401,{},"Invalid Token"));
    }
});

export {authDonor};
