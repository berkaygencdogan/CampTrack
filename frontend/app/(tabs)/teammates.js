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
import { db, auth } from "../../src/firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

export default function TeammatesScreen() {
  const router = useRouter();
  const [team, setTeam] = useState([]);

  useEffect(() => {
    fetchTeammates();
  }, []);

  const fetchTeammates = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    const ref = collection(db, "users", uid, "teammates");
    const snap = await getDocs(ref);

    const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    setTeam(list);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Teammates</Text>

      <FlatList
        data={team}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingVertical: 15 }}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Image source={{ uri: item.image }} style={styles.avatar} />

            <View>
              <Text style={styles.name}>{item.name}</Text>
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
