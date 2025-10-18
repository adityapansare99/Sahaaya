import { asynchandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import Ride from "../model/ride.model.js";

const allRides=asynchandler(async(req,res)=>{
    const partner=req.partner;

    if(!partner){
        return res.status(404).json(new ApiResponse(404,{},'No delivery partner found'));
    }

    const rides=await Ride.find({status:"pending"}).populate("donor").populate("receiver").populate("donation");

    if(!rides){
        return res.status(404).json(new ApiResponse(404,{},'No rides found'));
    }

    res.status(200).json(new ApiResponse(200,rides,'Rides fetched successfully'))
})

const acceptRide=asynchandler(async(req,res)=>{
    const partner=req.partner

    if(!partner){
        return res.status(401).json(new ApiResponse(401,{},'Please login to continue'));
    }

    const {rideId}=req.body

    if(!rideId){
        return res.status(401).json(new ApiResponse(401,{},'Ride not found'));
    }

    const ride=await Ride.findById(rideId);

    if(ride.status==="accepted"){
        return res.status(401).json(new ApiResponse(401,{},'Ride already accepted'));
    }

    const response=await Ride.findByIdAndUpdate(rideId,{status:"accepted",rider:partner._id},{new:true})

    if(!response){
        return res.status(401).json(new ApiResponse(401,{},'Ride not found'));
    }

    const rideResponse=await Ride.findById(rideId).populate("donor").populate("receiver").populate("donation");

    res.status(200).json(new ApiResponse(200,rideResponse,'Ride accepted successfully'))
})

const getRides=asynchandler(async(req,res)=>{
    const partner=req.partner

    if(!partner){
        return res.status(401).json(new ApiResponse(401,{},'Please login to continue'));
    }

    const rides=await Ride.find({rider:partner._id,status:{ $ne: "completed" }}).populate("donor").populate("receiver").populate("donation");

    if(!rides){
        return res.status(401).json(new ApiResponse(401,{},'No rides found'));
    }

    res.status(200).json(new ApiResponse(200,rides,'Rides fetched successfully'))
})

const markPicked=asynchandler(async(req,res)=>{
    const partner=req.partner

    if(!partner){
        return res.status(401).json(new ApiResponse(401,{},'Please login to continue'));
    }

    const{rideId}=req.body

    if(!rideId){
        return res.status(401).json(new ApiResponse(401,{},'Ride not found'));
    }

    const ride=await Ride.findById(rideId);

    if(!ride){
        return res.status(401).json(new ApiResponse(401,{},'Ride not found'));
    }

    if(ride.status==="picked up"){
        return res.status(401).json(new ApiResponse(401,{},'Ride already picked up'));
    }

    const response=await Ride.findByIdAndUpdate(rideId,{status:"picked up"},{new:true})

    if(!response){
        return res.status(401).json(new ApiResponse(401,{},'Ride not found'));
    }

    res.status(200).json(new ApiResponse(200,{},'Ride picked up successfully'))
})

const markCompeted=asynchandler(async(req,res)=>{
    const partner=req.partner

    if(!partner){
        return res.status(401).json(new ApiResponse(401,{},'Please login to continue'));
    }

    const {rideId}=req.body

    if(!rideId){
        return res.status(401).json(new ApiResponse(401,{},'Ride not found'));
    }

    const ride=await Ride.findById(rideId);

    if(!ride){
        return res.status(401).json(new ApiResponse(401,{},'Ride not found'));
    }

    if(ride.status==="completed"){
        return res.status(401).json(new ApiResponse(401,{},'Ride already completed'));
    }

    const response=await Ride.findByIdAndUpdate(rideId,{status:"completed"},{new:true});

    if(!response){
        return res.status(401).json(new ApiResponse(401,{},'Ride not found'));
    }

    res.status(200).json(new ApiResponse(200,{},'Ride completed successfully'))
})

const getAllRides=asynchandler(async(req,res)=>{
    const partner=req.partner

    if(!partner){
        return res.status(401).json(new ApiResponse(401,{},'Please login to continue'));
    }

    const response=await Ride.find({rider:partner._id}).populate("donor").populate("receiver").populate("donation");

    if(!response){
        return res.status(401).json(new ApiResponse(401,{},'No rides found'));
    }

    res.status(200).json(new ApiResponse(200,response,'Rides fetched successfully'))
})

export {allRides,acceptRide,getRides,markPicked,markCompeted,getAllRides}