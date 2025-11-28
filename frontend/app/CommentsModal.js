import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
} from "react-native";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

export default function CommentsModal({ visible, onClose, placeId }) {
  const user = useSelector((state) => state.user.userInfo);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [expanded, setExpanded] = useState({});

  const [optionsVisible, setOptionsVisible] = useState(false);
  const [reasonVisible, setReasonVisible] = useState(false);

  const [selectedComment, setSelectedComment] = useState(null);

  // ------------------------------------------
  // 🔥 YORUMLARI ÇEK
  // ------------------------------------------
  const fetchComments = async () => {
    try {
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/comments/${placeId}`
      );
      const data = await res.json();

      if (data.success) setComments(data.comments);
    } catch (err) {
      console.log("fetch comments error:", err);
    }
  };

  useEffect(() => {
    if (visible) fetchComments();
  }, [visible]);

  // ------------------------------------------
  // 🔥 YORUM GÖNDER
  // ------------------------------------------
  const sendComment = async () => {
    if (!newComment.trim()) return;

    try {
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/comments/add`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            placeId,
            userId: user.id,
            comment: newComment,
            name: user.name,
            avatar: user.image,
          }),
        }
      );

      const data = await res.json();

      if (data.success) {
        setComments([data.comment, ...comments]); // en üste ekle
        setNewComment("");
      }
    } catch (err) {
      console.log("add comment error:", err);
    }
  };

  // ------------------------------------------
  // 🔥 YORUM GENİŞLET / KISALT
  // ------------------------------------------
  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // ------------------------------------------
  // 🔥 OPTIONS MENÜSÜ
  // ------------------------------------------
  const openOptions = (comment) => {
    console.log("object", comment);
    setSelectedComment({
      ...comment,
      commentId: comment.id, // ← direkt ekliyoruz
    });

    setOptionsVisible(true);
  };

  // ------------------------------------------
  // 🔥 RAPOR GÖNDER
  // ------------------------------------------
  const sendReport = async (reason) => {
    try {
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/comments/report`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            placeId,
            commentId: selectedComment.commentId,
            userId: user.id,
            reporterName: user.name,
            commentOwnerId: selectedComment.userId,
            commentOwnerName: selectedComment.name,
            commentText: selectedComment.comment,
            reason,
          }),
        }
      );

      // 🔥 BURASI OLAYI ÇÖZÜYOR
      const text = await res.text();
      console.log("SERVER RAW RESPONSE:", text);

      // JSON parse etmeyi sadece JSON ise yap
      if (!res.headers.get("content-type")?.includes("application/json")) {
        throw new Error("Server JSON yerine HTML döndürüyor!");
      }

      const data = JSON.parse(text);

      if (data.success) {
        alert("Rapor gönderildi!");
        setReasonVisible(false);
        setOptionsVisible(false);
      } else {
        alert(data.error || "Rapor gönderilemedi");
      }
    } catch (err) {
      console.log("report error:", err);
    }
  };
  // ------------------------------------------
  // 🔥 UI
  // ------------------------------------------
  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        {/* X BUTONU */}
        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
          <Text style={styles.closeText}>Kapat</Text>
        </TouchableOpacity>

        {/* YORUM YAZMA ALANI */}
        <TextInput
          value={newComment}
          onChangeText={setNewComment}
          placeholder="Yorum yaz..."
          style={styles.input}
        />

        <TouchableOpacity style={styles.sendBtn} onPress={sendComment}>
          <Text style={styles.sendText}>Gönder</Text>
        </TouchableOpacity>

        {/* YORUM LİSTESİ */}
        <FlatList
          data={comments}
          keyExtractor={(item, index) =>
            item.id?.toString() || index.toString()
          }
          renderItem={({ item }) => {
            const content = item.text || item.comment || ""; // 🔥 güvenli çözüm

            const isLong = content.length > 130;
            const isOpen = expanded[item.id];

            return (
              <View style={styles.commentRow}>
                <Image source={{ uri: item.avatar }} style={styles.avatar} />

                <View style={{ flex: 1 }}>
                  <Text style={styles.name}>{item.name}</Text>

                  <Text style={styles.text}>
                    {isOpen || !isLong
                      ? content
                      : content.slice(0, 130) + "..."}
                  </Text>

                  {isLong && (
                    <TouchableOpacity onPress={() => toggleExpand(item.id)}>
                      <Text style={styles.more}>
                        {isOpen ? "Kısalt" : "Devamı..."}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>

                <TouchableOpacity
                  style={styles.optBtn}
                  onPress={() => openOptions(item)}
                >
                  <Text style={styles.optText}>⋮</Text>
                </TouchableOpacity>
              </View>
            );
          }}
        />
      </View>

      {/* ----------------------------------- */}
      {/* OPTIONS MODAL */}
      {/* ----------------------------------- */}
      <Modal visible={optionsVisible} transparent animationType="fade">
        <View style={styles.optOverlay}>
          <View style={styles.optBox}>
            <TouchableOpacity
              onPress={() => {
                setOptionsVisible(false);
                setReasonVisible(true);
              }}
            >
              <Text style={styles.optItem}>Yorumu Rapor Et</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setOptionsVisible(false)}>
              <Text style={[styles.optItem, { color: "red" }]}>İptal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ----------------------------------- */}
      {/* RAPOR SEBEBİ MODAL */}
      {/* ----------------------------------- */}
      <Modal visible={reasonVisible} transparent animationType="fade">
        <View style={styles.optOverlay}>
          <View style={styles.reasonBox}>
            <Text style={styles.reasonTitle}>
              Bu yorumu neden raporluyorsun?
            </Text>

            {["Spam", "Hakaret", "Uygunsuz içerik", "Reklam"].map((reason) => (
              <TouchableOpacity
                key={reason}
                style={styles.reasonItem}
                onPress={() => sendReport(reason)}
              >
                <Text style={styles.reasonText}>{reason}</Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity onPress={() => setReasonVisible(false)}>
              <Text style={[styles.optItem, { color: "red", marginTop: 10 }]}>
                Vazgeç
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  closeBtn: { alignSelf: "flex-end" },
  closeText: { color: "red", fontSize: 16 },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    marginTop: 10,
  },

  sendBtn: {
    backgroundColor: "#7CC540",
    padding: 12,
    borderRadius: 10,
    marginVertical: 15,
  },
  sendText: { color: "#fff", fontSize: 16, textAlign: "center" },

  commentRow: {
    flexDirection: "row",
    marginBottom: 20,
    alignItems: "flex-start",
  },
  avatar: { width: 40, height: 40, borderRadius: 50, marginRight: 10 },
  name: { fontWeight: "bold", marginBottom: 3 },
  text: { color: "#444" },
  more: { color: "#7CC540", marginTop: 4 },

  optBtn: { paddingHorizontal: 6, paddingVertical: 2 },
  optText: { fontSize: 22, color: "#888" },

  optOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  optBox: {
    width: "75%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
  },
  optItem: {
    fontSize: 17,
    paddingVertical: 12,
  },

  reasonBox: {
    width: "75%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
  },
  reasonTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 15 },

  reasonItem: { paddingVertical: 10 },
  reasonText: { fontSize: 16 },
});
