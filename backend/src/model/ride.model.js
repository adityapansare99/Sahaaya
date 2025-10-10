import mongoose from "mongoose";

const rideSchema = new mongoose.Schema({
    donor:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Donor",
        required: true,
    },

    receiver:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "NGO",
        required: true,
    },

    pickup:{
        type:String,
        required:true
    },

    destination:{
        type:String,
        required:true
    },

    status:{
        type:String,
        enum: ["pending", "accepted", "picked up", "delivered", "completed"],
        default: "pending"
    },

    duration:{
        type:Number
    },

    distance:{
        type:Number
    },

    donation:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Donation",
        required: true,
    },

    rider:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Delivery"
    }
})

const Ride=mongoose.model("Ride",rideSchema);

export default Ride;