import express from "express";
import { addComment, getComments } from "../controllers/commentController.js";
import auth from "../middleware/authMiddleware.js";

const router = express.Router();

// Yorum ekleme (auth gerekli)
router.post("/", auth, addComment);

// Bir kamp yerinin tüm yorumlarını listele
router.get("/:placeId", getComments);

export default router;
