import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import "./config/firebaseAdmin.js";
import placeRoutes from "./routes/placeRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import favoriteRoutes from "./routes/favoriteRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// ROUTES
app.use("/places", placeRoutes);
app.use("/comments", commentRoutes);
app.use("/favorites", favoriteRoutes);

app.get("/", (req, res) => {
  res.send("CampTrack Backend is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`CampTrack backend running on port ${PORT}`);
});
