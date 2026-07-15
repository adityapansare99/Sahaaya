import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const deliverySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },

    address:{
        type:String,
        required:true
    },

    phone:{
        type:Number,
        required:true,
        unique:true,
    },

    email:{
        type:String,
        required:true,
        unique:true,
    },

    emergencyNumber:{
        type:Number,
        required:true,
    },

    password:{
        type:String,
        required:true,
    },

    vehicleCapacity:{
        type:Number,
        required:true,
    },

    licenseNumber:{
        type:String,
        required:true,
        unique:true,
    },

    vehicleNumber:{
        type:String,
        required:true,
        unique:true,
    },

    approved:{
        type:Boolean,
        default:false,
    },

    image:{
        type:String,
        default:"",
    },

    typeOfVehicle:{
        type:String,
        required:true,
    },

    rating:{
        type:Number,
        default:0,
    },

    totalDeliveries:{
        type:Number,
        default:0,
    },

    points:{
        type:Number,
        default:0,
    },

    earnings:{
        type:Number,
        default:0,
    },

    redeemedPoints:{
        type:Number,
        default:0,
    },

    socketId:{
        type:String
    }
},{timestamps:true});

deliverySchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 10);

  next();
});

deliverySchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const Delivery=mongoose.model("Delivery",deliverySchema);

export default Delivery;