import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSelector } from "react-redux";
import NoTeams from "./no-teams";
import { useFocusEffect } from "@react-navigation/native";

export default function TeamsIndex() {
  const router = useRouter();
  const [teams, setTeams] = useState([]);
  const userId = useSelector((state) => state.user.userInfo.id);

  useFocusEffect(
    React.useCallback(() => {
      loadMyTeams();
    }, [])
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

  // Tek bir takım kartı
  const renderTeam = ({ item }) => (
    <TouchableOpacity
      style={styles.teamCard}
      onPress={() => router.push(`/teams/${item.id}`)}
    >
      <Text style={styles.teamName}>{item.name}</Text>
      <Text style={styles.memberCount}>{item.members.length || 1} members</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <Text style={styles.header}>My Teams</Text>

      {teams && (
        <FlatList
          data={teams}
          keyExtractor={(item) => item.id}
          renderItem={renderTeam}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}
      {!teams && <NoTeams />}

      {/* ADD TEAM BUTTON */}
      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => router.push("/teams/add")}
      >
        <Text style={styles.plus}>+</Text>
      </TouchableOpacity>
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

  header: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
    flex: 0.1,
  },

  teamCard: {
    backgroundColor: "#F3F3F3",
    padding: 18,
    borderRadius: 14,
    marginBottom: 15,
  },

  teamName: {
    fontSize: 18,
    fontWeight: "700",
  },

  memberCount: {
    fontSize: 14,
    color: "#888",
    marginTop: 4,
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
