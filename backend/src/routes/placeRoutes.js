import express from "express";
import { addPlace, getPlaces } from "../controllers/placeController.js";
import auth from "../middleware/authMiddleware.js";

const router = express.Router();

// Yeni kamp yeri ekleme (auth gerekli)
router.post("/", auth, addPlace);

// Onaylanmış kamp yerlerini listeleme
router.get("/", getPlaces);

export default router;
