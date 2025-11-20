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
import { useSelector } from "react-redux";

export default function LocationDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  console.log("yer", id);
  // ❤️ FAVORİ STATE
  const [isFav, setIsFav] = useState(false);

  // Kullanıcı bilgisi (Redux’tan)
  const user = useSelector((state) => state.user.userInfo);
  console.log("asdas", user);
  // ------------------------------------------------
  // FAVORİ EKLE / KALDIR
  // ------------------------------------------------
  const toggleFavorite = async () => {
    if (!user) return;

    const url = isFav
      ? `${process.env.EXPO_PUBLIC_API_URL}/favorites/remove`
      : `${process.env.EXPO_PUBLIC_API_URL}/favorites/add`;

    try {
      await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          userId: user.id,
          placeId: id,
        }),
      });

      setIsFav(!isFav);
    } catch (err) {
      console.log("Favorite error:", err);
    }
  };

  // ------------------------------------------------
  // PLACE DETAILS FETCH
  // ------------------------------------------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}/places/${id}`
        );
        const data = await res.json();

        if (res.ok) setPlace(data.place);

        // Favori kontrolü
        if (user && data.place.favoritedBy?.includes(user.uid)) {
          setIsFav(true);
        }
      } catch (err) {
        console.log("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loading}>
        <Text style={{ fontSize: 18 }}>Loading...</Text>
      </View>
    );
  }

  if (!place) {
    return (
      <View style={styles.loading}>
        <Text style={{ fontSize: 18, color: "red" }}>Place not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* BACK BUTTON */}
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={26} color="#fff" />
      </TouchableOpacity>

      {/* FAVORITE HEART */}
      <TouchableOpacity style={styles.favBtn} onPress={toggleFavorite}>
        <Ionicons
          name={isFav ? "heart" : "heart-outline"}
          size={28}
          color={isFav ? "#ff3b30" : "#fff"}
        />
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HEADER IMAGE */}
        <Image source={{ uri: place.photos[0] }} style={styles.headerImage} />

        {/* WHITE BOTTOM PANEL */}
        <View style={styles.bottomPanel}>
          <Text style={styles.placeName}>{place.name}</Text>
          <Text style={styles.location}>{place.city}</Text>

          <Text style={styles.description}>{place.description}</Text>

          <TouchableOpacity
            style={styles.selectBtn}
            onPress={() => console.log("LOCATION SELECTED")}
          >
            <Text style={styles.selectText}>Select Location</Text>
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
    zIndex: 20,
    top: 50,
    left: 20,
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: 8,
    borderRadius: 30,
  },

  favBtn: {
    position: "absolute",
    zIndex: 20,
    top: 50,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: 8,
    borderRadius: 30,
  },

  headerImage: {
    width: "100%",
    height: 430,
    resizeMode: "cover",
  },

  bottomPanel: {
    marginTop: -35,
    backgroundColor: "#fff",
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    padding: 25,
    minHeight: 500,
  },
  placeName: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 6,
  },
  location: {
    fontSize: 17,
    color: "#777",
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: "#666",
    lineHeight: 22,
  },

  selectBtn: {
    backgroundColor: "#7CC540",
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 25,
  },
  selectText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
