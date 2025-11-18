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
  const { type } = useLocalSearchParams(); // login / register

  const [otp, setOtp] = useState(["", "", "", ""]);
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

  const submit = () => {
    const code = otp.join("");
    if (code.length !== 4) return;

    if (type === "register") {
      router.replace("/password-success?type=register");
    } else {
      router.replace("/new-password");
    }
  };

  // ---------- UI TEXT ----------
  const heading = "Confirm OTP";

  const text =
    type === "register"
      ? "Please confirm your 4 digit OTP. which is sent on your email or phone number."
      : "Please confirm your 4 digit OTP. which is sent on this number +1202-555-0174 Or example@mail.com";

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

      <TouchableOpacity style={styles.btn} onPress={submit}>
        <Text style={styles.btnText}>Send</Text>
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
  btn: { backgroundColor: "#7CC540", paddingVertical: 15, borderRadius: 10 },
  btnText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
});
