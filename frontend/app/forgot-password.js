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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const sendOTP = async () => {
    if (!phone.trim()) {
      setError("Phone number required");
      return;
    }

    try {
      setError("");
      setLoading(true);

      const res = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/auth/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone }),
        }
      );

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      router.push(`/otp?type=reset&phone=${phone}`);
    } catch (err) {
      setLoading(false);
      setError("Network error");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Text style={styles.backArrow}>←</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Forgot Password</Text>

      <Text style={styles.desc}>
        Enter your phone number below. We will send you a verification code.
      </Text>

      <Text style={styles.label}>Phone</Text>

      <TextInput
        placeholder="+1 | 202-555-0174"
        placeholderTextColor="#aaa"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={(text) => {
          setPhone(text);
          setError("");
        }}
        style={[styles.input, phone.length > 0 && { borderColor: "#7CC540" }]}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TouchableOpacity
        style={styles.sendBtn}
        onPress={sendOTP}
        disabled={loading}
      >
        <Text style={styles.sendText}>{loading ? "Sending..." : "Send"}</Text>
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
    marginBottom: 30,
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
  error: {
    color: "red",
    marginTop: 8,
    marginBottom: 8,
    fontSize: 14,
  },
  sendBtn: {
    backgroundColor: "#7CC540",
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 15,
  },
  sendText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
});
