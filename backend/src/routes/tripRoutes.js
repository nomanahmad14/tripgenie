import express from "express";
import tripController from "../controllers/tripController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/generate", authMiddleware, tripController.generateTrip);

export default router;