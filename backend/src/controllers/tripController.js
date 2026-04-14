import tripService from "../services/tripService.js";
import { getCoordinates } from "../utils/geocode.js";
import { calculateDistance } from "../utils/distance.js";
import { getTransportOptions } from "../utils/transport.js";
import asyncHandler from "../utils/asyncHandler.js";

const generateTrip = asyncHandler(async (req, res) => {
  const trip = await tripService.generateTrip(req.body, req.user.id);
  res.json({ success: true, data: trip });
});

const getAllTrips = asyncHandler(async (req, res) => {
  const data = await tripService.getAllTripsService(req.user.id, req.query);
  res.status(200).json({ success: true, ...data });
});

const getTravelOptions = asyncHandler(async (req, res) => {
  const { source, destination } = req.body;

  const fromCoords = await getCoordinates(source);
  const toCoords = await getCoordinates(destination);

  const distance = calculateDistance(fromCoords, toCoords);

  const transportData = getTransportOptions(distance);

  res.json({
    success: true,
    distance,
    recommended: transportData.recommended,
    allOptions: transportData.allOptions
  });
});

export default {
  generateTrip,
  getAllTrips,
  getTravelOptions
};