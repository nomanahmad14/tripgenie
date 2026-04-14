import axios from "axios";
import Trip from "../models/tripModel.js";
import mongoose from "mongoose";
import { getBudgetRange } from "../utils/budget.js";
import { getCoordinates } from "../utils/geocode.js";
import { calculateDistance } from "../utils/distance.js";
import redis from "../config/redis.js";

const generateTrip = async (data, userId) => {
    const {
        source,
        destination,
        days,
        people,
        budgetType,
        preferences,
        transport
    } = data;

    const cacheKey = `trip:${source}:${destination}:${days}:${people}:${budgetType}:${transport}`;

    let cached = null;
    try {
        cached = await redis.get(cacheKey);
    } catch (e) { }

    if (cached) {
        if (typeof cached === "string") {
            return JSON.parse(cached);
        }

        return cached;
    }

    const fromCoords = await getCoordinates(source);
    const toCoords = await getCoordinates(destination);

    const distance = calculateDistance(fromCoords, toCoords);

    const budget = await getBudgetRange(
        budgetType,
        days,
        people,
        source,
        destination,
        transport
    );

    const prompt = `
Generate a travel plan in JSON format.

Source: ${source}
Destination: ${destination}
Days: ${days}
People: ${people}
Selected Transport: ${transport}
Distance: ${distance} km

Budget Breakdown:
Stay: ₹${budget.breakdown.stay}
Food: ₹${budget.breakdown.food}
Local Travel: ₹${budget.breakdown.local}
Travel: ₹${budget.breakdown.travel}
Total: ₹${budget.total}

Preferences: ${preferences.join(", ")}

Return ONLY JSON.
Transport MUST be "${transport}".

{
  "summary": "string",
  "transport": "${transport}",
  "budgetBreakdown": {
    "stay": number,
    "food": number,
    "travel": number
  },
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
}
`;

    const response = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
            model: "openai/gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }]
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
        const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
        parsed = JSON.parse(cleaned);
    } catch (error) {
        throw new Error("Failed to parse AI response");
    }

    const trip = await Trip.create({
        user: userId,
        source,
        destination,
        days,
        people,
        budgetType,
        budget: {
            total: budget.total,
            distance: budget.distance,
            breakdown: {
                stay: budget.breakdown.stay,
                food: budget.breakdown.food,
                local: budget.breakdown.local,
                travel: budget.breakdown.travel
            }
        },
        transport,
        preferences,
        itinerary: parsed.days
    });


    await redis.set(cacheKey, JSON.stringify(trip), { ex: 3600 });
    try {
        await redis.set(cacheKey, JSON.stringify(trip), { ex: 3600 });
    } catch (e) { }

    return trip;
};

const getAllTripsService = async (userId, query) => {
    const page = Math.max(parseInt(query.page) || 1, 1);
    const limit = Math.min(parseInt(query.limit) || 10, 50);
    const skip = (page - 1) * limit;

    const filter = {
        user: new mongoose.Types.ObjectId(userId)
    };

    if (query.search) {
        filter.destination = {
            $regex: query.search,
            $options: "i"
        };
    }

    let sortOption = { createdAt: -1 };
    if (query.sort === "oldest") {
        sortOption = { createdAt: 1 };
    }

    const [trips, total] = await Promise.all([
        Trip.find(filter)
            .select("destination days createdAt")
            .sort(sortOption)
            .skip(skip)
            .limit(limit)
            .lean(),
        Trip.countDocuments(filter)
    ]);

    return {
        trips,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    };
};

export default {
    generateTrip,
    getAllTripsService
};