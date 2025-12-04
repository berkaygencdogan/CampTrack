import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { setNotificationCount } from "../../redux/userSlice";
import NotificationButton from "../NotificationButton";
import NotificationsScreen from "../notifications";
import { useCallback } from "react";

const { width } = Dimensions.get("window");

export default function Profile() {
  const router = useRouter();
  const user = useSelector((state) => state.user);
  const userId = user?.userInfo?.id;

  const [userData, setUserData] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [posts, setPosts] = useState([]);
  const [visitIds, setVisitIds] = useState({});
  const [visits, setVisits] = useState([]);
  const [addedPlaces, setAddedPlaces] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState("gallery"); // NEW
  const unreadCount = useSelector((state) => state.user.notificationCount);
  const dispatch = useDispatch();

  useFocusEffect(
    useCallback(() => {
      fetchUser();
      fetchGallery();
      fetchMyPlaces();
      fetchVisitIds();
      fetchFavs();
      fetchNotifications();
    }, [])
  );

  const fetchUser = async () => {
    try {
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      const json = await res.json();

      if (!json.success) {
        console.log("AUTH ERROR:", json);
        router.replace("/login");
        return;
      }

      setUserData(json.user); // 🔥 tüm veriyi alıyoruz
    } catch (err) {
      console.log("Profile fetch error:", err);
      router.replace("/login");
    }
  };

  const fetchGallery = async () => {
    try {
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/user/${userId}/gallery`
      );

      const data = await res.json();
      setPosts(data.posts || []);
    } catch (err) {
      console.log("GALLERY FETCH ERROR:", err);
    }
  };
  useEffect(() => {
    if (!user.isLoggedIn) {
      router.replace("/login");
      return;
    }
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/notifications/${userId}`
      );

      const data = await res.json();
      setNotifications(data.notifications || []);
      dispatch(setNotificationCount(data.notifications.length));
    } catch (err) {
      console.log("NOTIFICATION FETCH ERROR:", err);
    }
  };
  const fetchMyPlaces = async () => {
    try {
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/places/user/${userId}`
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
      `${process.env.EXPO_PUBLIC_API_URL}/favorites?userId=${userId}`
    );

    const data = await res.json();
    setFavorites(data.favorites || []);
  };
  const fetchVisitIds = async () => {
    try {
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/visited/${userId}`
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

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    router.replace("/login");
  };

  if (!userData) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color="#3D7AFF" size="large" />
      </View>
    );
  }

  const renderImageGrid = (list) => (
    <View style={styles.gridWrapper}>
      {list.length === 0 ? (
        <Text style={styles.empty}>No items</Text>
      ) : (
        list.map((item, i) => {
          let cover = null;

          if (selectedTab === "gallery") {
            const firstPhoto = item.medias?.find((m) => m.type === "image");
            const firstVideo = item.medias?.find((m) => m.type === "video");

            if (firstPhoto) cover = firstPhoto.url;
            else if (firstVideo) cover = firstVideo.url;
            else cover = null;
          }
          if (selectedTab === "visited") {
            cover = item.placePhotos?.[0] || item.photos?.[0];
          } else {
            cover = item.photos?.[0];
          }

          // 🔥 Gerçek index’i buluyoruz
          const postIndex =
            selectedTab === "gallery"
              ? posts.findIndex((p) => p.id === item.id)
              : i;

          return (
            <TouchableOpacity
              key={item.id}
              onPress={() => {
                if (selectedTab === "gallery") {
                  router.push(`/post/${userId}/${postIndex}`);
                } else if (selectedTab === "visited") {
                  router.push(`/LocationDetail?id=${item.placeId}`);
                } else {
                  // added & favorites
                  router.push(`/LocationDetail?id=${item.id}`);
                }
              }}
            >
              <Image
                source={
                  cover
                    ? { uri: cover }
                    : require("../../src/assets/images/icon.png")
                }
                style={styles.gridImg}
              />
            </TouchableOpacity>
          );
        })
      )}
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* COVER */}
      <View style={styles.coverWrapper}>
        {userData.coverPhoto ? (
          <Image source={{ uri: userData.coverPhoto }} style={styles.cover} />
        ) : (
          <LinearGradient
            colors={["#4338CA", "#6D28D9", "#7C3AED"]}
            style={styles.cover}
          />
        )}

        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="#fff" />
        </TouchableOpacity>

        <View style={{ position: "absolute", right: 20, top: 40 }}>
          <NotificationButton
            unreadCount={unreadCount}
            onPress={() => setShowModal(true)}
          />
        </View>
      </View>

      {/* PROFILE CARD */}
      <View style={styles.profileCard}>
        <Image
          source={{
            uri: userData.avatar || "https://i.imgur.com/0y8Ftya.png",
          }}
          style={styles.avatar}
        />

        <Text style={styles.name}>{userData.nickname}</Text>
        <Text style={styles.name}>{userData.name}</Text>

        <Text style={styles.bio}>{userData.bio || "No bio added."}</Text>

        <View style={styles.buttonRow}>
          {/* ADMIN BUTTON */}
          {user.userInfo?.role === "admin" && (
            <TouchableOpacity
              style={[styles.smallBtn, { backgroundColor: "#7CC540" }]}
              onPress={() => router.push("/admin")}
            >
              <Text style={styles.smallBtnText}>Admin</Text>
            </TouchableOpacity>
          )}

          {/* EDIT PROFILE */}
          <TouchableOpacity
            style={[styles.smallBtn, { backgroundColor: "#3D7AFF" }]}
            onPress={() => router.push("/profile/edit")}
          >
            <Text style={styles.smallBtnText}>Edit</Text>
          </TouchableOpacity>

          {/* LOGOUT */}
          <TouchableOpacity
            style={[styles.smallBtn, { backgroundColor: "#ff5555" }]}
            onPress={handleLogout}
          >
            <Text style={styles.smallBtnText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* TABS */}
      <View style={styles.tabBar}>
        <TabBtn
          title={`Gallery (${posts.length})`}
          active={selectedTab === "gallery"}
          onPress={() => setSelectedTab("gallery")}
          showPlus={true}
          onPlusPress={() => router.push("/post/new")}
        />

        <TabBtn
          title={`Added (${addedPlaces.length})`}
          active={selectedTab === "added"}
          onPress={() => setSelectedTab("added")}
        />

        <TabBtn
          title={`Favorites (${favorites.length})`}
          active={selectedTab === "favorites"}
          onPress={() => setSelectedTab("favorites")}
        />

        <TabBtn
          title={`Visited (${visits.length})`}
          active={selectedTab === "visited"}
          onPress={() => setSelectedTab("visited")}
        />
      </View>

      {selectedTab === "gallery" && renderImageGrid(posts)}
      {selectedTab === "added" && renderImageGrid(addedPlaces)}
      {selectedTab === "favorites" && renderImageGrid(favorites)}
      {selectedTab === "visited" && renderImageGrid(visits)}

      {showModal && (
        <NotificationsScreen
          isModal={true}
          onClose={() => setShowModal(false)}
          data={notifications}
        />
      )}
    </ScrollView>
  );
}

/* TAB BUTTON COMPONENT */
const TabBtn = ({ title, active, onPress, showPlus, onPlusPress }) => (
  <View style={styles.tabBtnWrapper}>
    <TouchableOpacity
      style={[styles.tabBtn, active && styles.tabBtnActive]}
      onPress={onPress}
    >
      <Text style={[styles.tabBtnText, active && styles.tabBtnTextActive]}>
        {title}
      </Text>
    </TouchableOpacity>

    {/* + ICON */}
    {showPlus && active && (
      <TouchableOpacity onPress={onPlusPress} style={styles.plusBtn}>
        <Ionicons name="add-circle" size={22} color="#3D7AFF" />
      </TouchableOpacity>
    )}
  </View>
);

/* STYLES */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  coverWrapper: {
    width: "100%",
    height: 230,
    position: "relative",
  },

  cover: {
    width: "100%",
    height: "100%",
  },

  backBtn: {
    position: "absolute",
    top: 40,
    left: 20,
    padding: 6,
    backgroundColor: "rgba(0,0,0,0.25)",
    borderRadius: 30,
  },

  profileCard: {
    marginTop: -70,
    backgroundColor: "#fff",
    marginHorizontal: 20,
    paddingVertical: 20,
    borderRadius: 20,
    alignItems: "center",
  },

  avatar: {
    width: 120,
    height: 120,
    borderRadius: 80,
    borderWidth: 4,
    borderColor: "#fff",
    marginTop: -80,
  },

  name: {
    fontSize: 22,
    fontWeight: "700",
    marginTop: 10,
  },

  bio: {
    color: "#666",
    fontSize: 14,
    marginTop: 6,
    paddingHorizontal: 20,
    textAlign: "center",
  },

  editBtn: {
    backgroundColor: "#3D7AFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginTop: 12,
  },
  editBtnText: {
    color: "#fff",
    fontWeight: "700",
  },

  tabBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 25,
    paddingHorizontal: 15,
  },

  tabBtn: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  tabBtnActive: {
    backgroundColor: "#E0E7FF",
  },
  tabBtnText: {
    fontSize: 13,
    color: "#666",
  },
  tabBtnTextActive: {
    color: "#3D7AFF",
    fontWeight: "700",
  },

  gridWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 20,
    paddingHorizontal: 10,
  },

  gridImg: {
    width: (width - 75) / 3,
    height: (width - 75) / 3,
    borderRadius: 10,
    marginRight: 10,
    marginBottom: 10,
  },

  empty: {
    textAlign: "center",
    color: "#777",
    width: "100%",
    marginTop: 20,
  },
  adminBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    marginHorizontal: 20,
  },

  adminBtnText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
    marginLeft: 10,
  },

  logoutBtn: {
    backgroundColor: "#ff5555",
    marginTop: 20,
    paddingVertical: 14,
    marginHorizontal: 20,
    borderRadius: 12,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 15,
    paddingHorizontal: 20,
  },

  smallBtn: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 10,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  smallBtnText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
  tabBtnWrapper: {
    alignItems: "center",
    marginRight: 5,
  },

  plusBtn: {
    marginLeft: 6,
    justifyContent: "center",
  },
});
