import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";

export default function Home() {
  const router = useRouter();

  const [popular, setPopular] = useState([]);
  const [recent, setRecent] = useState([]);
  const [allPlaces, setAllPlaces] = useState([]);

  const API = process.env.EXPO_PUBLIC_API_URL;

  // -----------------------------------------------------------
  // FETCH POPULAR
  // -----------------------------------------------------------
  const fetchPopular = async () => {
    try {
      const res = await fetch(`${API}/places/popular`);
      const data = await res.json();
      setPopular(data.places || []);
    } catch (err) {
      console.log("Popular Fetch Err:", err);
    }
  };

  // -----------------------------------------------------------
  // FETCH NEW PLACES
  // -----------------------------------------------------------
  const fetchNew = async () => {
    try {
      const res = await fetch(`${API}/places/new`);
      const data = await res.json();
      setRecent(data.places || []);
    } catch (err) {
      console.log("New Fetch Err:", err);
    }
  };

  // -----------------------------------------------------------
  // FETCH ALL PLACES
  // -----------------------------------------------------------
  const fetchAll = async () => {
    try {
      const res = await fetch(`${API}/places`);
      const data = await res.json();
      setAllPlaces(data.places || []);
    } catch (err) {
      console.log("All Fetch Err:", err);
    }
  };

  useEffect(() => {
    fetchPopular();
    fetchNew();
    fetchAll();
  }, []);

  // -----------------------------------------------------------
  // CARD COMPONENT
  // -----------------------------------------------------------
  const PlaceCard = ({ item, small }) => (
    <TouchableOpacity
      style={[styles.card, small && { width: 200 }]}
      onPress={() => {
        router.push(`../LocationDetail?id=${item.id}`);
      }}
    >
      <Image source={{ uri: item.photos[0] }} style={styles.cardImg} />
      <Text style={styles.cardTitle} numberOfLines={1}>
        {item.name}
      </Text>
      <Text style={styles.cardCity}>{item.city}</Text>
    </TouchableOpacity>
  );

  return (
    <View>
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        <Text style={styles.sectionTitle}>⭐ Popüler Kamp Yerleri</Text>

        <FlatList
          data={popular}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <PlaceCard item={item} small />}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingLeft: 15 }}
        />

        <Text style={styles.sectionTitle}>🔥 Yeni Eklenenler</Text>

        <FlatList
          data={recent}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <PlaceCard item={item} small />}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingLeft: 15 }}
        />

        <Text style={styles.sectionTitle}>📍 Tüm Kamp Alanları</Text>

        <View style={{ paddingHorizontal: 15 }}>
          {allPlaces.map((item) => (
            <PlaceCard key={item.id} item={item} />
          ))}
        </View>
      </ScrollView>
      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => router.push("../AddPlaceScreen")}
      >
        <Text style={styles.plus}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginHorizontal: 15,
    marginTop: 25,
    marginBottom: 10,
  },
  card: {
    width: "100%",
    marginRight: 15,
  },
  cardImg: {
    width: "100%",
    height: 130,
    borderRadius: 12,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "600",
    marginTop: 6,
  },
  cardCity: {
    fontSize: 14,
    color: "#777",
  },
  addBtn: {
    position: "absolute",
    right: 25,
    bottom: 35,
    backgroundColor: "#7CC540",
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 50,
    elevation: 5,
  },
  plus: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "900",
    marginTop: -4,
  },
});
