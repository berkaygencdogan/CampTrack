import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function TeammatesScreen() {
  const router = useRouter();
  const [team, setTeam] = useState([]);
  const [you, setYou] = useState(null);

  useEffect(() => {
    loadTeammates();
  }, []);

  const loadTeammates = async () => {
    const token = await AsyncStorage.getItem("token");
    if (!token) return;

    try {
      const res = await axios.get(
        `${process.env.EXPO_PUBLIC_API_URL}/teammates`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTeam(res.data.teammates);
      setYou(res.data.you);
    } catch (err) {
      console.log("TEAMS ERROR:", err.response?.data || err);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Image source={{ uri: item.image }} style={styles.avatar} />

      <View>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.role}>{item.role}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Teammates</Text>

      <FlatList
        data={[...team, { ...you, isYou: true }]}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingVertical: 15 }}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Image source={{ uri: item.image }} style={styles.avatar} />

            <View>
              <Text style={styles.name}>{item.isYou ? "You" : item.name}</Text>
              <Text style={styles.role}>{item.role}</Text>
            </View>
          </View>
        )}
      />

      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => router.push("/teammates/add")}
      >
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  header: { fontSize: 22, fontWeight: "700", marginBottom: 15 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },
  avatar: { width: 60, height: 60, borderRadius: 12, marginRight: 15 },
  name: { fontSize: 17, fontWeight: "600" },
  role: { fontSize: 13, color: "#888" },

  addBtn: {
    position: "absolute",
    right: 25,
    bottom: 35,
    backgroundColor: "#7CC540",
    padding: 16,
    borderRadius: 50,
    elevation: 5,
  },
});
