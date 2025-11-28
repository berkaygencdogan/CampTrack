import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
} from "react-native";
import { useSelector } from "react-redux";
import i18n from "./language/index";

import CommentsModal from "./CommentsModal"; // 🔥 YORUM MODAL

export default function LocationDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFav, setIsFav] = useState(false);

  const [commentsVisible, setCommentsVisible] = useState(false);

  const [visitModalVisible, setVisitModalVisible] = useState(false);

  const user = useSelector((state) => state.user.userInfo);

  // ------------------------------------------------
  // FOTO SLIDER
  // ------------------------------------------------
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

  // ------------------------------------------------
  // FAVORİ
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
  // PLACE DETAILS GETİR
  // ------------------------------------------------
  const fetchData = async () => {
    try {
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/places/${id}?userId=${user.id}`
      );
      const data = await res.json();

      if (res.ok) {
        setPlace(data.place);
        if (data.place.isFavorite) setIsFav(true);
      }
    } catch (err) {
      console.log("PLACE ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    fetchData();
  }, [id]);

  // ------------------------------------------------
  // LOADING
  // ------------------------------------------------
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

  // ------------------------------------------------
  // UI
  // ------------------------------------------------
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

      {/* SLIDER */}
      <View style={styles.sliderContainer}>
        {currentIndex > 0 && (
          <TouchableOpacity style={styles.leftArrow} onPress={prevPhoto}>
            <Ionicons name="chevron-back" size={32} color="black" />
          </TouchableOpacity>
        )}

        <Image
          source={{ uri: place.photos[currentIndex] }}
          style={styles.headerImage}
        />

        {currentIndex < place.photos.length - 1 && (
          <TouchableOpacity style={styles.rightArrow} onPress={nextPhoto}>
            <Ionicons name="chevron-forward" size={32} color="black" />
          </TouchableOpacity>
        )}
      </View>

      {/* WHITE BOTTOM PANEL */}
      <View style={styles.bottomPanel}>
        <Text style={styles.placeName}>{place.name}</Text>

        <View style={styles.locationRow}>
          <Text style={styles.location}>{place.city}</Text>

          {/* VISIT BUTTON */}
          <TouchableOpacity
            style={styles.visitBtn}
            onPress={() => setVisitModalVisible(true)}
          >
            <Text style={styles.selectText}>{i18n.t("addedvisitplace")}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.description}>{place.description}</Text>

        {/* COMMENTS BUTTON */}
        <TouchableOpacity
          style={styles.selectBtn}
          onPress={() => setCommentsVisible(true)}
        >
          <Text style={styles.selectText}>Yorumları Gör</Text>
        </TouchableOpacity>
      </View>

      {/* 🔥 COMMENTS MODAL */}
      <CommentsModal
        visible={commentsVisible}
        onClose={() => setCommentsVisible(false)}
        placeId={id}
      />

      {/* 🔥 VISITED PLACE MODAL — Sen dolduracaksın */}
      <Modal visible={visitModalVisible} animationType="slide">
        <View style={styles.visitModal}>
          <Text style={{ fontSize: 20, fontWeight: "700" }}>
            Buraya Gittiğini Kaydet
          </Text>

          {/* Sen dolduracaksın */}
          <TouchableOpacity
            style={[styles.selectBtn, { marginTop: 30 }]}
            onPress={() => setVisitModalVisible(false)}
          >
            <Text style={styles.selectText}>Kapat</Text>
          </TouchableOpacity>
        </View>
      </Modal>
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
  },
  description: {
    fontSize: 15,
    color: "#666",
    lineHeight: 22,
    marginTop: 10,
  },

  selectBtn: {
    backgroundColor: "#7CC540",
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginVertical: 10,
  },

  visitBtn: {
    backgroundColor: "#7CC540",
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  selectText: {
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
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

  locationRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },

  visitModal: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    paddingTop: 60,
  },
});
