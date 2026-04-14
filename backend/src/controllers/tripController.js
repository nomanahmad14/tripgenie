import tripService from "../services/tripService.js";
import { getCoordinates } from "../utils/geocode.js";
import { calculateDistance } from "../utils/distance.js";
import { getTransportOptions } from "../utils/transport.js";

const generateTrip = async (req, res) => {
  try {
    const trip = await tripService.generateTrip(req.body, req.user.id);
    res.json({ success: true, data: trip });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllTrips = async (req, res) => {
  try {
    const data = await tripService.getAllTripsService(req.user.id, req.query);
    res.status(200).json({ success: true, ...data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getTravelOptions = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export default {
  generateTrip,
  getAllTrips,
  getTravelOptions
};