import { asynchandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import Donation from "../model/donation.model.js";
import Ride from "../model/ride.model.js";

//take the donation with pending and not expired
const donations = asynchandler(async (req, res) => {
  const Ngo = req.Ngo;

  if (!Ngo) {
    return res
      .status(401)
      .json(new ApiResponse(401, {}, "Please login to continue"));
  }

  const donations = await Donation.find({
    Status: "Pending"
  })
    .populate("Donor")
    .populate("Ngo");

    //logic for the get distance and the expiry time of the donation (use the filter) 
    // remain to added

  return res
    .status(200)
    .json(new ApiResponse(200, donations, "Donations fetched successfully"));
});

const acceptOrder=asynchandler(async(req,res)=>{
    const Ngo=req.Ngo;

    if(!Ngo){
        return res.status(401).json(new ApiResponse(401,{},'Please login to continue'));
    }

    const {donationId}=req.body;

    if(!donationId){
        return res.status(401).json(new ApiResponse(401,{},"Donation not found"));
    }

    const donation=await Donation.findById(donationId);

    if(!donation){
        return res.status(401).json(new ApiResponse(401,{},"Donation not found"));
    }

    if(donation.Status!=="Pending"){
        return res.status(401).json(new ApiResponse(401,{},"Donation already accepted"));
    }

    const reponse=await Donation.findByIdAndUpdate(donationId,{Status:"Accepted",Ngo:Ngo._id},{new:true});


    if(!reponse){
        return res.status(401).json(new ApiResponse(401,{},"Donation not found"));
    }

    const donationResponse=await Donation.findById(donationId).populate("Donor").populate("Ngo");

    const ride=await Ride.create({
        donor:donationResponse.Donor._id,
        receiver:donationResponse.Ngo._id,
        pickup:donationResponse.PickupLocation,
        destination:donationResponse.Ngo.address,
        donation:donationResponse._id,
    })

    // add the time and distance logic here 

    if(!ride){
        return res.status(401).json(new ApiResponse(401,{},"Ride not created"));
    }

    const rideResponse=await Ride.findById(ride._id).populate("donor").populate("receiver").populate("donation");

    if(!rideResponse){
        return res.status(401).json(new ApiResponse(401,{},"Ride not found"));
    }


    res.status(200).json(new ApiResponse(200,rideResponse,"Donation accepted successfully"));
})

const receivedDonations=asynchandler(async(req,res)=>{
    const Ngo=req.Ngo

    if(!Ngo){
        return res.status(401).json(new ApiResponse(401,{},'Please login to continue'));
    }

    const NgoId=Ngo._id

    const response=await Donation.find({Ngo:NgoId}).populate("Donor");

    if(!response){
        return res.status(401).json(new ApiResponse(401,{},'No donations found'));
    }

    const total=response.length
    const completed=response.filter((item)=>item.Status==="Completed").length
    const pending=response.filter((item)=>item.Status==="Accepted").length

    res.status(200).json(new ApiResponse(200,{response,total,completed,pending},"Donations fetched successfully"))
})

export { donations,acceptOrder,receivedDonations };
