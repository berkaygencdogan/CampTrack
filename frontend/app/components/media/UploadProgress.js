// components/UploadProgress.js
import React from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";

export default function UploadProgress({ visible, current, total }) {
  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.box}>
        <ActivityIndicator color="#007AFF" size="large" />
        <Text style={styles.text}>
          {current}/{total} Uploading...
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  box: {
    width: 180,
    paddingVertical: 25,
    backgroundColor: "#fff",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
  },
  text: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "600",
    color: "#007AFF",
  },
});
