import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from "react-native";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function NotificationsScreen({ onClose }) {
  const userId = useSelector((state) => state.user.id);
  const [requests, setRequests] = useState([]);

  const loadRequests = async () => {
    try {
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/teams/requests?userId=${userId}`
      );
      const data = await res.json();
      setRequests(data.requests || []);
    } catch (err) {
      console.log("LOAD_REQUESTS_ERROR:", err);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const acceptRequest = async (requestId) => {
    const res = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/teams/request/accept`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId }),
      }
    );

    const data = await res.json();
    if (data.success) loadRequests();
  };

  const rejectRequest = async (requestId) => {
    const res = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/teams/request/reject`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId }),
      }
    );

    const data = await res.json();
    if (data.success) loadRequests();
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>
        {item.fromName} invited you to **{item.teamName}**
      </Text>

      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.btn, styles.accept]}
          onPress={() => acceptRequest(item.id)}
        >
          <Text style={styles.btnText}>Accept</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, styles.reject]}
          onPress={() => rejectRequest(item.id)}
        >
          <Text style={styles.btnText}>Reject</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <Modal transparent animationType="slide">
      <View style={styles.modalBg}>
        <View style={styles.modalBox}>
          <Text style={styles.header}>Notifications</Text>

          <FlatList
            data={requests}
            keyExtractor={(i) => i.id}
            renderItem={renderItem}
          />

          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBg: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalBox: {
    flex: 0.8,
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  header: { fontSize: 22, fontWeight: "700", marginBottom: 20 },
  card: {
    backgroundColor: "#F7F7F7",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  title: { fontSize: 16, fontWeight: "600", marginBottom: 10 },
  row: { flexDirection: "row", gap: 10 },
  btn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  accept: { backgroundColor: "#7CC540" },
  reject: { backgroundColor: "#FF5C5C" },
  btnText: {
    color: "#fff",
    fontWeight: "700",
  },
  closeBtn: {
    marginTop: 20,
    paddingVertical: 12,
    backgroundColor: "#ccc",
    borderRadius: 10,
  },
  closeText: { textAlign: "center", fontWeight: "700" },
});
