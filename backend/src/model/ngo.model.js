import mongoose from "mongoose";
import bcrypt from "bcrypt";

const ngoSchema = new mongoose.Schema(
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

    contactPerson: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },

    DailyCapacity: {
      type: Number,
      required: true,
    },

    RegistrationNumber: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    approved: {
      type: Boolean,
      default: false,
    },

    image: {
      type: String,
      default: "",
    },

    typeofNgo: {
      type: String,
      required: true,
    },

    Description: {
      type: String,
      default:
        "We work towards eliminating hunger in urban areas by collecting surplus food from donors and distributing it to those in need through our network of volunteers and community centers.",
    },

    socketId:{
        type:String
    }
  },
  { timestamps: true }
);

ngoSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 10);

  next();
});

ngoSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const NGO = mongoose.model("NGO", ngoSchema);

export default NGO;
