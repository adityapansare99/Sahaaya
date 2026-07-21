import mongoose from "mongoose";

const donationSchema = new mongoose.Schema(
  {
    Donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Donor",
    },

    Ngo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "NGO",
    },

    FoodType: {
      type: String,
      required: true,
      enum: [
        "Cooked Meals",
        "Fresh Vegetables",
        "Fruits",
        "Packaged Food",
        "Dairy Products",
        "Bakery Items",
        "Beverages",
        "Other",
      ],
    },

    FoodDescription: {
        type: String,
        required: true,
    },

    Quantity: {
        type: String,
        default: "",
    },

    weightKg: {
        type: Number,
        default: 0,
        min: 0,
    },

    serves: {
        type: Number,
        default: 0,
        min: 0,
    },

    PickupLocation: {
        type: String,
        required: true,
    },

    pickupLatitude: {
        type: Number,
        default: null,
    },

    pickupLongitude: {
        type: Number,
        default: null,
    },

    ExpiryDate: {
        type: Date,
        required: true,
    },

    ExpiryTime: {
        type: String,
        required: true,
    },

    Status:{
        type: String,
        enum: ["Cancelled", "Accepted", "Completed", "Pending"],
        default: "Pending",
    },

    typeOfDonor: {
        type: String,
        enum: ["Restaurant", "Event", "Store", "Individual"],
        required: true,
    },
  },
  { timestamps: true }
);

const Donation=mongoose.model("Donation", donationSchema);

export default Donation;
