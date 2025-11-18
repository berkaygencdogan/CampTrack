import { useState } from "react";
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
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");

  const login = () => {
    if (pass !== "1234") {
      setError("Wrong password please try again.");
      return;
    }
    setError("");
    router.replace("/home");
  };

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
      <TouchableOpacity style={styles.loginBtn} onPress={login}>
        <Text style={styles.loginText}>Log in</Text>
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
