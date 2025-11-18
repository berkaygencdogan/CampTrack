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

export default function ForgotPassword() {
  const router = useRouter();
  const [phone, setPhone] = useState("");

  const sendOTP = () => {
    if (!phone.trim()) return;
    router.push("/otp?type=login");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      {/* Header Back Button */}
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Text style={styles.backArrow}>←</Text>
      </TouchableOpacity>

      {/* Title */}
      <Text style={styles.title}>Forgot Password</Text>

      {/* Description */}
      <Text style={styles.desc}>
        To get your new password you need to put your{"\n"}
        phone number down below. and we will{"\n"}
        send you an OTP on that number for{"\n"}
        confirmation.
      </Text>

      {/* Phone Label */}
      <Text style={styles.label}>Phone</Text>

      {/* Phone Input */}
      <TextInput
        placeholder="+1 | 202-555-0174"
        placeholderTextColor="#aaa"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
        style={[styles.input, phone.length > 0 && { borderColor: "#7CC540" }]}
      />

      {/* Send Button */}
      <TouchableOpacity style={styles.sendBtn} onPress={sendOTP}>
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
