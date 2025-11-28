import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function AdminSidebar({ active, setActive, closeMenu }) {
  return (
    <View style={styles.sidebar}>
      <Text style={styles.title}>Admin Panel</Text>

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

      {/* Menü kapatma */}
      <TouchableOpacity
        style={[styles.item, { marginTop: 30 }]}
        onPress={closeMenu}
      >
        <Text style={[styles.itemText, { color: "red" }]}>Kapat</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    width: 230,
    backgroundColor: "#222",
    height: "100%",
    padding: 20,
  },
  title: { color: "#fff", fontSize: 20, marginBottom: 20, fontWeight: "700" },
  item: { paddingVertical: 10 },
  itemText: { color: "#ddd", fontSize: 16 },
  active: {
    backgroundColor: "#333",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
});
