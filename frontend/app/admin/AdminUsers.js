import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  TextInput,
} from "react-native";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function AdminUsers() {
  const admin = useSelector((state) => state.user.userInfo);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [banHours, setBanHours] = useState(""); // X saat ban süresi

  // ------------------------------------------------
  // 🔥 KULLANICILARI GETİR
  // ------------------------------------------------
  const fetchUsers = async () => {
    try {
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/admin/users/getAll?uid=${admin.id}`
      );

      const data = await res.json();

      if (data.success) setUsers(data.users);
    } catch (err) {
      console.log("admin fetch users error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ------------------------------------------------
  // 🔥 KULLANICI SİL
  // ------------------------------------------------
  const deleteUser = (user) => {
    Alert.alert("Kullanıcıyı Sil", `${user.name} tamamen silinsin mi?`, [
      { text: "İptal", style: "cancel" },
      {
        text: "Sil",
        style: "destructive",
        onPress: async () => {
          try {
            const res = await fetch(
              `${process.env.EXPO_PUBLIC_API_URL}/admin/users/delete`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: user.id }),
              }
            );

            const data = await res.json();

            if (data.success) {
              Alert.alert("Başarılı", "Kullanıcı silindi");
              fetchUsers();
            } else {
              Alert.alert("Hata", data.error || "Silinemedi");
            }
          } catch (err) {
            console.log("delete user error:", err);
          }
        },
      },
    ]);
  };

  // ------------------------------------------------
  // 🔥 KULLANICIYI BANLAMA
  // ------------------------------------------------
  const banUser = (user) => {
    if (!banHours.trim()) {
      Alert.alert("Uyarı", "Ban süresi (saat) giriniz!");
      return;
    }

    Alert.alert("Ban Uygula", `${user.name} ${banHours} saat yasaklansın mı?`, [
      { text: "İptal", style: "cancel" },
      {
        text: "Banla",
        onPress: async () => {
          try {
            const res = await fetch(
              `${process.env.EXPO_PUBLIC_API_URL}/admin/users/ban`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  userId: user.id,
                  hours: Number(banHours),
                }),
              }
            );

            const data = await res.json();

            if (data.success) {
              Alert.alert("Başarılı", `${user.name} yasaklandı`);
              setBanHours("");
              fetchUsers();
            } else {
              Alert.alert("Hata", data.error || "Ban uygulanamadı");
            }
          } catch (err) {
            console.log("ban user error:", err);
          }
        },
      },
    ]);
  };

  // ------------------------------------------------
  // 🔥 BAN KALDIR
  // ------------------------------------------------
  const unbanUser = async (user) => {
    try {
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/admin/users/unban`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id }),
        }
      );

      const data = await res.json();

      if (data.success) {
        Alert.alert("Başarılı", `${user.name} artık serbest!`);
        fetchUsers();
      } else {
        Alert.alert("Hata", data.error || "İşlem başarısız");
      }
    } catch (err) {
      console.log("unban error:", err);
    }
  };

  // ------------------------------------------------
  // 🔥 UI — Kullanıcı Kartı
  // ------------------------------------------------
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.email}>{item.email}</Text>

      {item.banExpires && (
        <Text style={styles.banText}>
          ⛔ Yorum yasağı bitiş: {new Date(item.banExpires).toLocaleString()}
        </Text>
      )}

      <View style={styles.row}>
        <TextInput
          value={banHours}
          onChangeText={setBanHours}
          placeholder="Ban süresi (saat)"
          keyboardType="numeric"
          style={styles.input}
        />

        <TouchableOpacity style={styles.banBtn} onPress={() => banUser(item)}>
          <Text style={styles.banTextBtn}>Banla</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.unbanBtn}
          onPress={() => unbanUser(item)}
        >
          <Text style={styles.unbanText}>Banı Kaldır</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => deleteUser(item)}
        >
          <Text style={styles.deleteText}>Sil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Yükleniyor...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Kullanıcı Yönetimi</Text>

      <FlatList
        data={users}
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

  name: {
    fontSize: 18,
    fontWeight: "700",
  },

  email: {
    fontSize: 14,
    color: "#555",
  },

  banText: {
    marginTop: 8,
    color: "red",
    fontWeight: "bold",
  },

  row: {
    flexDirection: "row",
    marginTop: 10,
    alignItems: "center",
  },

  input: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    flex: 1,
    marginRight: 10,
  },

  banBtn: {
    backgroundColor: "#ff8800",
    padding: 10,
    borderRadius: 10,
  },

  banTextBtn: {
    color: "#fff",
    fontWeight: "700",
  },

  actions: {
    flexDirection: "row",
    marginTop: 10,
    justifyContent: "space-between",
  },

  unbanBtn: {
    backgroundColor: "#4caf50",
    padding: 10,
    borderRadius: 10,
  },

  unbanText: {
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
