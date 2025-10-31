import Donor from "../model/donor.model.js";
import { asynchandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import jwt from "jsonwebtoken";
import NGO from "../model/ngo.model.js";
import Delivery from "../model/delivery.model.js";

const authDonor = asynchandler(async (req, res, next) => {
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

const authNgo = asynchandler(async (req, res, next) => {
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

        const Ngo=await NGO.findOne({email});

        if(!Ngo){
            return res.status(401).json(new ApiResponse(401,{},"No Ngo found"));
        }

        req.Ngo=Ngo;
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json(new ApiResponse(401,{},"Invalid Token"));
    }
}); 

const authPartner = asynchandler(async (req, res, next) => {
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

        const partner=await Delivery.findOne({email});

        if(!partner){
            return res.status(401).json(new ApiResponse(401,{},"No delivery partner found"));
        }

        req.partner=partner;
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json(new ApiResponse(401,{},"Invalid Token"));
    }
});

export {authDonor,authNgo,authPartner};
