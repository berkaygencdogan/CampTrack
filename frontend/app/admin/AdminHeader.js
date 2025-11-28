import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useSelector } from "react-redux";

export default function AdminHeader({ openMenu }) {
  const user = useSelector((state) => state.user.userInfo);

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={openMenu}>
        <Ionicons name="menu" size={28} color="#fff" />
      </TouchableOpacity>

      <Text style={styles.title}>Admin Panel</Text>

      <Text style={styles.user}>{user?.name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 55,
    backgroundColor: "#111",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    justifyContent: "space-between",
  },
  title: { color: "#fff", fontSize: 18, fontWeight: "700" },
  user: { color: "#7CC540", fontSize: 16 },
});
