import { useState } from "react";
import {
  ActivityIndicator,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setOnboardScreen } from "../redux/onboardSlice";
import i18n from "./language";
import AdBanner from "../utils/admob/AdManager";

export default function Register() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [pass, setPass] = useState("");
  const [emailError, setEmailError] = useState("");
  const [generalError, setGeneralError] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const seenOnboarding = useSelector(
    (state) => state.onboard.showOnboardScreen
  );

  if (!seenOnboarding) {
    dispatch(setOnboardScreen(true));
  }

  const handleRegister = async () => {
    setGeneralError("");
    setEmailError("");

    if (!name || !email || !phone || !pass) {
      setGeneralError("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/register`,
        { name, email, phone, password: pass }
      );

      if (response.data.success) {
        router.replace("/login");
        return;
      }
    } catch (err) {
      const code = err.response?.data?.error;

      if (code === "EMAIL_EXISTS") {
        setEmailError("This email is already in use.");
      } else if (code === "MISSING_FIELDS") {
        setGeneralError("Please fill in all fields.");
      } else {
        setGeneralError("Registration failed. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <Text style={styles.logo}>
        C<Text style={styles.logoTent}>△</Text>MPING
      </Text>

      <TextInput
        placeholder="Nickname"
        placeholderTextColor="#bbb"
        value={name}
        onChangeText={setName}
        style={[styles.input, name.length > 0 && { borderColor: "#7CC540" }]}
      />

      <TextInput
        placeholder="Email"
        placeholderTextColor="#bbb"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          setEmailError("");
        }}
        style={[
          styles.input,
          emailError
            ? styles.inputError
            : email.length > 0
            ? { borderColor: "#7CC540" }
            : null,
        ]}
      />

      {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

      <TextInput
        placeholder="Phone"
        placeholderTextColor="#bbb"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
        style={[styles.input, phone.length > 0 && { borderColor: "#7CC540" }]}
      />

      <TextInput
        placeholder="Password"
        placeholderTextColor="#bbb"
        secureTextEntry
        value={pass}
        onChangeText={setPass}
        style={[styles.input, pass.length > 0 && { borderColor: "#7CC540" }]}
      />

      {generalError ? (
        <Text style={[styles.errorText, { marginTop: 5 }]}>{generalError}</Text>
      ) : null}

      <TouchableOpacity
        style={[styles.registerBtn, loading && { opacity: 0.6 }]}
        onPress={handleRegister}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.registerText}>{i18n.t("register")}</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.replace("/login")}>
        <Text style={styles.loginLink}>{i18n.t("login")}</Text>
      </TouchableOpacity>
      <View style={styles.banner}>
        <AdBanner />
      </View>
      <View style={styles.banner}>
        <AdBanner />
      </View>
      <View style={styles.banner}>
        <AdBanner />
      </View>
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
  banner: {
    marginTop: 20,
    width: "100%",
    height: "10%",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    fontSize: 36,
    fontWeight: "bold",
    alignSelf: "center",
    marginBottom: 35,
  },
  logoTent: { color: "#7CC540" },
  input: {
    backgroundColor: "#F7F7F7",
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: "#eee",
    marginBottom: 12,
    fontSize: 15,
  },
  inputError: { borderColor: "red" },
  errorText: { color: "red", marginTop: -6, marginBottom: 10, marginLeft: 4 },
  registerBtn: {
    backgroundColor: "#7CC540",
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 15,
    alignItems: "center",
  },
  registerText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  loginLink: {
    textAlign: "center",
    marginTop: 18,
    fontSize: 16,
    color: "#7CC540",
    fontWeight: "500",
  },
});
