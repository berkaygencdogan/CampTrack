import express from "express";
import {
  addFavorite,
  removeFavorite,
  getFavorites,
} from "../controllers/favoriteController.js";
import auth from "../middleware/authMiddleware.js";

const router = express.Router();

// Favori ekleme
router.post("/", auth, addFavorite);

// Favoriden çıkarma
router.delete("/", auth, removeFavorite);

// Kullanıcının favorilerini listeleme
router.get("/:userId", getFavorites);

export default router;
