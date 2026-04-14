import tripService from "../services/tripService.js";

const generateTrip = async (req, res) => {
  try {
    const trip = await tripService.generateTrip(req.body, req.user.id);

    res.json({
      success: true,
      data: trip
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export default { generateTrip };