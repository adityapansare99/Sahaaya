import Donor from "../model/donor.model.js";
import { asynchandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { uploadoncloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";

const registerDonor = asynchandler(async (req, res) => {
  const data=JSON.parse(req.body.data);

  const { name, email, phone, address, pincode, password } = data;
  const image = req.file;

  if ([name, email, password].some((item) => item.trim().length === 0)) {
    return res
      .status(400)
      .json(new ApiResponse(400, {}, "All fields are required"));
  }

  if (password.length < 6) {
    return res
      .status(400)
      .json(new ApiResponse(400, {}, "Password must be at least 6 characters"));
  }

  const response = await Donor.findOne({ email });

  if (response) {
    return res
      .status(400)
      .json(new ApiResponse(400, {}, "Email already registered"));
  }

  try {
    const newdonor = Donor.create({
      name: name,
      email: email,
      phone: phone,
      address: address,
      pincode: pincode,
      password: password,
    });

    if (!newdonor) {
      return res
        .status(500)
        .json(new ApiResponse(500, {}, "Error in donor registration"));
    }

    if (image) {
      const imageurl = await uploadoncloudinary(image.path);

      if (!imageurl) {
        return res
          .status(500)
          .json(new ApiResponse(500, {}, "Error in image upload"));
      }

      await Donor.findOneAndUpdate({email}, {
        image: imageurl.url,
      });
    }

    const token = jwt.sign(
      { email: newdonor.email },
      process.env.refreshtoken,
      { expiresIn: process.env.refreshtime }
    );

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    };

    const finaldonor = await Donor.findOne({ email });

    if (!finaldonor) {
      return res
        .status(500)
        .json(new ApiResponse(500, {}, "Error in donor registration"));
    }

    res
      .status(201)
      .cookie("refreshtoken", token, options)
      .json(new ApiResponse(201, {finaldonor,token}, "Donor registered successfully"));
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json(new ApiResponse(500, {}, "Error in donor registration"));
  }
});

const loginDonor=asynchandler(async(req,res)=>{
    const {email,password}=req.body;

    if([email,password].some((item)=>item.trim().length===0)){
        return res.status(400).json(new ApiResponse(400,{},"All fields are required"));
    }

    const donor=await Donor.findOne({email});

    if(!donor){
        return res.status(400).json(new ApiResponse(400,{},"Invalid credentials"));
    }

    const isPasswordCorrect=await donor.isPasswordCorrect(password);

    if(!isPasswordCorrect){
        console.log(isPasswordCorrect);
        return res.status(400).json(new ApiResponse(400,{},"Invalid password"));
    }

    const token=jwt.sign({email:donor.email},process.env.refreshtoken,{expiresIn:process.env.refreshtime});

    if(!token){
        return res.status(500).json(new ApiResponse(500,{},"Unable to login,Try again later"));
    }

    const options={
        httpOnly:true,
        secure:process.env.NODE_ENV==="production",
    }

    res.status(200).cookie("refreshtoken",token,options).json(new ApiResponse(200,{donor,token},"Login successful"));
})

const getDonorProfile=asynchandler(async(req,res)=>{
    const donor=req.donor;

    if(!donor){
        return res.status(404).json(new ApiResponse(404,{},"No donor found"));
    }

    res.status(200).json(new ApiResponse(200,donor,"Donor profile fetched successfully"));
})

const updateDonorProfile=asynchandler(async(req,res)=>{
    const donor=req.donor;

    const email=donor.email;

    if(!donor){
        return res.status(404).json(new ApiResponse(404,{},"No donor found"));
    }

    const {name,phone,address,pincode}=req.body;

    if([name,phone,address,pincode].some((item)=>item.trim().length===0)){
        return res.status(400).json(new ApiResponse(400,{},"All fields are required"));
    }

    const updatedDonor=await Donor.findOneAndUpdate({email},{
        name:name,
        phone:phone,
        address:address,
        pincode:pincode,
    },{new:true});

    if(!updatedDonor){
        return res.status(500).json(new ApiResponse(500,{},"Unable to update profile,Try again later"));
    }

    //not necessary to create new token but doing it anyway
    const token=jwt.sign({email:updatedDonor.email},process.env.refreshtoken,{expiresIn:process.env.refreshtime});

    if(!token){
        return res.status(500).json(new ApiResponse(500,{},"Unable to update profile,Try again later"));
    }

    const options={
        httpOnly:true,
        secure:process.env.NODE_ENV==="production",
    }

    res.status(200).cookie("refreshtoken",token,options).json(new ApiResponse(200,updatedDonor,"Profile updated successfully"));
})

const updatePassword=asynchandler(async(req,res)=>{
    const donor=req.donor;

    if(!donor){
        return res.status(404).json(new ApiResponse(404,{},"No donor found"));
    }

    const {oldpassword,newpassword}=req.body;

    if([oldpassword,newpassword].some((item)=>item.trim().length===0)){
        return res.status(400).json(new ApiResponse(400,{},"All fields are required"));
    }

    if(newpassword.length<6){
        return res.status(400).json(new ApiResponse(400,{},"Password must be at least 6 characters"));
    }

    const isPasswordCorrect=await donor.isPasswordCorrect(oldpassword);

    if(!isPasswordCorrect){
        return res.status(400).json(new ApiResponse(400,{},"Old password is incorrect"));
    }

    donor.password=newpassword;
    const updatedDonor=await donor.save();

    if(!updatedDonor){
        return res.status(500).json(new ApiResponse(500,{},"Unable to update password,Try again later"));
    }

    res.status(200).json(new ApiResponse(200,updatedDonor,"Password updated successfully"));
})

const deleteAccount=asynchandler(async(req,res)=>{
    const donor=req.donor;
    
    if(!donor){
        return res.status(404).json(new ApiResponse(404,{},"No donor found"));
    }

    const email=donor.email;

    const deletedDonor=await Donor.findOneAndDelete({email});

    if(!deletedDonor){
        return res.status(500).json(new ApiResponse(500,{},"Unable to delete account,Try again later"));
    }

    res.status(200).json(new ApiResponse(200,{},'Account deleted successfully'));
})

export{registerDonor,loginDonor,getDonorProfile,updateDonorProfile,updatePassword,deleteAccount};