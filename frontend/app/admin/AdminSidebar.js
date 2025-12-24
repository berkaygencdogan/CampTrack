import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";

export default function AdminSidebar({ active, setActive, closeMenu }) {
  const router = useRouter();

  return (
    <View style={styles.sidebar}>
      <View
        style={{
          width: "100%",
          flexDirection: "row",
        }}
      >
        <TouchableOpacity style={styles.backBtn} onPress={closeMenu}>
          <MaterialIcons name="arrow-back-ios" size={22} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.title}>Admin Panel</Text>
      </View>
      <TouchableOpacity
        style={[styles.item, active === "dashboard" && styles.active]}
        onPress={() => {
          setActive("dashboard");
          closeMenu();
        }}
      >
        <Text style={styles.itemText}>Dashboard</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.item, active === "users" && styles.active]}
        onPress={() => {
          setActive("users");
          closeMenu();
        }}
      >
        <Text style={styles.itemText}>Users</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.item, active === "reports" && styles.active]}
        onPress={() => {
          setActive("reports");
          closeMenu();
        }}
      >
        <Text style={styles.itemText}>Reports</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.item, active === "places" && styles.active]}
        onPress={() => {
          setActive("places");
          closeMenu();
        }}
      >
        <Text style={styles.itemText}>Places</Text>
      </TouchableOpacity>

      {/* Panelden çık */}
      <TouchableOpacity
        style={styles.exitBtn}
        onPress={() => {
          closeMenu();
          router.push({
            pathname: "/(tabs)/profile",
          });
        }}
      >
        <MaterialIcons name="logout" size={20} color="#ff5555" />
        <Text style={styles.exitText}>Panelden Çık</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    width: 230,
    backgroundColor: "#222",
    height: "100%",
    paddingTop: 55,
    paddingHorizontal: 20,
  },
  backBtn: {
    fontSize: 15,
  },
  title: {
    color: "#fff",
    fontSize: 20,
    marginBottom: 20,
    fontWeight: "700",
  },
  item: { paddingVertical: 10, paddingLeft: 5 },
  itemText: { color: "#ddd", fontSize: 16 },
  active: {
    backgroundColor: "#333",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  exitBtn: {
    marginTop: 40,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  exitText: {
    color: "#ff5555",
    fontSize: 16,
    marginLeft: 10,
    fontWeight: "600",
  },
});
