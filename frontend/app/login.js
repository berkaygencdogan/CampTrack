import { useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");

  const loginWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const user = await GoogleSignin.signIn();
      console.log("Google User:", user);

      // Başarılı giriş -> Home'a yönlendir
      router.replace("/home");
    } catch (err) {
      console.log("Google Error:", err);
      setError("Google sign-in failed.");
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
        style={{
          backgroundColor: "#4285F4",
          padding: 15,
          borderRadius: 10,
          marginTop: 15,
        }}
        onPress={loginWithGoogle}
      >
        <Text style={{ color: "#fff", textAlign: "center", fontWeight: "600" }}>
          Continue with Google
        </Text>
      </TouchableOpacity>

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
