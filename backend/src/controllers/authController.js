import authService from "../services/authService.js";


const register = async (req, res) => {
  try {
    const data = await authService.registerUser(req.body);

    res.status(201).json({
      success: true,
      message: "OTP sent to email",
      data
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const login = async (req, res) => {
  try {
    const data = await authService.loginUser(req.body);

    res.json({
      success: true,
      message: "Login successful",
      data
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message
    });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const data = await authService.verifyOTP(req.body);

    res.json({
      success: true,
      message: "Email verified successfully",
      data
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
const resendOtp = async (req, res) => {
  try {
    const data = await authService.resendOTP(req.body);

    res.json({
      success: true,
      message: "OTP resent successfully",
      data
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const data = await authService.forgotPassword(req.body);

    res.json({
      success: true,
      message: "OTP sent",
      data
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const data = await authService.resetPassword(req.body);

    res.json({
      success: true,
      message: "Password reset successful",
      data
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};


export default { register, login,verifyOtp,resendOtp ,forgotPassword,resetPassword};

