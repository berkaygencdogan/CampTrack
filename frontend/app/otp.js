import { useLocalSearchParams, useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

export default function OTP() {
  const router = useRouter();
  const { type, phone } = useLocalSearchParams(); // type=reset / register

  const [otp, setOtp] = useState(["", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const refs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  const onChange = (value, i) => {
    if (/^\d$/.test(value) || value === "") {
      const arr = [...otp];
      arr[i] = value;
      setOtp(arr);

      if (value && i < 3) refs[i + 1].current.focus();
      if (!value && i > 0) refs[i - 1].current.focus();
    }
  };

  const submit = async () => {
    const code = otp.join("");
    if (code.length !== 4) {
      setError("Enter 4 digit code");
      return;
    }

    if (!phone) {
      setError("Missing phone info");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/auth/verify-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone, otp: code }),
        }
      );

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setError(data.error || "Invalid OTP");
        return;
      }

      // For register flow
      if (type === "register") {
        router.replace("/password-success?type=register");
      } else {
        // For password reset flow
        router.replace(`/new-password?phone=${phone}`);
      }
    } catch (err) {
      setError("Network error");
      setLoading(false);
    }
  };

  const heading = "Confirm OTP";

  const text =
    type === "register"
      ? "Please confirm your 4 digit OTP sent to your phone."
      : `Enter the 4 digit code sent to ${phone}`;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <TouchableOpacity style={styles.back} onPress={() => router.back()}>
        <Text style={styles.backArrow}>←</Text>
      </TouchableOpacity>

      <Text style={styles.title}>{heading}</Text>
      <Text style={styles.desc}>{text}</Text>

      <View style={styles.row}>
        {otp.map((n, i) => (
          <TextInput
            key={i}
            maxLength={1}
            keyboardType="numeric"
            style={styles.box}
            ref={refs[i]}
            value={n}
            onChangeText={(v) => onChange(v, i)}
          />
        ))}
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TouchableOpacity style={styles.btn} onPress={submit} disabled={loading}>
        <Text style={styles.btnText}>{loading ? "Checking..." : "Verify"}</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 60,
    paddingHorizontal: 25,
  },
  back: { position: "absolute", top: 60, left: 25 },
  backArrow: { fontSize: 22 },
  title: { fontSize: 26, fontWeight: "bold", marginTop: 20, marginBottom: 10 },
  desc: { color: "#555", fontSize: 15, lineHeight: 22, marginBottom: 40 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 40,
    marginBottom: 40,
  },
  box: {
    width: 45,
    height: 50,
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    textAlign: "center",
    fontSize: 22,
    borderWidth: 1,
    borderColor: "#eee",
  },
  error: {
    color: "red",
    textAlign: "center",
    marginBottom: 15,
    fontSize: 14,
  },
  btn: { backgroundColor: "#7CC540", paddingVertical: 15, borderRadius: 10 },
  btnText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
});
