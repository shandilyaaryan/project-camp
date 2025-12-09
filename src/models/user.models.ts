import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
  avatar: {
    type: { url: String, localPath: String },
    default: {
      url: "https://avatars.githubusercontent.com/u/64391491?s=400&u=9ffe76c447275d73fddcd4216ccde1d0ca6291e8&v=4",
      localPath: "",
  }},
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true
  },
  fullName: {
    type: String,
    trim: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    select: false
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  refreshToken: String,
  forgotPasswordToken: String,
  forgotPasswordExpiry: Date,
  emailVerificationToken: String,
  emailVerificationExpiry: Date
}, { timestamps: true });

export const Usermodel = mongoose.model("User", userSchema);
