import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import VisitModal from "./VisitsModal";
import { useRouter } from "expo-router";
import i18n from "./language";

export default function MyVisited() {
  const userId = useSelector((state) => state.user.userInfo.id);
  const API = process.env.EXPO_PUBLIC_API_URL;
  const router = useRouter();
  const [visitIds, setVisitIds] = useState({});
  const [visits, setVisits] = useState([]);
  const [showMenu, setShowMenu] = useState(null);
  const [editVisit, setEditVisit] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // GET USER VISIT IDS
  const fetchVisitIds = async () => {
    try {
      const res = await fetch(`${API}/visited/${userId}`);
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

      const res = await fetch(`${API}/visits/detail`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });

      const data = await res.json();
      if (data.success) setVisits(data.visits);
    } catch (err) {
      console.log("Visit detail error:", err);
    }
  };

  useEffect(() => {
    fetchVisitIds();
  }, []);

  useEffect(() => {
    if (Object.keys(visitIds).length > 0) fetchVisits();
  }, [visitIds]);

  // DELETE VISIT
  const deleteVisit = async (visitId) => {
    try {
      const res = await fetch(`${API}/visits/delete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visitId }),
      });

      const data = await res.json();
      if (data.success) fetchVisitIds();
    } catch (err) {
      console.log("Delete visit error:", err);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      {/* Menu Button */}
      <TouchableOpacity
        style={styles.menuBtn}
        onPress={() => setShowMenu(showMenu === item.id ? null : item.id)}
      >
        <Ionicons name="ellipsis-vertical" size={20} color="#444" />
      </TouchableOpacity>

      {/* OPENED MENU */}
      {showMenu === item.id && (
        <View style={styles.menuBox}>
          <TouchableOpacity
            onPress={() => {
              setEditVisit(item);
              setShowEditModal(true);
              setShowMenu(null);
            }}
          >
            <Text style={styles.menuItem}>Düzenle</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              deleteVisit(item.id);
              setShowMenu(null);
            }}
          >
            <Text style={[styles.menuItem, { color: "red" }]}>Sil</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* IMAGE */}
      <Image
        source={{ uri: item.photos?.[0] || "https://via.placeholder.com/120" }}
        style={styles.image}
      />

      {/* INFO */}
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={styles.placeName}>{item.placeName}</Text>
        <Text style={styles.city}>{item.city}</Text>

        <View style={styles.avatarRow}>
          {item.teammates.map((uid) => (
            <Image
              key={uid}
              source={{
                uri:
                  item.userMap?.[uid]?.avatar ||
                  `https://ui-avatars.com/api/?name=${
                    item.userMap?.[uid]?.name || "?"
                  }`,
              }}
              style={styles.avatar}
            />
          ))}
        </View>
      </View>
    </View>
  );

  if (visits.length === 0)
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>Henüz ziyaret eklemediniz.</Text>
      </View>
    );

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          width: "70%",
          flexDirection: "row",
          justifyContent: "space-around",
          marginTop: 40,
        }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={26} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>{i18n.t("myfavoriteplaces")}</Text>
      </View>

      <FlatList
        data={visits}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20 }}
      />

      {/* EDIT MODAL */}
      <VisitModal
        visible={showEditModal}
        onClose={() => setShowEditModal(false)}
        editVisit={editVisit}
        onSaved={() => {
          fetchVisitIds();
          setShowEditModal(false);
        }}
        place={
          editVisit
            ? {
                id: editVisit.placeId,
                name: editVisit.placeName,
                city: editVisit.city,
              }
            : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#f6f6f6",
    marginBottom: 15,
    padding: 10,
    borderRadius: 12,
    position: "relative",
  },
  image: { width: 90, height: 90, borderRadius: 10 },
  menuBtn: {
    position: "absolute",
    right: 10,
    top: 10,
    padding: 5,
    zIndex: 50,
  },
  menuBox: {
    position: "absolute",
    right: 10,
    top: 35,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    elevation: 5,
    zIndex: 999,
  },
  menuItem: { fontSize: 15, paddingVertical: 6 },

  placeName: { fontSize: 17, fontWeight: "700" },
  city: { fontSize: 14, color: "#555" },

  avatarRow: { flexDirection: "row", marginTop: 8 },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 40,
    marginRight: 6,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "700",
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { fontSize: 16, color: "#777" },
});
