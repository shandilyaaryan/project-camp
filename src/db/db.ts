import mongoose from "mongoose";

export const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log("Connected to Database");
  } catch (error) {
    console.error(`Failed to connect to DB: ${error}`);
    process.exit(1);
  }
};
