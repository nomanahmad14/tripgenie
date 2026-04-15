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

const getTripById = async (req, res) => {
  try {
    const trip = await tripService.getTripById(req.params.id, req.user.id);

    res.json({
      success: true,
      data: trip
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
};

const deleteTrip = async (req, res) => {
  try {
    await tripService.deleteTrip(req.params.id, req.user.id);

    res.json({
      success: true,
      message: "Trip deleted successfully"
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
};

export default {
  generateTrip,
  getAllTrips,
  getTravelOptions,
  getTripById,
  deleteTrip
};