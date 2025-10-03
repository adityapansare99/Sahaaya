import mongoose, { mongo } from "mongoose";
import { dbname } from "../constant.js";

const connectdb = async () => {
  try {
    const response = await mongoose.connect(`${process.env.dblink}${dbname}`);
    console.log("Database connected successfully");
  } catch (err) {
    console.log("Unable to connect to database"+err);
    process.exit(1);
  }
};

export default connectdb;
