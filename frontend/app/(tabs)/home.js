import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../src/firebase/firebaseConfig";

export default function Home() {
  const router = useRouter();
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    const fetchPopular = async () => {
      try {
        const q = query(
          collection(db, "places"),
          where("isPopular", "==", true)
        );

        const snap = await getDocs(q);
        const list = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setPlaces(list);
      } catch (err) {
        console.log("Error fetching:", err);
      }
    };

    fetchPopular();
  }, []);

  return (
    <View style={styles.container}>
      {/* -------- TOP BAR -------- */}
      <View style={styles.topBar}>
        <TouchableOpacity>
          <Ionicons name="notifications-outline" size={26} color="#7CC540" />
        </TouchableOpacity>

        <TouchableOpacity>
          <Feather name="plus" size={26} color="black" />
        </TouchableOpacity>
      </View>

      {/* -------- TITLE -------- */}
      <Text style={styles.title}>Welcome to CampTrack</Text>
      <Text style={styles.subtitle}>
        Find the best camping spots around you.
      </Text>

      {/* -------- CAMP LIST -------- */}
      <ScrollView
        style={{ marginTop: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {places.map((item) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => router.push(`/location/${item.id}`)}
          >
            <View style={styles.card}>
              <Image source={{ uri: item.image }} style={styles.cardImage} />
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <Text style={styles.cardLocation}>{item.city}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 60,
  },

  /* --- TOP BAR --- */
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  /* --- TITLES --- */
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginTop: 20,
  },
  subtitle: {
    color: "#777",
    fontSize: 14,
    marginTop: 5,
  },

  /* --- CARD --- */
  card: {
    backgroundColor: "#F8F8F8",
    borderRadius: 16,
    marginBottom: 20,
    overflow: "hidden",
  },
  cardImage: {
    width: "100%",
    height: 170,
  },
  cardContent: {
    padding: 15,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  cardLocation: {
    color: "#777",
    marginTop: 4,
  },

  cardBottom: {
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  ratingBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  ratingText: {
    marginLeft: 4,
    fontWeight: "600",
  },

  detailsBtn: {
    backgroundColor: "#7CC540",
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 10,
  },
  detailsText: {
    color: "#fff",
    fontWeight: "600",
  },
});
