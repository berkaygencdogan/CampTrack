import React from "react";
import { View, Image, TouchableOpacity, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import RenderVideo from "./RenderVideo";

export default function MediaItem({ item, index, onOpenOrder, onDelete }) {
  return (
    <View style={styles.mediaBox}>
      {/* DRAG HANDLE → Modal Aç */}
      <TouchableOpacity
        style={styles.dragHandle}
        onPress={() => onOpenOrder(index)}
      >
        <Ionicons name="reorder-three" size={30} color="#fff" />
      </TouchableOpacity>

      {/* MEDIA */}
      {item.type === "image" ? (
        <Image source={{ uri: item.url }} style={styles.mediaImg} />
      ) : (
        <RenderVideo url={item.url} />
      )}

      {/* DELETE */}
      <TouchableOpacity
        style={styles.deleteBtn}
        onPress={() => onDelete(index)}
      >
        <Ionicons name="trash" size={22} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  mediaBox: {
    width: "100%",
    height: 360,
  },

  mediaImg: {
    width: "100%",
    height: "100%",
    backgroundColor: "#000",
  },

  dragHandle: {
    position: "absolute",
    top: 15,
    left: 15,
    zIndex: 99,
    padding: 4,
    backgroundColor: "rgba(0,0,0,0.45)",
    borderRadius: 10,
  },

  deleteBtn: {
    position: "absolute",
    right: 15,
    top: 15,
    zIndex: 99,
    padding: 6,
    backgroundColor: "rgba(0,0,0,0.45)",
    borderRadius: 10,
  },
});
