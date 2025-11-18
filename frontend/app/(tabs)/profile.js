import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { auth } from "../../src/firebase/firebaseConfig";
import { signOut } from "firebase/auth";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";

export default function Profile() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace("/login"); // kullanıcıyı login'e at
    } catch (err) {
      console.log("Logout error:", err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Profile</Text>

      <View style={styles.profileBox}>
        <Image
          source={require("../../src/assets/images/success.png")} // kendi profil resmin olunca değiştireceğiz
          style={styles.avatar}
        />

        <Text style={styles.name}>User Name</Text>
        <Text style={styles.email}>user@example.com</Text>
      </View>

      <TouchableOpacity style={styles.row}>
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
