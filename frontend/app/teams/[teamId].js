import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Ionicons from "@expo/vector-icons/Ionicons";
import BackArrow from "../../src/assets/images/arrow-left.png";

export default function TeamDetail() {
  const router = useRouter();
  const { teamId } = useLocalSearchParams();
  const myUserId = useSelector((state) => state.user.userInfo.id);

  const [team, setTeam] = useState(null);
  const [members, setMembers] = useState([]);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    loadTeam();
    loadMembers();
  }, [teamId]);

  // ---------------------------------
  // TEAM DATA
  // ---------------------------------
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

  const loadMembers = async () => {
    try {
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/teams/${teamId}/members`
      );
      const data = await res.json();
      setMembers(data.members || []);

      // OWNER CHECK
      if (data.members?.length > 0) {
        setIsOwner(data.members[0].id === myUserId);
      }
    } catch (err) {
      console.log("TEAM MEMBERS ERROR:", err);
    }
  };

  // ---------------------------------
  // REMOVE MEMBER (Artık TeamDetail'de)
  // ---------------------------------
  const removeMember = async (memberId) => {
    Alert.alert("Remove Member", "Are you sure?", [
      { text: "Cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: async () => {
          try {
            await fetch(
              `${process.env.EXPO_PUBLIC_API_URL}/teams/remove-member`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  teamId,
                  userId: memberId,
                }),
              }
            );

            setMembers(members.filter((m) => m.id !== memberId));
          } catch (err) {
            console.log("REMOVE MEMBER ERROR:", err);
          }
        },
      },
    ]);
  };

  // ---------------------------------
  // RENDER MEMBER ROW
  // ---------------------------------
  const renderMember = ({ item }) => (
    <View style={styles.row}>
      <Image
        source={{ uri: item.avatar || "https://i.imgur.com/0y8Ftya.png" }}
        style={styles.avatar}
      />

      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.name || "Unknown"}</Text>
        <Text style={styles.email}>{item.email}</Text>
      </View>

      {/* REMOVE SADECE OWNER'DA */}
      {isOwner && item.id !== members[0].id && (
        <TouchableOpacity
          onPress={() => removeMember(item.id)}
          style={styles.removeBtn}
        >
          <Text style={styles.removeText}>Remove</Text>
        </TouchableOpacity>
      )}
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
          <Image source={BackArrow} style={{ width: 26, height: 26 }} />
        </TouchableOpacity>

        <Text style={styles.headerText}>{team.teamName}</Text>

        {/* EDIT - SADECE OWNER */}
        {isOwner ? (
          <TouchableOpacity
            onPress={() => {
              if (!teamId) return;

              router.push({
                pathname: "/teams/edit",
                params: { teamId: teamId.toString() },
              });
            }}
            style={styles.editBtn}
          >
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 60 }} /> // boşluk doldursun
        )}
      </View>

      {/* MEMBER LIST */}
      <FlatList
        data={members}
        keyExtractor={(item) => item.id}
        renderItem={renderMember}
        contentContainerStyle={{ paddingBottom: 120 }}
      />

      {/* INVITE BUTTON (+) - HERKESTE GÖRÜNÜR */}
      <TouchableOpacity
        style={styles.inviteFab}
        onPress={() => {
          if (!teamId) return;

          router.push({
            pathname: "/teams/invite",
            params: { teamId: teamId.toString() },
          });
        }}
      >
        <Ionicons name="add" size={34} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

/* ======== STYLES ========= */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 60,
    paddingHorizontal: 20,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },

  headerText: {
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    flex: 1,
  },

  editBtn: {
    backgroundColor: "#7CC540",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  editText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },

  inviteFab: {
    position: "absolute",
    bottom: 80,
    right: 40,
    width: 65,
    height: 65,
    backgroundColor: "#7CC540",
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
  },

  avatar: {
    width: 55,
    height: 55,
    borderRadius: 10,
    marginRight: 12,
  },

  name: { fontSize: 17, fontWeight: "600" },
  email: { fontSize: 13, color: "#777" },

  removeBtn: {
    backgroundColor: "#FF5757",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  removeText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});
