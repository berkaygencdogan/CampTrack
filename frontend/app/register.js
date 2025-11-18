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

export default function Register() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [pass, setPass] = useState("");
  const [emailError, setEmailError] = useState("");

  const validateEmail = (mail) => {
    const regex = /\S+@\S+\.\S+/;
    return regex.test(mail);
  };

  const handleRegister = () => {
    if (!validateEmail(email)) {
      setEmailError("Something is missing. please type a valid email");
      return;
    }
    setEmailError("");

    // OTP ekranına gönder
    router.push("/otp?type=register");
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

      {/* Name */}
      <TextInput
        placeholder="Name"
        placeholderTextColor="#bbb"
        value={name}
        onChangeText={setName}
        style={[styles.input, name.length > 0 && { borderColor: "#7CC540" }]}
      />

      {/* Email */}
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

      {/* Phone */}
      <TextInput
        placeholder="Phone"
        placeholderTextColor="#bbb"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
        style={[styles.input, phone.length > 0 && { borderColor: "#7CC540" }]}
      />

      {/* Password */}
      <TextInput
        placeholder="Password"
        placeholderTextColor="#bbb"
        secureTextEntry
        value={pass}
        onChangeText={setPass}
        style={[styles.input, pass.length > 0 && { borderColor: "#7CC540" }]}
      />

      {/* Register button */}
      <TouchableOpacity style={styles.registerBtn} onPress={handleRegister}>
        <Text style={styles.registerText}>Register</Text>
      </TouchableOpacity>

      {/* Log In */}
      <TouchableOpacity onPress={() => router.replace("/login")}>
        <Text style={styles.loginLink}>Log In</Text>
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
    marginBottom: 35,
  },
  logoTent: {
    color: "#7CC540",
  },

  input: {
    backgroundColor: "#F7F7F7",
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: "#eee",
    marginBottom: 12,
    fontSize: 15,
  },
  inputError: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    marginTop: -6,
    marginBottom: 10,
    marginLeft: 4,
  },

  registerBtn: {
    backgroundColor: "#7CC540",
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 15,
  },
  registerText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
    fontSize: 16,
  },

  loginLink: {
    textAlign: "center",
    marginTop: 18,
    fontSize: 16,
    color: "#7CC540",
    fontWeight: "500",
  },
});
