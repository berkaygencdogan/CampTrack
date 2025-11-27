import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Ionicons from "@expo/vector-icons/Ionicons";
import { syncRemoveItem } from "../api/backpackApi";
import i18n from "./language";

export default function BackPackItem({ item }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.userInfo);

  return (
    <View style={styles.card}>
      <Image source={{ uri: item.img }} style={styles.img} />

      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{i18n.t(item.name)}</Text>
        <Text style={styles.category}>{i18n.t(item.category)}</Text>
      </View>

      <TouchableOpacity
        onPress={() => dispatch(syncRemoveItem(user.id, item.id))}
      >
        <Ionicons name="trash" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    padding: 12,
    backgroundColor: "#f7f7f7",
    borderRadius: 10,
    marginBottom: 12,
    alignItems: "center",
  },
  img: { width: 60, height: 60, borderRadius: 10, marginRight: 12 },
  name: { fontSize: 17, fontWeight: "600" },
  category: { fontSize: 13, color: "#777" },
});
