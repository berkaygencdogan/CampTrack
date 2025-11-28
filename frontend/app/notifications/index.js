import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Image,
} from "react-native";
import { useEffect, useState } from "react";

export default function NotificationsScreen({ onClose, data }) {
  const [list, setList] = useState([]);

  useEffect(() => {
    setList(data);
  }, [data]);

  const acceptRequest = async (notifId, userId) => {
    const res = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/notifications/accept`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notifId, userId }),
      }
    );

    const json = await res.json();
    if (json.success) setList((prev) => prev.filter((n) => n.id !== notifId));
  };

  const deleteNotification = async (notifId) => {
    const res = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/notifications/reject`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notifId }),
      }
    );

    const json = await res.json();
    if (json.success) setList((prev) => prev.filter((n) => n.id !== notifId));
  };

  // 🔥 TÜM DAVET DIŞI BİLDİRİMLERİ SİL
  const deleteAllNonInvite = async () => {
    const nonInvite = list.filter((item) => item.type !== "team_invite");

    for (let item of nonInvite) {
      await deleteNotification(item.id);
    }
  };

  // ------------------------------------------
  // RENDER NOTIFICATION
  // ------------------------------------------
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        {/* Avatar */}
        <Image
          source={{
            uri: item.fromAvatar || "https://i.imgur.com/0y8Ftya.png",
          }}
          style={styles.avatar}
        />

        <Text style={styles.fromName}>{item.fromName}</Text>

        {/* Takım Logosu */}
        {item.teamLogo ? (
          <Image source={{ uri: item.teamLogo }} style={styles.teamLogo} />
        ) : null}
      </View>

      {/* Mesaj */}
      <Text style={styles.message}>
        {item.type === "team_invite" &&
          `${item.fromName}, seni "${item.teamName}" takımına davet etti.`}

        {item.type === "team_invite_accept" &&
          `${item.fromName}, "${item.teamName}" davetini kabul etti! 🎉`}

        {item.type === "team_invite_reject" &&
          `${item.fromName}, "${item.teamName}" davetini reddetti.`}
      </Text>

      {/* Eğer davet ise -> Kabul / Reddet butonları */}
      {item.type === "team_invite" && (
        <View style={styles.btnRow}>
          <TouchableOpacity
            style={[styles.btn, styles.accept]}
            onPress={() => acceptRequest(item.id, item.toUserId)}
          >
            <Text style={styles.btnText}>Kabul Et</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btn, styles.reject]}
            onPress={() => deleteNotification(item.id)}
          >
            <Text style={styles.btnText}>Reddet</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Eğer davet değilse -> Bildirim Sil */}
      {item.type !== "team_invite" && (
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => deleteNotification(item.id)}
        >
          <Text style={styles.deleteText}>Bildirimi Sil</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <Modal transparent animationType="slide">
      <View style={styles.modalBg}>
        <View style={styles.modalBox}>
          <Text style={styles.header}>Bildirimler</Text>

          <FlatList
            data={list}
            keyExtractor={(i) => i.id.toString()}
            renderItem={renderItem}
          />

          {/* 🔥 TÜM DAVET DIŞI BİLDİRİMLERİ SİL */}
          <TouchableOpacity
            style={styles.deleteAllBtn}
            onPress={deleteAllNonInvite}
          >
            <Text style={styles.deleteAllText}>Tüm Bildirimleri Sil</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeText}>Kapat</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

/* STYLES */
const styles = StyleSheet.create({
  modalBg: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  modalBox: {
    flex: 0.85,
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
  },
  header: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#F7F7F7",
    padding: 14,
    borderRadius: 12,
    marginBottom: 14,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 30,
  },
  fromName: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    fontWeight: "700",
    color: "#333",
  },
  teamLogo: {
    width: 34,
    height: 34,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  message: {
    fontSize: 14,
    color: "#555",
    marginBottom: 14,
  },
  btnRow: {
    flexDirection: "row",
    gap: 10,
  },
  btn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  accept: { backgroundColor: "#7CC540" },
  reject: { backgroundColor: "#FF4F4F" },
  btnText: {
    color: "#fff",
    fontWeight: "700",
  },
  deleteBtn: {
    marginTop: 10,
    backgroundColor: "#eee",
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  deleteText: {
    color: "#444",
    fontSize: 14,
    fontWeight: "600",
  },

  // 🔥 TÜM BİLDİRİMLERİ SİL BUTONU
  deleteAllBtn: {
    marginTop: 10,
    paddingVertical: 14,
    backgroundColor: "#ffbbbb",
    borderRadius: 12,
  },
  deleteAllText: {
    textAlign: "center",
    color: "#900",
    fontSize: 15,
    fontWeight: "700",
  },

  closeBtn: {
    marginTop: 20,
    paddingVertical: 12,
    backgroundColor: "#ccc",
    borderRadius: 12,
  },
  closeText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "700",
  },
});
