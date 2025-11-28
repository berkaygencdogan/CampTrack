import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function AdminReports() {
  const admin = useSelector((state) => state.user.userInfo);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // ---------------------------------------------
  // 🔥 TÜM RAPORLARI GETİR
  // ---------------------------------------------
  const fetchReports = async () => {
    try {
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/admin/reports/getAll?uid=${admin.id}`
      );

      const data = await res.json();

      if (data.success) {
        setReports(data.reports);
      }
    } catch (err) {
      console.log("admin report fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // ---------------------------------------------
  // 🔥 YORUMU SİL
  // ---------------------------------------------
  const deleteComment = (r) => {
    Alert.alert("Yorumu Sil", `Bu yorum tamamen silinsin mi?`, [
      { text: "İptal", style: "cancel" },
      {
        text: "Sil",
        style: "destructive",
        onPress: async () => {
          try {
            const res = await fetch(
              `${process.env.EXPO_PUBLIC_API_URL}/admin/comments/delete?uid=${admin.id}`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  placeId: r.placeId,
                  commentId: r.commentId,
                  reportId: r.reportId,
                }),
              }
            );

            const data = await res.json();

            if (data.success) {
              Alert.alert("Başarılı", "Yorum silindi");
              fetchReports();
            } else {
              Alert.alert("Hata", data.error || "Silinemedi");
            }
          } catch (err) {
            console.log("delete comment error:", err);
          }
        },
      },
    ]);
  };

  // ---------------------------------------------
  // 🔥 RAPORU TEMİZLE
  // ---------------------------------------------
  const clearReport = (r) => {
    Alert.alert("Raporu Temizle", `Bu rapor temizlensin mi?`, [
      { text: "İptal", style: "cancel" },
      {
        text: "Temizle",
        onPress: async () => {
          try {
            const res = await fetch(
              `${process.env.EXPO_PUBLIC_API_URL}/admin/comments/delete?uid=${admin.id}`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ reportId: r.reportId }),
              }
            );

            const data = await res.json();

            if (data.success) {
              Alert.alert("Başarılı", "Rapor temizlendi");
              fetchReports();
            } else {
              Alert.alert("Hata", data.error || "Temizlenemedi");
            }
          } catch (err) {
            console.log("clear report error:", err);
          }
        },
      },
    ]);
  };

  // ---------------------------------------------
  // 🔥 UI — RAPOR CARD
  // ---------------------------------------------

  const renderItem = ({ item }) => {
    const commentText = item.reportedComment || "";

    return (
      <View style={styles.card}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image source={{ uri: item.avatar }} style={styles.avatar} />

          <View style={{ marginLeft: 10 }}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.reason}>Sebep: {item.reason}</Text>
          </View>
        </View>

        <Text style={styles.commentText}>
          Yorum:
          {commentText.length > 120
            ? commentText.slice(0, 120) + "..."
            : commentText}
        </Text>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.clearBtn}
            onPress={() => clearReport(item)}
          >
            <Text style={styles.clearText}>Raporu Kaldır</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={() => deleteComment(item)}
          >
            <Text style={styles.deleteText}>Yorumu Sil</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Yükleniyor...</Text>
      </View>
    );
  }

  if (reports.length === 0) {
    return (
      <View style={styles.center}>
        <Text>Hiç rapor yok 🎉</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Rapor Yönetimi</Text>

      <FlatList
        data={reports}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

/* ----------------------------- STYLES ----------------------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 60,
    paddingHorizontal: 20,
  },

  header: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },

  card: {
    backgroundColor: "#f6f6f6",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },

  avatar: {
    width: 45,
    height: 45,
    borderRadius: 25,
  },

  name: {
    fontSize: 16,
    fontWeight: "700",
  },

  reason: {
    fontSize: 13,
    color: "red",
  },

  commentText: {
    marginTop: 8,
    color: "#333",
  },

  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },

  clearBtn: {
    backgroundColor: "#4caf50",
    padding: 10,
    borderRadius: 10,
  },

  clearText: {
    color: "#fff",
    fontWeight: "700",
  },

  deleteBtn: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 10,
  },

  deleteText: {
    color: "#fff",
    fontWeight: "700",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
