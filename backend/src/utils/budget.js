import { getCoordinates } from "./geocode.js";
import { calculateDistance } from "./distance.js";

export const getBudgetRange = async (
  budgetType,
  days,
  people,
  source,
  destination,
  transport
) => {
  const fromCoords = await getCoordinates(source);
  const toCoords = await getCoordinates(destination);

  const distance = calculateDistance(fromCoords, toCoords);

  let stayBase, foodBase, localBase;

  if (budgetType === "low") {
    stayBase = 800;
    foodBase = 300;
    localBase = 200;
  } else if (budgetType === "medium") {
    stayBase = 1500;
    foodBase = 500;
    localBase = 300;
  } else {
    stayBase = 3000;
    foodBase = 800;
    localBase = 600;
  }

  const stayPerDay = people > 1 ? stayBase * 0.7 : stayBase;

  const totalStay = stayPerDay * days * people;
  const totalFood = foodBase * days * people;
  const totalLocal = localBase * days * people;

  let travelCost;

  if (transport === "road") {
    travelCost = distance * 2 * people;
  } else if (transport === "train") {
    travelCost = distance * 4 * people;
  } else {
    let baseFare, perKm;

    if (budgetType === "low") {
      baseFare = 3000;
      perKm = 5;
    } else if (budgetType === "medium") {
      baseFare = 4000;
      perKm = 6;
    } else {
      baseFare = 6000;
      perKm = 8;
    }

    travelCost = (baseFare + distance * perKm) * people;
  }

  const total = totalStay + totalFood + totalLocal + travelCost;

  return {
    total,
    distance,
    breakdown: {
      stay: totalStay,
      food: totalFood,
      local: totalLocal,
      travel: travelCost
    }
  };
};