import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import PlaceCard from "./PlaceCard";

export default function MyAddedPlaceScreen() {
  const router = useRouter();
  const user = useSelector((state) => state.user.userInfo);

  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyPlaces = async () => {
    try {
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/places/user/${user.id}`
      );
      const data = await res.json();

      if (res.ok) {
        setPlaces(data.places);
      }
    } catch (err) {
      console.log("FETCH_MY_PLACES_ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyPlaces();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#7CC540" />
      </View>
    );
  }

  if (places.length === 0) {
    return (
      <View style={styles.center}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={26} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerText}>My Favorite Places</Text>
        </View>
        <Text style={{ fontSize: 17, color: "#777" }}>
          Henüz eklediğin bir yer yok.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={26} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>My Added Places</Text>
      </View>
      <FlatList
        data={places}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PlaceCard item={item} small={false} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#fff",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 30,
  },
  headerText: {
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    flex: 1,
  },
  btnText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },
});
