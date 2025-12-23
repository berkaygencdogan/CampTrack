import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSelector } from "react-redux";
import NoTeams from "./no-teams";
import { useFocusEffect } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function TeamsIndex() {
  const router = useRouter();
  const [teams, setTeams] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const user = useSelector((state) => state.user.userInfo);
  const userId = user?.id;

  useFocusEffect(
    React.useCallback(() => {
      if (!userId) return;
      loadMyTeams();
    }, [userId])
  );

  const loadMyTeams = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const res = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/teams/my/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();
      setTeams(data.teams || []);
    } catch (err) {
      console.log("TEAMS MY ERROR:", err);
    }
  };

  // ===================================
  // DELETE TEAM
  // ===================================
  const deleteTeam = async (teamId) => {
    Alert.alert("Delete Team", "Are you sure you want to delete this team?", [
      { text: "Cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            const token = await AsyncStorage.getItem("token");

            const res = await fetch(
              `${process.env.EXPO_PUBLIC_API_URL}/teams/delete`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ teamId, userId }),
              }
            );

            const data = await res.json();
            if (data.success) {
              setTeams((prev) => prev.filter((t) => t.id !== teamId));
              setEditMode(false);
            }
          } catch (err) {
            console.log("DELETE_TEAM_ERROR:", err);
          }
        },
      },
    ]);
  };

  // ========= TEAM CARD =========
  const renderTeam = ({ item }) => {
    const members = item.members || [];
    const avatarsToShow = members.slice(0, 5);

    return (
      <TouchableOpacity
        style={styles.teamCard}
        onPress={() => {
          if (!editMode) router.push(`/teams/${item.id}`);
        }}
        activeOpacity={editMode ? 1 : 0.7}
      >
        {/* SOL LOGO */}
        <Image
          source={{
            uri: `${item.logo}?t=${Date.now()}`,
          }}
          style={styles.logo}
        />

        {/* SAĞ BİLGİLER */}
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.teamName}>{item.teamName}</Text>

          <View style={styles.avatarRow}>
            {avatarsToShow.map((uid) => (
              <Image
                key={uid}
                source={{
                  uri:
                    item.userMap?.[uid]?.avatar ||
                    `https://ui-avatars.com/api/?name=${
                      item.userMap?.[uid]?.name || "U"
                    }`,
                }}
                style={styles.avatar}
              />
            ))}

            {members.length > 5 && (
              <Text style={styles.moreText}>+{members.length - 5}</Text>
            )}
          </View>

          <Text style={styles.memberCount}>{members.length} members</Text>
        </View>

        {/* DELETE ICON (only in edit mode) */}
        {editMode && (
          <TouchableOpacity
            style={styles.deleteIcon}
            onPress={() => deleteTeam(item.id)}
          >
            <Ionicons name="trash" size={26} color="#FF4444" />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* HEADER + EDIT BUTTON */}
      <View style={styles.headerRow}>
        <Text style={styles.header}>My Teams</Text>

        <TouchableOpacity
          onPress={() => setEditMode(!editMode)}
          style={styles.editBtn}
        >
          <Text style={styles.editText}>{editMode ? "Done" : "Edit"}</Text>
        </TouchableOpacity>
      </View>

      {teams.length > 0 ? (
        <FlatList
          data={teams}
          keyExtractor={(item) => item.id}
          renderItem={renderTeam}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      ) : (
        <NoTeams />
      )}

      {!editMode && (
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => {
            if (!userId) {
              return;
            }
            router.push("/teams/create");
          }}
        >
          <Text style={styles.plus}>+</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

/* ====================== STYLES ====================== */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 60,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  header: {
    fontSize: 28,
    fontWeight: "700",
  },

  editBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: "#7CC540",
    borderRadius: 8,
  },
  editText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },

  teamCard: {
    flexDirection: "row",
    backgroundColor: "#F6F6F6",
    padding: 12,
    borderRadius: 12,
    marginBottom: 15,
    alignItems: "center",
  },

  logo: {
    width: 75,
    height: 75,
    borderRadius: 12,
  },

  teamName: {
    fontSize: 18,
    fontWeight: "700",
  },

  avatarRow: {
    flexDirection: "row",
    marginTop: 6,
    alignItems: "center",
  },

  avatar: {
    width: 28,
    height: 28,
    borderRadius: 40,
    marginRight: 5,
  },

  moreText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#555",
    marginLeft: 4,
  },

  memberCount: {
    fontSize: 13,
    color: "#777",
    marginTop: 8,
  },

  deleteIcon: {
    padding: 6,
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
    fontSize: 32,
    color: "#fff",
    fontWeight: "900",
    marginTop: -4,
  },
});
