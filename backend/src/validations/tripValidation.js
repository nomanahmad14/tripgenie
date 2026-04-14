import { z } from "zod";

export const tripSchema = z.object({
  source: z.string().min(1, "Source is required"),
  destination: z.string().min(1, "Destination is required"),
  days: z.number().min(1).max(30),
  people: z.number().min(1).max(10),
  budgetType: z.enum(["low", "medium", "high"]),
  transport: z.enum(["road", "train", "flight"]),
  preferences: z.array(z.string()).optional()
});