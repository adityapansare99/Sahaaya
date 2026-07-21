import mongoose from "mongoose";
import bcrypt from "bcrypt";

const partnerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    phone: {
      type: Number,
      required: true,
      unique: true,
    },

    address: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },

    discountPercentage: {
      type: Number,
      required: true,
      default: 10,
    },

    pointsRequired: {
      type: Number,
      required: true,
      default: 50,
    },

    logo: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      default: "",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    approved: {
      type: Boolean,
      default: false,
    },

    latitude: {
      type: Number,
      default: null,
    },

    longitude: {
      type: Number,
      default: null,
    },
  },
  { timestamps: true }
);

partnerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

partnerSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const Partner = mongoose.model("Partner", partnerSchema);

export default Partner;
