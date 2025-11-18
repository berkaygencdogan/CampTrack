import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";

import { db } from "../src/firebase/firebaseConfig"; // ← kendi config dosyana göre ayarla
import { doc, getDoc } from "firebase/firestore";

export default function LocationDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);

  // ---- FIRESTORE'DAN DETAY ÇEK ----
  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const ref = doc(db, "places", id); // Firestore koleksiyon adı: places
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setPlace(snap.data());
        } else {
          console.log("Place not found");
        }
      } catch (err) {
        console.log("Error loading place:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlace();
  }, []);

  // ---- LOADING UI ----
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ fontSize: 18 }}>Loading...</Text>
      </View>
    );
  }

  // ---- PLACE YOKSA ----
  if (!place) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ fontSize: 18, color: "red" }}>Place not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* ---- BACK BUTTON ---- */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
        <Ionicons name="chevron-back" size={28} color="#fff" />
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ---- HEADER IMAGE ---- */}
        <Image source={{ uri: place.image }} style={styles.image} />

        {/* ---- CONTENT ---- */}
        <View style={styles.content}>
          <Text style={styles.title}>{place.name}</Text>
          <Text style={styles.city}>{place.city}</Text>

          <Text style={styles.description}>{place.description}</Text>

          {/* ---- SELECT BUTTON ---- */}
          <TouchableOpacity style={styles.selectBtn}>
            <Text style={styles.selectText}>Select Location</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

/* ------------------- STYLES ------------------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  backBtn: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 10,
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: 6,
    borderRadius: 30,
  },

  image: {
    width: "100%",
    height: 450,
    resizeMode: "cover",
  },

  content: {
    backgroundColor: "#fff",
    padding: 25,
    marginTop: -20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    position: "absolute",
    top: -110,
    left: 20,
    zIndex: 10,
  },

  city: {
    fontSize: 16,
    color: "#E0E0E0",
    position: "absolute",
    top: -70,
    left: 20,
    zIndex: 10,
  },

  description: {
    fontSize: 15,
    color: "#777",
    marginTop: 10,
    lineHeight: 22,
  },

  selectBtn: {
    backgroundColor: "#7CC540",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 30,
  },
  selectText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
