import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useFocusEffect, useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import i18n from "./language/index";

export default function Favorites() {
  const router = useRouter();
  const [favorites, setFavorites] = useState([]);
  const user = useSelector((state) => state.user);

  useFocusEffect(
    useCallback(() => {
      const fetchFavs = async () => {
        const res = await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}/favorites?userId=${user.userInfo.id}`
        );

        const data = await res.json();
        setFavorites(data.favorites || []);
      };

      fetchFavs();
    }, [])
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={26} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>{i18n.t("myfavoriteplaces")}</Text>
      </View>
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
  header: {
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
    flexDirection: "row",
  },

  headerText: {
    fontSize: 26,
    fontWeight: "bold",
    marginLeft: 20,
  },
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
