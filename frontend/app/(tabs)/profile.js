import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function Profile() {
  const router = useRouter();

  // REDUX USER → DOĞRU!
  const user = useSelector((state) => state.user);

  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (!user.isLoggedIn) {
      router.replace("/login");
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        const data = await res.json();
        setUserData(data.user);
      } catch (err) {
        console.log("Profile fetch error:", err);
        router.replace("/login");
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    router.replace("/login");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Profile</Text>

      <View style={styles.profileBox}>
        <Image
          source={{
            uri: userData?.avatar || "https://i.imgur.com/0y8Ftya.png",
          }}
          style={styles.avatar}
        />

        <Text style={styles.name}>{userData?.name || "Loading..."}</Text>
        <Text style={styles.email}>{userData?.email || ""}</Text>
      </View>

      <TouchableOpacity
        style={styles.row}
        onPress={() => router.push("/favorites")}
      >
        <Ionicons name="heart-outline" size={22} color="#7CC540" />
        <Text style={styles.rowText}>Favorites</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.row}>
        <Ionicons name="map-outline" size={22} color="#7CC540" />
        <Text style={styles.rowText}>My Added Places</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
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
    fontSize: 26,
    fontWeight: "bold",
  },

  profileBox: {
    alignItems: "center",
    marginTop: 25,
  },

  avatar: {
    width: 100,
    height: 100,
    borderRadius: 60,
    marginBottom: 10,
  },

  name: {
    fontSize: 20,
    fontWeight: "600",
  },

  email: {
    fontSize: 14,
    color: "#777",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
    marginTop: 20,
  },

  rowText: {
    fontSize: 16,
    marginLeft: 15,
    color: "#444",
  },

  logoutBtn: {
    marginTop: 40,
    backgroundColor: "#7CC540",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
