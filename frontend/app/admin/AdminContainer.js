import { useState } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import AdminSidebar from "./AdminSidebar";

export default function AdminContainer({ children, active, setActive }) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => setShowMenu(true)}
      >
        <Ionicons name="menu" size={28} color="#000" />
      </TouchableOpacity>

      {showMenu && (
        <View style={styles.sidebarWrapper}>
          <AdminSidebar
            active={active}
            setActive={setActive}
            closeMenu={() => setShowMenu(false)}
          />
        </View>
      )}

      <View style={{ flex: 1, backgroundColor: "#fff" }}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  menuButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 100,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    elevation: 5,
  },
  sidebarWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 230,
    height: "100%",
    backgroundColor: "#222",
    zIndex: 200,
    elevation: 10,
  },
});
