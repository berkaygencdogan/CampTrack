import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function NotificationButton({ unreadCount = 0, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.wrap}>
      <Ionicons name="notifications" size={30} color="#FACC15" />

      {unreadCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {unreadCount > 9 ? "9+" : unreadCount}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrap: {
    padding: 4,
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#EF4444", // kırmızı
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 1,
    minWidth: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
    textAlign: "center",
  },
});
