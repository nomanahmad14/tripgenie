import express from "express";
import tripController from "../controllers/tripController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/options", authMiddleware, tripController.getTravelOptions);
router.post("/generate", authMiddleware, tripController.generateTrip);
router.get("/all", authMiddleware, tripController.getAllTrips);

export default router;