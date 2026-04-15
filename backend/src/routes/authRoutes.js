import express from "express";
import authController from "../controllers/authController.js";
import validate from "../middlewares/validate.js";
import { registerSchema, resetPasswordSchema } from "../validations/authValidation.js";

const router = express.Router();

router.post("/register", validate(registerSchema), authController.register);
router.post("/login", authController.login);
router.post("/verify-otp", authController.verifyOtp);
router.post("/resend-otp", authController.resendOtp);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", validate(resetPasswordSchema), authController.resetPassword);
export default router;