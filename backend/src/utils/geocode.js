import axios from "axios";

export const getCoordinates = async (city) => {
  const response = await axios.get(
    `https://api.opencagedata.com/geocode/v1/json?q=${city}&key=${process.env.OPENCAGE_API_KEY}`
  );

  const result = response.data.results[0];

  if (!result) {
    throw new Error("Invalid city name");
  }

  return {
    lat: result.geometry.lat,
    lon: result.geometry.lng
  };
};