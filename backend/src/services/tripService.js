import axios from "axios";
import Trip from "../models/tripModel.js";

const generateTrip = async (data, userId) => {
  const { destination, days, preferences } = data;

  const prompt = `Generate a travel itinerary in JSON format.

Destination: ${destination}
Days: ${days}
Preferences: ${preferences.join(", ")}

Return ONLY valid JSON in this format:

{
  "days": [
    {
      "day": 1,
      "title": "string",
      "activities": [
        {
          "time": "string",
          "description": "string",
          "location": "string"
        }
      ]
    }
  ]
}`;

  const response = await axios.post(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      model: "openai/gpt-3.5-turbo",
      messages: [
        { role: "user", content: prompt }
      ]
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:5000",
        "X-Title": "TripGenie"
      }
    }
  );

  const text = response.data.choices[0].message.content;

  let parsed;

  try {
    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    parsed = JSON.parse(cleaned);
  } catch (error) {
    throw new Error("Failed to parse AI response");
  }

  const trip = await Trip.create({
    userId,
    destination,
    days,
    preferences,
    itinerary: parsed.days
  });

  return trip;
};

export default { generateTrip };