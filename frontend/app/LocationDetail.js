import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import i18n from "./language/index";

export default function LocationDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [isFav, setIsFav] = useState(false);

  const user = useSelector((state) => state.user.userInfo);

  const nextPhoto = () => {
    if (currentIndex < place.photos.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevPhoto = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

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

  const fetchData = async () => {
    try {
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/places/${id}?userId=${user.id}`
      );
      const data = await res.json();
      if (res.ok) setPlace(data.place);

      if (data.place.isFavorite) {
        setIsFav(true);
      }
    } catch (err) {
      console.log("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ------------------------------------------------
  // PLACE DETAILS FETCH
  // ------------------------------------------------
  useEffect(() => {
    if (!id) return;
    fetchData();
  }, [id, user]);

  if (loading) {
    return (
      <View style={styles.loading}>
        <Text style={{ fontSize: 18 }}>{i18n.t("loading")}</Text>
      </View>
    );
  }

  if (!place) {
    return (
      <View style={styles.loading}>
        <Text style={{ fontSize: 18, color: "red" }}>
          {i18n.t("placenotfound")}
        </Text>
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
      <View style={styles.sliderContainer}>
        {/* SOL OK */}
        {currentIndex > 0 && (
          <TouchableOpacity style={styles.leftArrow} onPress={prevPhoto}>
            <Ionicons name="chevron-back" size={32} color="black" />
          </TouchableOpacity>
        )}

        {/* FOTO */}
        <Image
          source={{ uri: place.photos[currentIndex] }}
          style={styles.headerImage}
        />

        {/* SAĞ OK */}
        {currentIndex < place.photos.length - 1 && (
          <TouchableOpacity style={styles.rightArrow} onPress={nextPhoto}>
            <Ionicons name="chevron-forward" size={32} color="black" />
          </TouchableOpacity>
        )}
      </View>

      {/* WHITE BOTTOM PANEL */}
      <View style={styles.bottomPanel}>
        <Text style={styles.placeName}>{place.name}</Text>
        <Text style={styles.location}>{place.city}</Text>

        <Text style={styles.description}>{place.description}</Text>

        <TouchableOpacity
          style={styles.selectBtn}
          onPress={() => console.log("LOCATION SELECTED")}
        >
          <Text style={styles.selectText}>{i18n.t("addedvisitplace")}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* ---------------------------- STYLES ---------------------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
  sliderContainer: {
    width: "100%",
    height: 430,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },

  leftArrow: {
    position: "absolute",
    left: 10,
    zIndex: 10,
    padding: 2,
    backgroundColor: "white",
    borderRadius: 30,
  },

  rightArrow: {
    position: "absolute",
    right: 10,
    zIndex: 10,
    padding: 2,
    backgroundColor: "white",
    borderRadius: 30,
  },
});
