import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "expo-router";

export default function Favorites() {
  const router = useRouter();
  const [favorites, setFavorites] = useState([]);
  const user = useSelector((state) => state.user);

  useEffect(() => {
    const fetchFavs = async () => {
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/favorites?userId=${user.userInfo.id}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      const data = await res.json();
      setFavorites(data.favorites || []);
    };

    fetchFavs();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Favorite Places</Text>

      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/LocationDetail?id=${item.id}`)}
          >
            <Image source={{ uri: item.photos[0] }} style={styles.img} />
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.city}>{item.city}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  card: {
    flexDirection: "row",
    marginBottom: 15,
    backgroundColor: "#f7f7f7",
    padding: 10,
    borderRadius: 10,
  },
  img: { width: 80, height: 80, borderRadius: 10, marginRight: 10 },
  name: { fontSize: 18, fontWeight: "600" },
  city: { fontSize: 14, color: "#777" },
});
