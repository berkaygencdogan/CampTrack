import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function PasswordSuccess() {
  const router = useRouter();
  const { type } = useLocalSearchParams(); // login / register

  const title = "Hurrey";

  const message =
    type === "register"
      ? "Your registration is successful. please go back and log-in."
      : "Your Password changed successfully. please go back and log-in.";

  return (
    <View style={styles.container}>
      {/* Image */}
      <Image
        source={require("../src/assets/images/success.png")}
        style={styles.image}
      />

      {/* Title */}
      <Text style={styles.title}>{title}</Text>

      {/* Description */}
      <Text style={styles.desc}>{message}</Text>

      {/* Go Back button */}
      <TouchableOpacity
        style={styles.btn}
        onPress={() => router.replace("/login")}
      >
        <Text style={styles.btnText}>Go Back</Text>
      </TouchableOpacity>
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
  btn: {
    backgroundColor: "#7CC540",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  btnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
