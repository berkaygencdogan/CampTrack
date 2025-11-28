import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import BackArrow from "../../src/assets/images/arrow-left.png";

export default function TeamDetail() {
  const router = useRouter();
  const { teamId } = useLocalSearchParams();

  const [team, setTeam] = useState(null);
  const [members, setMembers] = useState([]);

  useEffect(() => {
    loadTeam();
    loadMembers();
  }, [teamId]);

  // Takım bilgilerini çek
  const loadTeam = async () => {
    try {
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/teams/${teamId}`
      );

      const data = await res.json();
      setTeam(data.team || null);
    } catch (err) {
      console.log("TEAM DETAIL ERROR:", err);
    }
  };

  // Üyeleri çek
  const loadMembers = async () => {
    try {
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/teams/${teamId}/members`
      );

      const data = await res.json();
      setMembers(data.members || []);
    } catch (err) {
      console.log("TEAM MEMBERS ERROR:", err);
    }
  };

  const renderMember = ({ item }) => (
    <View style={styles.row}>
      <Image
        source={{
          uri: item.avatar || "https://i.imgur.com/0y8Ftya.png",
        }}
        style={styles.avatar}
      />

      <View>
        <Text style={styles.name}>{item.name || "Unknown"}</Text>
        <Text style={styles.email}>{item.email}</Text>
      </View>
    </View>
  );

  if (!team)
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Image source={BackArrow} style={{ fontSize: 24 }}></Image>
        </TouchableOpacity>
        <Text style={styles.headerText}>{team.teamName}</Text>

        <TouchableOpacity
          onPress={() => router.push(`/teams/invite?teamId=${teamId}`)}
          style={styles.inviteBtn}
        >
          <Text style={styles.inviteText}>Davet Et</Text>
        </TouchableOpacity>
      </View>

      {/* MEMBER LIST */}
      <FlatList
        data={members}
        keyExtractor={(item) => item.id}
        renderItem={renderMember}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </View>
  );
}

/* =============== STYLES =============== */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 60,
    paddingHorizontal: 20,
  },

  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },

  headerText: { fontSize: 26, fontWeight: "700", textAlign: "center", flex: 1 },

  inviteBtn: {
    backgroundColor: "#7CC540",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },

  inviteText: { color: "#fff", fontSize: 16, fontWeight: "600" },

  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
  },

  avatar: { width: 55, height: 55, borderRadius: 10, marginRight: 12 },

  name: { fontSize: 17, fontWeight: "600" },
  email: { fontSize: 13, color: "#777" },
});
