import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "expo-router";

export default function NotificationsScreen({ onClose }) {
  const router = useRouter();
  const userId = useSelector((s) => s.user.userId);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    const res = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/teams/requests/${userId}`
    );
    const data = await res.json();
    setRequests(data.requests || []);
  };

  const accept = async (requestId, teamId) => {
    await fetch(`${process.env.EXPO_PUBLIC_API_URL}/teams/requests/accept`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ requestId, teamId, userId }),
    });

    loadNotifications();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Notifications</Text>
      <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
        <Text style={styles.closeText}>Close</Text>
      </TouchableOpacity>
      <FlatList
        data={requests}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.text}>
              <Text style={{ fontWeight: "700" }}>{item.fromName}</Text> invited
              you to join
              <Text style={{ fontWeight: "700" }}> {item.teamName}</Text>
            </Text>

            <TouchableOpacity
              style={styles.accept}
              onPress={() => accept(item.id, item.teamId)}
            >
              <Text style={{ color: "#fff", fontWeight: "700" }}>Accept</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 60, backgroundColor: "#fff" },
  header: { fontSize: 28, fontWeight: "700", marginBottom: 20 },
  card: {
    padding: 15,
    backgroundColor: "#F3F3F3",
    borderRadius: 10,
    marginBottom: 12,
  },
  text: { fontSize: 16, marginBottom: 10 },
  accept: {
    backgroundColor: "#7CC540",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
});
