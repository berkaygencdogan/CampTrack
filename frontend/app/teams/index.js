import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
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

  // ========= TEAM CARD =========
  const renderTeam = ({ item }) => {
    const members = item.members || [];
    const avatarsToShow = members.slice(0, 5); // max 5 kişinin resmi

    return (
      <TouchableOpacity
        style={styles.teamCard}
        onPress={() => router.push(`/teams/${item.id}`)}
      >
        {/* SOL LOGO */}
        <Image
          source={{
            uri: item.logo || "https://via.placeholder.com/100",
          }}
          style={styles.logo}
        />

        {/* SAĞ BİLGİLER */}
        <View style={{ flex: 1, marginLeft: 12 }}>
          {/* Takım adı */}
          <Text style={styles.teamName}>{item.teamName}</Text>

          {/* Üye avatarları */}
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

            {/* Fazla kişi varsa ... */}
            {members.length > 5 && (
              <Text style={styles.moreText}>+{members.length - 5}</Text>
            )}
          </View>

          {/* Sağ altta kişi sayısı */}
          <Text style={styles.memberCount}>{members.length} members</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Teams</Text>

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

      {/* ADD TEAM BUTTON */}
      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => router.push("/teams/create")}
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
  },

  teamCard: {
    flexDirection: "row",
    backgroundColor: "#F6F6F6",
    padding: 12,
    borderRadius: 12,
    marginBottom: 15,
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

  memberCount: {
    fontSize: 13,
    color: "#777",
    marginTop: 8,
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
