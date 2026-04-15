import express from "express";
import tripController from "../controllers/tripController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import validate from "../middlewares/validate.js";
import { tripSchema } from "../validations/tripValidation.js";

const router = express.Router();

router.post("/options", authMiddleware, tripController.getTravelOptions);

router.post(
  "/generate",
  authMiddleware,
  validate(tripSchema),
  tripController.generateTrip
);

router.get("/all", authMiddleware, tripController.getAllTrips);
router.get("/:id", authMiddleware, tripController.getTripById);
router.delete("/:id", authMiddleware, tripController.deleteTrip);

export default router;