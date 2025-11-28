import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import StatBox from "./components/StatBox";

export default function Dashboard() {
  const user = useSelector((state) => state.user.userInfo);
  const [stats, setStats] = useState(null);

  const fetchStats = async () => {
    try {
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/admin/stats?uid=${user.id}`
      );
      const data = await res.json();
      if (data.success) setStats(data.stats);
    } catch (err) {
      console.log("admin stats error:", err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (!stats) return <Text>Loading…</Text>;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Dashboard</Text>

      <StatBox
        title="Toplam Kullanıcı"
        value={stats.totalUsers}
        color="#7CC540"
      />
      <StatBox title="Toplam Yer" value={stats.totalPlaces} color="#4A90E2" />
      <StatBox
        title="Toplam Yorum"
        value={stats.totalComments}
        color="#FF9500"
      />
      <StatBox
        title="Toplam Rapor"
        value={stats.totalReports}
        color="#FF3B30"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#fff", flex: 1 },
  header: {
    width: "100%",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
});
