import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import BackArrow from "../../src/assets/images/arrow-left.png";
import { useSelector } from "react-redux";

export default function InviteScreen() {
  const router = useRouter();
  const { teamId } = useLocalSearchParams();
  const myUserId = useSelector((state) => state.user.userInfo.id);

  const [teamName, setTeamName] = useState("");
  const [teamMembers, setTeamMembers] = useState([]);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState("");

  // ----------------------------------------------------
  // TEAM DATA LOAD (NAME + MEMBERS)
  // ----------------------------------------------------
  const loadTeam = async () => {
    const res = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/teams/${teamId}`
    );
    const data = await res.json();

    setTeamName(data.team?.teamName || "");
    setTeamMembers(data.team?.members || []); // üyeleri alıyoruz
  };

  useEffect(() => {
    loadTeam();
  }, []);

  // ----------------------------------------------------
  // SEND INVITE
  // ----------------------------------------------------
  const sendInvite = async (toUserId) => {
    setMessage("");
    await loadTeam(); // artık doğru çekiyor

    const res = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/notifications/send`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fromUserId: myUserId,
          toUserId,
          teamId,
          teamName, // ✔ artık dolu geliyor
        }),
      }
    );

    const data = await res.json();
    if (data.success) setMessage("Invite sent!");
  };

  // ----------------------------------------------------
  // SEARCH USERS
  // ----------------------------------------------------
  const searchUsers = async () => {
    try {
      if (!query.trim() || query.length < 3) return;

      const res = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/users/search?username=${query}`
      );
      const data = await res.json();

      // Kendini çıkar
      const filtered = data.users.filter((u) => u.id !== myUserId);

      setResults(filtered);
    } catch (err) {
      console.log("SEARCH ERROR:", err);
    }
  };

  // ----------------------------------------------------
  // RENDER ITEM
  // ----------------------------------------------------
  const renderUser = ({ item }) => {
    const isInTeam = teamMembers.includes(item.id);

    return (
      <View style={styles.row}>
        <Image
          source={{ uri: item.avatar || "https://i.imgur.com/0y8Ftya.png" }}
          style={styles.avatar}
        />

        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.email}>{item.email}</Text>
        </View>

        {isInTeam ? (
          <View style={styles.inTeamBox}>
            <Text style={styles.inTeamText}>In Team</Text>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => sendInvite(item.id)}
          >
            <Text style={styles.addText}>Invite</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Image source={BackArrow} style={{ width: 28, height: 28 }} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Invite to Team</Text>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Enter username..."
        value={query}
        onChangeText={setQuery}
      />

      <TouchableOpacity style={styles.searchBtn} onPress={searchUsers}>
        <Text style={styles.searchText}>Search</Text>
      </TouchableOpacity>

      {message ? <Text style={styles.message}>{message}</Text> : null}

      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={renderUser}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20, paddingTop: 60 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 25 },
  headerText: { fontSize: 26, fontWeight: "700", textAlign: "center", flex: 1 },
  input: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#F3F3F3",
    marginBottom: 10,
  },
  searchBtn: {
    backgroundColor: "#7CC540",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  searchText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9F9F9",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  avatar: { width: 55, height: 55, borderRadius: 12, marginRight: 15 },
  name: { fontSize: 17, fontWeight: "600" },
  email: { fontSize: 13, color: "#777" },
  addBtn: {
    backgroundColor: "#7CC540",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  addText: { color: "#fff", fontWeight: "700" },

  inTeamBox: {
    backgroundColor: "#ccc",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  inTeamText: {
    color: "#444",
    fontWeight: "700",
  },
});
