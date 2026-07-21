import mongoose from "mongoose";
import bcrypt from "bcrypt";

const donorSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },

    email:{
        type:String,
        required:true,
        unique:true,
    },

    phone:{
        type:Number,
        required:true,
        unique:true,
    },
    address:{
        type:String,
        required:true,
    },
    pincode:{
        type:Number,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    approved:{
        type:Boolean,
        default:false,
    },
    image:{
        type:String,
        default:"",
    },

    socketId:{
        type:String
    },

    latitude:{
        type: Number,
        default: null,
    },

    longitude:{
        type: Number,
        default: null,
    },
},{timestamps:true});

donorSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 10);

  next();
});

donorSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const Donor=mongoose.model("Donor",donorSchema);

export default Donor;