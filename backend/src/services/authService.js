import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateOTP, hashOTP } from "../utils/otp.js";
import { sendEmail } from "./emailService.js";


const registerUser = async (data) => {
  const { name, email, password } = data;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const otp = generateOTP();
  const hashedOtp = hashOTP(otp);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    otp: hashedOtp,
    otpExpiry: Date.now() + 10 * 60 * 1000,
    isVerified: false
  });

  await sendEmail(
    user.email,
    "Verify your TripGenie account",
    `Your OTP is: ${otp}`
  );

  return { message: "OTP sent to email" };
};

const loginUser = async (data) => {
  const { email, password } = data;

  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Invalid credentials");
  }

  if (!user.isVerified) {
    throw new Error("Please verify your email first");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return { token };
};



const verifyOTP = async (data) => {
  const { email, otp } = data;

  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("User not found");
  }

  if (user.isVerified) {
    throw new Error("User already verified");
  }

  if (!user.otp || !user.otpExpiry) {
    throw new Error("No OTP found");
  }

  if (user.otpExpiry < Date.now()) {
    throw new Error("OTP expired");
  }

  const hashedOtp = hashOTP(otp);

  if (hashedOtp !== user.otp) {
    throw new Error("Invalid OTP");
  }

  user.isVerified = true;
  user.otp = undefined;
  user.otpExpiry = undefined;

  await user.save();

  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return { token };
};

const resendOTP = async (data) => {
  const { email } = data;

  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("User not found");
  }

  if (user.isVerified) {
    throw new Error("User already verified");
  }

  const otp = generateOTP();
  const hashedOtp = hashOTP(otp);

  console.log("RESEND OTP:", otp);

  user.otp = hashedOtp;
  user.otpExpiry = Date.now() + 10 * 60 * 1000;

  await user.save();

  await sendEmail(
    user.email,
    "TripGenie OTP Verification",
    `Your OTP is ${otp}. This is a resend request at ${Date.now()}`
  );

  return { message: "OTP resent" };
};

const forgotPassword = async (data) => {
  const { email } = data;

  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("User not found");
  }

  const otp = generateOTP();
  const hashedOtp = hashOTP(otp);

  user.otp = hashedOtp;
  user.otpExpiry = Date.now() + 10 * 60 * 1000;

  await user.save();

  await sendEmail(
    user.email,
    "TripGenie Password Reset OTP",
    `Your OTP is ${otp}`
  );


  return { message: "OTP sent for password reset" };
};

const resetPassword = async (data) => {
  const { email, otp, newPassword } = data;

  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("User not found");
  }

  if (!user.otp || !user.otpExpiry) {
    throw new Error("No OTP found");
  }

  if (user.otpExpiry < Date.now()) {
    throw new Error("OTP expired");
  }

  const hashedOtp = hashOTP(otp);

  if (hashedOtp !== user.otp) {
    throw new Error("Invalid OTP");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  user.password = hashedPassword;
  user.otp = undefined;
  user.otpExpiry = undefined;

  await user.save();

  return { message: "Password reset successful" };
};

export default { registerUser, loginUser,verifyOTP , resendOTP ,forgotPassword,resetPassword};