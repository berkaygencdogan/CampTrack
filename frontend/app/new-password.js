import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";

export default function NewPassword() {
  const router = useRouter();
  const [password, setPassword] = useState("");

  const handleSend = () => {
    if (!password.trim()) return;
    router.replace("/password-success?type=login");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      {/* Back button */}
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Text style={styles.backArrow}>←</Text>
      </TouchableOpacity>

      {/* Title */}
      <Text style={styles.title}>New Password</Text>

      {/* Description */}
      <Text style={styles.desc}>
        Enter your new password below and please{"\n"}
        don’t forget it now. it’s important to you to{"\n"}
        remember your password.
      </Text>

      {/* Label */}
      <Text style={styles.label}>Set Password</Text>

      {/* Password Input */}
      <TextInput
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder="********"
        placeholderTextColor="#aaa"
        style={[
          styles.input,
          password.length > 0 && { borderColor: "#7CC540" },
        ]}
      />

      {/* Send Button */}
      <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
        <Text style={styles.sendText}>Send</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 25,
    paddingTop: 60,
  },
  backBtn: {
    position: "absolute",
    top: 60,
    left: 25,
  },
  backArrow: {
    fontSize: 22,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  desc: {
    fontSize: 15,
    color: "#555",
    lineHeight: 22,
    marginBottom: 40,
  },
  label: {
    fontSize: 15,
    color: "#555",
  },
  input: {
    marginTop: 6,
    backgroundColor: "#F7F7F7",
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: "#eee",
  },
  sendBtn: {
    backgroundColor: "#7CC540",
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 30,
  },
  sendText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
});
