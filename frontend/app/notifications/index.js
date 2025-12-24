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
import { useRouter } from "expo-router";
import { setNotificationCount } from "../../redux/userSlice";
import { useDispatch, useSelector } from "react-redux";

export default function NotificationsScreen({ onClose, data }) {
  const [list, setList] = useState([]);
  const myUser = useSelector((state) => state.user.userInfo);
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    setList(data);
  }, [data]);

  // 🔥 Daveti kabul et
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
    if (json.success) {
      setList((prev) => prev.filter((n) => n.id !== notifId));
    }
  };

  const deleteNotification = async (notifId) => {
    await fetch(`${process.env.EXPO_PUBLIC_API_URL}/notifications/delete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notifId }),
    });

    setList((prev) => prev.filter((n) => n.id !== notifId));

    // 🔥 GERÇEK SAYIYI TEKRAR ÇEK — doğru userId ile
    const res = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/notifications/${myUser.id}`
    );

    const json = await res.json();

    dispatch(setNotificationCount(json.notifications.length));
  };

  // 🔥 COMMENT → POST DETAYA GİT
  const handlePress = (item) => {
    if (item.type === "comment") {
      if (item.postOwnerId != null && item.postIndex != null) {
        router.push({
          pathname: "/post/[userId]/[postIndex]",
          params: {
            userId: item.postOwnerId.toString(),
            postIndex: item.postIndex.toString(),
            highlight: item?.commentId?.toString(),
          },
        });
        onClose();
      }
      return;
    }
  };

  // 🔥 TEK BİLDİRİM KARTI
  const renderItem = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => handlePress(item)}
      style={styles.card}
    >
      {/* HEADER */}
      <View style={styles.headerRow}>
        <Image
          style={styles.avatar}
          source={{
            uri:
              item.fromAvatar && item.fromAvatar.trim() !== ""
                ? item.fromAvatar
                : `https://ui-avatars.com/api/?name=${item.fromName || "User"}`,
          }}
        />
        <Text style={styles.fromName}>{item.fromName}</Text>
      </View>

      {/* MESSAGE */}
      <Text style={styles.message}>
        {item.type === "comment" && item.text}
        {item.type === "team_invite" &&
          `${item.fromName}, seni "${item.teamName}" takımına davet etti.`}
        {item.type === "team_invite_accept" &&
          `${item.fromName}, "${item.teamName}" davetini kabul etti! 🎉`}
        {item.type === "team_invite_reject" &&
          `${item.fromName}, "${item.teamName}" davetini reddetti.`}
      </Text>

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

      {item.type !== "team_invite" && (
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => deleteNotification(item.id)}
        >
          <Text style={styles.deleteText}>Bildirimi Sil</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );

  return (
    <Modal transparent animationType="slide">
      <View style={styles.modalBg}>
        <View style={styles.modalBox}>
          <Text style={styles.header}>Bildirimler</Text>

          <FlatList
            data={list}
            keyExtractor={(item, index) =>
              item.id ? item.id.toString() : index.toString()
            }
            renderItem={renderItem}
          />

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
  message: {
    fontSize: 14,
    color: "#555",
    marginBottom: 14,
  },
  btnRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 10,
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
