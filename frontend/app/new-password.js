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
import { useRouter, useLocalSearchParams } from "expo-router";
import i18n from "./language";

export default function NewPassword() {
  const router = useRouter();
  const { phone } = useLocalSearchParams(); // OTP’den gelen telefon numarası

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!password.trim()) {
      setError("Password required");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (!phone) {
      setError("Missing phone information");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/auth/reset-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone, password }),
        }
      );

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      router.replace("/password-success?type=reset");
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

      <Text style={styles.title}>{i18n.t("newpassword")}</Text>

      <Text style={styles.desc}>{i18n.t("enternewpassword")}</Text>

      <Text style={styles.label}>{i18n.t("setpassword")}</Text>

      <TextInput
        value={password}
        onChangeText={(v) => {
          setPassword(v);
          setError("");
        }}
        secureTextEntry
        placeholder="********"
        placeholderTextColor="#aaa"
        style={[
          styles.input,
          password.length > 0 && { borderColor: "#7CC540" },
        ]}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TouchableOpacity
        style={styles.sendBtn}
        onPress={handleSend}
        disabled={loading}
      >
        <Text style={styles.sendText}>
          {loading ? i18n.t("saving") : i18n.t("send")}
        </Text>
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
  error: {
    color: "red",
    marginTop: 8,
    marginBottom: 12,
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
