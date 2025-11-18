import * as Google from "expo-auth-session/providers/google";
import { signInWithCredential, GoogleAuthProvider } from "firebase/auth";
import { auth, db } from "../src/firebase/firebaseConfig";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";

export default function Login() {
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  });
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.authentication;
      const credential = GoogleAuthProvider.credential(id_token);
      console.log("GOOGLE RESPONSE:", response);

      signInWithCredential(auth, credential).then(async (result) => {
        // Firestore user kaydı yoksa oluştur
        const ref = doc(db, "users", result.user.uid);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
          await setDoc(ref, {
            name: result.user.displayName,
            email: result.user.email,
            image: result.user.photoURL,
            createdAt: Date.now(),
          });
        }

        router.replace("/home");
      });
    }
  }, [response]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      {/* Logo */}
      <Text style={styles.logo}>
        C<Text style={styles.logoTent}>△</Text>MPING
      </Text>

      {/* Email */}
      <Text style={styles.label}>Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="example@mail.com"
        placeholderTextColor="#999"
        style={[styles.input, email.length > 0 && { borderColor: "#7CC540" }]}
      />

      {/* Password */}
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

      {/* Error */}
      {error ? <Text style={styles.errorText}>! {error}</Text> : null}

      {/* Forgot Password */}
      <TouchableOpacity onPress={() => router.push("/forgot-password")}>
        <Text style={styles.forgot}>Forgot Password?</Text>
      </TouchableOpacity>

      {/* Login button */}
      <TouchableOpacity
        style={{
          backgroundColor: "#4285F4",
          padding: 15,
          borderRadius: 10,
          marginTop: 15,
        }}
        onPress={() => promptAsync()}
      >
        <Text style={{ color: "#fff", textAlign: "center", fontWeight: "600" }}>
          Continue with Google
        </Text>
      </TouchableOpacity>

      {/* Register */}
      <TouchableOpacity onPress={() => router.push("/register")}>
        <Text style={styles.registerText}>
          Don’t have an Account?{" "}
          <Text style={styles.registerLink}>Register</Text>
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
  logo: {
    fontSize: 36,
    fontWeight: "bold",
    alignSelf: "center",
    marginBottom: 40,
  },
  logoTent: {
    color: "#7CC540",
  },
  label: {
    fontSize: 15,
    color: "#555",
    marginTop: 10,
  },
  input: {
    backgroundColor: "#F8F8F8",
    borderRadius: 10,
    padding: 14,
    marginTop: 6,
    borderWidth: 1,
    borderColor: "#eee",
  },
  inputError: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    marginTop: 5,
    marginLeft: 3,
  },
  forgot: {
    textAlign: "center",
    marginTop: 15,
    color: "#777",
  },
  loginBtn: {
    backgroundColor: "#7CC540",
    padding: 15,
    borderRadius: 10,
    marginTop: 25,
  },
  loginText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
    textAlign: "center",
  },
  registerText: {
    textAlign: "center",
    marginTop: 20,
    color: "#444",
  },
  registerLink: {
    color: "#7CC540",
    fontWeight: "bold",
  },
});
