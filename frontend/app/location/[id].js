import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useState } from "react";

// Firestore
import { db } from "../../src/firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

export default function LocationDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);

  // -----------------------------
  //   Firestore'dan Veriyi Çek
  // -----------------------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        const ref = doc(db, "places", id);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setPlace(snap.data());
        } else {
          console.log("Place not found");
        }
      } catch (err) {
        console.log("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // LOADING SCREEN
  if (loading) {
    return (
      <View style={styles.loading}>
        <Text style={{ fontSize: 18 }}>Loading...</Text>
      </View>
    );
  }

  // PLACE NOT FOUND
  if (!place) {
    return (
      <View style={styles.loading}>
        <Text style={{ fontSize: 18, color: "red" }}>Place not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* ---------------- Back Button ---------------- */}
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={28} color="#fff" />
      </TouchableOpacity>

      {/* ---------------- Scrollable Area ---------------- */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ---------------- Big Header Image ---------------- */}
        <Image source={{ uri: place.image }} style={styles.headerImage} />

        {/* ---------------- Main Panel ---------------- */}
        <View style={styles.bottomPanel}>
          <Text style={styles.placeName}>{place.name}</Text>
          <Text style={styles.location}>{place.city}</Text>

          {/* Description */}
          {place.description && (
            <Text style={styles.description}>{place.description}</Text>
          )}

          {/* Features - Eğer Firestore’da varsa */}
          {place.features && (
            <View style={styles.featuresBox}>
              {place.features.security && (
                <View style={styles.featureItem}>
                  <Ionicons name="shield-checkmark" size={20} color="#7CC540" />
                  <Text style={styles.featureText}>Security</Text>
                </View>
              )}

              {place.features.market && (
                <View style={styles.featureItem}>
                  <Ionicons name="cart" size={20} color="#7CC540" />
                  <Text style={styles.featureText}>Market Nearby</Text>
                </View>
              )}

              {place.features.caravan && (
                <View style={styles.featureItem}>
                  <Ionicons name="bus" size={20} color="#7CC540" />
                  <Text style={styles.featureText}>Caravan Allowed</Text>
                </View>
              )}
            </View>
          )}

          {/* Select Button */}
          <TouchableOpacity style={styles.btn}>
            <Text style={styles.btnText}>Explore Location</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

/* ---------------------------- STYLES ---------------------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },

  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  backBtn: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 6,
    borderRadius: 40,
  },

  headerImage: {
    width: "100%",
    height: 430,
    resizeMode: "cover",
  },

  bottomPanel: {
    marginTop: -20,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 25,
    minHeight: 450,
  },

  placeName: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 6,
  },

  location: {
    fontSize: 16,
    color: "#777",
    marginBottom: 20,
  },

  description: {
    fontSize: 15,
    color: "#666",
    lineHeight: 22,
  },

  featuresBox: {
    marginTop: 20,
    marginBottom: 20,
  },

  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  featureText: {
    marginLeft: 10,
    fontSize: 15,
  },

  btn: {
    backgroundColor: "#7CC540",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },

  btnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
