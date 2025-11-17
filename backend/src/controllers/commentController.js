import { db } from "../config/firebaseAdmin.js";

// Yorum ekle
export const addComment = async (req, res) => {
  try {
    const { placeId, rating, comment } = req.body;

    if (!placeId || !rating || !comment) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const data = {
      placeId,
      rating,
      comment,
      userId: req.user.uid,
      createdAt: Date.now(),
    };

    await db.collection("comments").add(data);

    res.json({ success: true, message: "Comment added" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Yorumları listele
export const getComments = async (req, res) => {
  try {
    const { placeId } = req.params;

    const snapshot = await db
      .collection("comments")
      .where("placeId", "==", placeId)
      .orderBy("createdAt", "desc")
      .get();

    const comments = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
