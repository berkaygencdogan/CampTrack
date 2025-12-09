import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { setAuthData } from "../redux/userSlice";
import { setOnboardScreen } from "../redux/onboardSlice";
import i18n from "./language";
import AdBanner from "../utils/admob/AdManager";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const seenOnboarding = useSelector(
    (state) => state.onboard.showOnboardScreen
  );

  if (!seenOnboarding) {
    dispatch(setOnboardScreen(true));
  }

  const loginWithEmail = async () => {
    setError("");

    const cleanEmail = email.trim();
    if (!cleanEmail || !pass) {
      setError("Please fill all fields.");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/login`, {
        email: cleanEmail,
        password: pass,
      });

      if (!res.data.success) {
        setError("Login failed");
        setLoading(false);
        return;
      }

      const token = res.data.token;

      const me = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/auth/me`, {
        headers: { Authorization: "Bearer " + token },
      });

      dispatch(
        setAuthData({
          token,
          email: me.data.user.email,
          userId: me.data.user.id,
          user: me.data.user,
        })
      );

      await AsyncStorage.setItem("token", token);

      router.replace("/home");
    } catch (err) {
      const code = err.response?.data?.error;

      if (code === "INVALID_CREDENTIALS") {
        setError("Email or password incorrect");
      } else {
        setError("Login failed");
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

      <Text style={styles.label}>Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="example@mail.com"
        placeholderTextColor="#999"
        style={[styles.input, email.length > 0 && { borderColor: "#7CC540" }]}
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        value={pass}
        onChangeText={setPass}
        secureTextEntry
        placeholder="********"
        placeholderTextColor="#999"
        style={[
          styles.input,
          error ? styles.inputError : null,
          pass.length > 0 && !error ? { borderColor: "#7CC540" } : null,
        ]}
      />

      {error ? <Text style={styles.errorText}>! {error}</Text> : null}

      <TouchableOpacity
        style={[styles.loginBtn, loading && { opacity: 0.6 }]}
        onPress={loginWithEmail}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.loginText}>{i18n.t("login")}</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/register")}>
        <Text style={styles.registerText}>
          {i18n.t("haveaccount")}
          <Text style={styles.registerLink}>{i18n.t("register")}</Text>
        </Text>
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
    marginBottom: 40,
  },
  logoTent: { color: "#7CC540" },
  label: { fontSize: 15, color: "#555", marginTop: 10 },
  input: {
    backgroundColor: "#F8F8F8",
    borderRadius: 10,
    padding: 14,
    marginTop: 6,
    borderWidth: 1,
    borderColor: "#eee",
  },
  inputError: { borderColor: "red" },
  errorText: { color: "red", marginTop: 5, marginLeft: 3 },
  loginBtn: {
    backgroundColor: "#7CC540",
    padding: 15,
    borderRadius: 10,
    marginTop: 25,
    alignItems: "center",
  },
  loginText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  registerText: { textAlign: "center", marginTop: 20, color: "#444" },
  registerLink: { color: "#7CC540", fontWeight: "bold" },
});
