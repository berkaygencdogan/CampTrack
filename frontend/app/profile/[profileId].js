import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useCallback, useState } from "react";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";

const { width } = Dimensions.get("window");

export default function OtherUserProfile() {
  const { profileId } = useLocalSearchParams();
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState("gallery");
  const [posts, setPosts] = useState([]);
  const [visitIds, setVisitIds] = useState({});
  const [visits, setVisits] = useState([]);
  const [addedPlaces, setAddedPlaces] = useState([]);
  const [favorites, setFavorites] = useState([]);

  // ------------------------------------------------------
  // FETCH PROFILE
  // ------------------------------------------------------
  useFocusEffect(
    useCallback(() => {
      fetchProfile();
      fetchPost();
      fetchMyPlaces();
      fetchFavs();
      fetchVisitIds();
    }, [])
  );

  const fetchProfile = async () => {
    try {
      const res = await axios.get(
        `${process.env.EXPO_PUBLIC_API_URL}/user/${profileId}`
      );
      setUserData(res.data.user);
    } catch (err) {
      console.log("PROFILE FETCH ERROR:", err);
    } finally {
      setLoading(false);
    }
  };
  const fetchPost = async () => {
    try {
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/user/${profileId}/gallery`
      );

      const data = await res.json();
      setPosts(data.posts || []);
    } catch (err) {
      console.log("GALLERY FETCH ERROR:", err);
    }
  };
  const fetchMyPlaces = async () => {
    try {
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/places/user/${profileId}`
      );
      const data = await res.json();

      if (res.ok) {
        setAddedPlaces(data.places);
      }
    } catch (err) {
      console.log("FETCH_MY_PLACES_ERROR:", err);
    } finally {
      setLoading(false);
    }
  };
  const fetchFavs = async () => {
    const res = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/favorites?userId=${profileId}`
    );

    const data = await res.json();
    setFavorites(data.favorites || []);
  };
  const fetchVisitIds = async () => {
    try {
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/visited/${profileId}`
      );
      const data = await res.json();
      if (data.success) setVisitIds(data.visits || {});
    } catch (err) {
      console.log("Visit ID error:", err);
    }
  };

  // GET VISIT DETAILS
  const fetchVisits = async () => {
    try {
      const ids = Object.keys(visitIds);
      if (ids.length === 0) return setVisits([]);

      const res = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/visits/detail`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids }),
        }
      );

      const data = await res.json();
      if (data.success) setVisits(data.visits);
    } catch (err) {
      console.log("Visit detail error:", err);
    }
  };

  useEffect(() => {
    if (Object.keys(visitIds).length > 0) fetchVisits();
  }, [visitIds]);
  if (loading || !userData) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator size="large" color="#3D7AFF" />
      </View>
    );
  }

  // ------------------------------------------------------
  // HEADER TITLE
  // ------------------------------------------------------
  const getHeaderTitle = () => {
    switch (selectedTab) {
      case "gallery":
        return "Gallery";
      case "added":
        return "Added";
      case "favorites":
        return "Favorites";
      case "visited":
        return "Visited";
    }
  };

  // ------------------------------------------------------
  // GRID LIST
  // ------------------------------------------------------
  const renderImageGrid = (list) => (
    <View style={styles.gridWrapper}>
      {list.length === 0 ? (
        <Text style={styles.empty}>No items</Text>
      ) : (
        list.map((item, i) => (
          <TouchableOpacity
            key={i}
            onPress={() =>
              selectedTab === "gallery"
                ? router.push(`/post/${profileId}/${i}`)
                : router.push(`/LocationDetail?id=${item.id}`)
            }
          >
            <Image
              source={{ uri: item.mediaUrl || item.photos?.[0] }}
              style={styles.gridItem}
            />
          </TouchableOpacity>
        ))
      )}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {/* COVER */}
      <View style={styles.coverWrapper}>
        {userData.coverPhoto ? (
          <Image
            source={{ uri: userData.coverPhoto }}
            style={styles.coverImage}
          />
        ) : (
          <LinearGradient
            colors={["#4338CA", "#6D28D9", "#7C3AED"]}
            style={styles.coverGradient}
          />
        )}

        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" color="#fff" size={28} />
        </TouchableOpacity>
      </View>

      {/* PROFILE CARD */}
      <View style={styles.profileCard}>
        <Image
          source={{
            uri: userData.avatar || "https://i.imgur.com/0y8Ftya.png",
          }}
          style={styles.avatar}
        />

        <Text style={styles.nickname}>{userData.nickname}</Text>
        <Text style={styles.nickname}>{userData.name}</Text>
        <Text style={styles.bio}>{userData.bio || "No bio added."}</Text>
      </View>

      {/* TAB HEADER */}
      <View style={styles.tabHeader}>
        <Text style={styles.headerTitle}>{getHeaderTitle()}</Text>
      </View>

      {/* TAB BAR */}
      <View style={styles.tabBar}>
        <TabButton
          title={`Gallery (${posts.length})`}
          active={selectedTab === "gallery"}
          onPress={() => setSelectedTab("gallery")}
        />
        <TabButton
          title={`Added (${addedPlaces.length})`}
          active={selectedTab === "added"}
          onPress={() => setSelectedTab("added")}
        />
        <TabButton
          title={`Favorites (${favorites.length})`}
          active={selectedTab === "favorites"}
          onPress={() => setSelectedTab("favorites")}
        />
        <TabButton
          title={`Visited (${visits.length})`}
          active={selectedTab === "visited"}
          onPress={() => setSelectedTab("visited")}
        />
      </View>

      {/* CONTENT */}
      {selectedTab === "gallery" && renderImageGrid(posts)}
      {selectedTab === "added" && renderImageGrid(addedPlaces)}
      {selectedTab === "favorites" && renderImageGrid(favorites)}
      {selectedTab === "visited" && renderImageGrid(visits)}

      <View style={{ height: 50 }} />
    </ScrollView>
  );
}

/* TAB BUTTON */
const TabButton = ({ title, active, onPress }) => (
  <TouchableOpacity
    style={[styles.tabBtn, active && styles.tabBtnActive]}
    onPress={onPress}
  >
    <Text style={[styles.tabBtnText, active && styles.tabBtnTextActive]}>
      {title}
    </Text>
  </TouchableOpacity>
);

/* STYLES */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F3F5F9" },
  loadingScreen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  coverWrapper: {
    width: "100%",
    height: 220,
    position: "relative",
  },
  coverGradient: { width: "100%", height: "100%" },
  coverImage: { width: "100%", height: "100%" },

  backBtn: {
    position: "absolute",
    top: 40,
    left: 15,
    backgroundColor: "rgba(0,0,0,0.2)",
    padding: 6,
    borderRadius: 40,
  },

  profileCard: {
    marginTop: -70,
    backgroundColor: "#fff",
    marginHorizontal: 20,
    borderRadius: 20,
    paddingVertical: 20,
    alignItems: "center",
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 80,
    marginTop: -80,
    borderWidth: 4,
    borderColor: "#fff",
  },
  nickname: { fontSize: 24, fontWeight: "700", color: "#222", marginTop: 10 },
  bio: {
    color: "#555",
    fontSize: 14,
    marginTop: 8,
    textAlign: "center",
    paddingHorizontal: 25,
  },

  tabHeader: {
    marginTop: 25,
    marginHorizontal: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1F2937",
  },

  tabBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 10,
    marginTop: 15,
  },
  tabBtn: { paddingVertical: 8, paddingHorizontal: 10, borderRadius: 10 },
  tabBtnActive: { backgroundColor: "#E0E7FF" },
  tabBtnText: { color: "#6B7280", fontSize: 13 },
  tabBtnTextActive: { color: "#3D7AFF", fontWeight: "700" },

  gridWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 15,
    marginTop: 20,
  },
  gridItem: {
    width: (width - 75) / 3,
    height: (width - 75) / 3,
    marginRight: 10,
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: "#e1e1e1",
  },

  empty: {
    width: "100%",
    textAlign: "center",
    marginTop: 20,
    color: "#777",
  },
});
