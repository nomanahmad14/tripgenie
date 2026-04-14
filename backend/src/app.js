import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import tripRoutes from "./routes/tripRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api/trips", tripRoutes);

app.get("/", (req, res) => {
  res.send("TripGenie API running");
});


export default app;
