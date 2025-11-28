import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function AdminPlaces() {
  const admin = useSelector((state) => state.user.userInfo);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  // ------------------------------------------------
  // 🔥 TÜM YERLERİ GETİR
  // ------------------------------------------------
  const fetchPlaces = async () => {
    try {
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/admin/places/getAll?uid=${admin.id}`
      );

      const data = await res.json();

      if (data.success) {
        setPlaces(data.places);
      }
    } catch (err) {
      console.log("admin place fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaces();
  }, []);

  // ------------------------------------------------
  // 🔥 PLACE SİL
  // ------------------------------------------------
  const deletePlace = (place) => {
    Alert.alert("Yeri Sil", `${place.name} tamamen silinsin mi?`, [
      { text: "İptal", style: "cancel" },
      {
        text: "Sil",
        style: "destructive",
        onPress: async () => {
          try {
            const res = await fetch(
              `${process.env.EXPO_PUBLIC_API_URL}/admin/places/delete?uid=${admin.id}`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ placeId: place.id }),
              }
            );

            const data = await res.json();

            if (data.success) {
              Alert.alert("Başarılı", "Yer silindi");
              fetchPlaces();
            } else {
              Alert.alert("Hata", data.error || "Silinemedi");
            }
          } catch (err) {
            console.log("delete place error:", err);
          }
        },
      },
    ]);
  };

  // ------------------------------------------------
  // 🔥 UI – Place Kartı
  // ------------------------------------------------
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image
        source={{ uri: item.photos?.[0] || "https://via.placeholder.com/150" }}
        style={styles.image}
      />

      <View style={{ flex: 1, marginLeft: 10 }}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.city}>{item.city}</Text>

        <Text style={styles.desc}>
          {item.description.length > 80
            ? item.description.slice(0, 80) + "..."
            : item.description}
        </Text>

        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => deletePlace(item)}
        >
          <Text style={styles.deleteText}>Sil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Yükleniyor...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Yer Yönetimi</Text>

      <FlatList
        data={places}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

/* ----------------------------- STYLES ----------------------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },

  card: {
    flexDirection: "row",
    backgroundColor: "#f6f6f6",
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
  },

  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },

  name: { fontSize: 18, fontWeight: "700" },
  city: { fontSize: 14, color: "#666", marginBottom: 5 },
  desc: { color: "#555", fontSize: 13 },

  deleteBtn: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    width: 90,
    alignItems: "center",
  },

  deleteText: { color: "#fff", fontWeight: "700" },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
