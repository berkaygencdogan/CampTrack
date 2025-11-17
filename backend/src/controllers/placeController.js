import { db } from "../config/firebaseAdmin.js";

// Kamp yeri ekle
export const addPlace = async (req, res) => {
  try {
    const data = req.body;

    // kullanıcı id backend'e auth middleware ile geliyor
    data.createdBy = req.user.uid;
    data.status = "pending";
    data.createdAt = Date.now();

    const ref = await db.collection("places").add(data);

    res.json({ success: true, id: ref.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Kamp yerlerini listele (sadece approved olanlar)
export const getPlaces = async (req, res) => {
  try {
    const snapshot = await db
      .collection("places")
      .where("status", "==", "approved")
      .get();

    const list = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json(list);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
