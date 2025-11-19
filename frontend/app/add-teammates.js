import { useRouter } from "expo-router";
import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API = process.env.EXPO_PUBLIC_API_URL;

export default function AddTeammates() {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);

  const [me, setMe] = useState({
    name: "",
    username: "",
    photo: null,
  });

  // Me bilgisi
  useState(() => {
    (async () => {
      const token = await AsyncStorage.getItem("token");
      const res = await fetch(`${API}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setMe(data.user);
    })();
  }, []);

  const searchUser = async (text) => {
    setQuery(text);
    if (text.length < 2) {
      setResults([]);
      return;
    }

    setLoadingSearch(true);

    const token = await AsyncStorage.getItem("token");

    const res = await fetch(`${API}/users/search?query=${text}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    setLoadingSearch(false);

    if (Array.isArray(data)) setResults(data);
  };

  const sendRequest = async (uid) => {
    const token = await AsyncStorage.getItem("token");

    const res = await fetch(`${API}/teammates/send-request`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ to: uid }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Request sent!");
    } else {
      alert(data.error || "Error");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Add Teammate</Text>

      <TextInput
        style={styles.search}
        placeholder="Search by username"
        value={query}
        onChangeText={searchUser}
      />

      {loadingSearch && <Text style={{ marginTop: 10 }}>Searching...</Text>}

      <FlatList
        data={results}
        keyExtractor={(item) => item.uid}
        renderItem={({ item }) => (
          <View style={styles.userBox}>
            <Image source={{ uri: item.photo }} style={styles.photo} />
            <View>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.username}>@{item.username}</Text>
            </View>

            <TouchableOpacity
              style={styles.addBtn}
              onPress={() => sendRequest(item.uid)}
            >
              <Text style={styles.addText}>Send</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* ALWAYS SHOW CURRENT USER */}
      <View style={styles.meBox}>
        <Image source={{ uri: me.photo }} style={styles.photo} />
        <View>
          <Text style={styles.name}>{me.name}</Text>
          <Text style={styles.username}>@{me.username} (You)</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#fff", flex: 1 },
  header: { fontSize: 22, fontWeight: "700", marginBottom: 15 },

  search: {
    backgroundColor: "#F3F3F3",
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
  },

  userBox: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#F7F7F7",
    borderRadius: 12,
    marginBottom: 10,
    justifyContent: "space-between",
  },

  meBox: {
    marginTop: 40,
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#E9FFE1",
    borderRadius: 12,
  },

  photo: {
    width: 45,
    height: 45,
    borderRadius: 25,
    marginRight: 12,
  },
  name: { fontSize: 16, fontWeight: "600" },
  username: { fontSize: 14, color: "#555" },

  addBtn: {
    backgroundColor: "#7CC540",
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 10,
  },
  addText: { color: "#fff", fontWeight: "600" },
});
