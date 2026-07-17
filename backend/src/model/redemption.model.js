import mongoose from "mongoose";

const redemptionSchema = new mongoose.Schema(
  {
    rider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Delivery",
      required: true,
    },

    partner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Partner",
      required: true,
    },

    pointsUsed: {
      type: Number,
      required: true,
    },

    discountPercentage: {
      type: Number,
      required: true,
    },

    bookingCode: {
      type: String,
      required: true,
      unique: true,
    },

    status: {
      type: String,
      enum: ["active", "used", "expired"],
      default: "active",
    },
  },
  { timestamps: true }
);

const Redemption = mongoose.model("Redemption", redemptionSchema);

export default Redemption;
