import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import authMiddleware from "./middlewares/authMiddleware.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({
    success: true,
    message: "Protected route accessed",
    user: req.user
  });
});

app.get("/", (req, res) => {
  res.send("TripGenie API running");
});


export default app;
