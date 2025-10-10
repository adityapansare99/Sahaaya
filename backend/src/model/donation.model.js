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

    Quantity:{
        type: String,
        required: true,
    },

    PickupLocation: {
        type: String,
        required: true,
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
