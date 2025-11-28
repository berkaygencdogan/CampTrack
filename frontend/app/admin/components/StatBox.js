import { View, Text, StyleSheet } from "react-native";

export default function StatBox({ title, value, color = "#7CC540" }) {
  return (
    <View style={[styles.box, { borderLeftColor: color }]}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginTop: 40,
    elevation: 3,
    borderLeftWidth: 6,
  },
  title: { fontSize: 15, color: "#666", marginBottom: 4 },
  value: { fontSize: 22, fontWeight: "700", color: "#111" },
});
