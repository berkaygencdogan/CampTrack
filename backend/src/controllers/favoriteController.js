import { db } from "../config/firebaseAdmin.js";

// FAVORİ EKLEME
export const addFavorite = async (req, res) => {
  try {
    const { placeId } = req.body;

    if (!placeId) return res.status(400).json({ error: "placeId missing" });

    const data = {
      placeId,
      userId: req.user.uid,
      createdAt: Date.now(),
    };

    await db.collection("favorites").add(data);

    res.json({ success: true, message: "Added to favorites" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// FAVORİDEN ÇIKARMA
export const removeFavorite = async (req, res) => {
  try {
    const { placeId } = req.body;

    if (!placeId) return res.status(400).json({ error: "placeId missing" });

    const snapshot = await db
      .collection("favorites")
      .where("userId", "==", req.user.uid)
      .where("placeId", "==", placeId)
      .get();

    if (snapshot.empty) {
      return res.status(404).json({ error: "Favorite not found" });
    }

    const batch = db.batch();
    snapshot.forEach((doc) => batch.delete(doc.ref));
    await batch.commit();

    res.json({ success: true, message: "Removed from favorites" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// KULLANICININ TÜM FAVORİLERİNİ GETİRME
export const getFavorites = async (req, res) => {
  try {
    const { userId } = req.params;

    const snapshot = await db
      .collection("favorites")
      .where("userId", "==", userId)
      .orderBy("createdAt", "desc")
      .get();

    const favorites = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json(favorites);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
