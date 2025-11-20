import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";

export default function NoTeams() {
  return (
    <View style={styles.container}>
      {/* Image */}
      <Image
        source={require("../../src/assets/images/success.png")}
        style={styles.image}
      />

      {/* Title */}
      <Text style={styles.title}>No way.</Text>

      {/* Description */}
      <Text style={styles.desc}>
        You don't have a team yet. Create one now.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  image: {
    width: 220,
    height: 220,
    resizeMode: "contain",
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
  },
  desc: {
    fontSize: 15,
    color: "#555",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 40,
  },
});
