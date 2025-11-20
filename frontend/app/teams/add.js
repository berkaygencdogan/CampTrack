import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { useSelector } from "react-redux";
import BackArrow from "../../src/assets/images/arrow-left.png";

export default function AddTeam() {
  const router = useRouter();
  const [name, setName] = useState("");
  const user = useSelector((state) => state.user.userInfo);

  const createTeam = async () => {
    if (!name.trim()) return;

    const userId = user.id;
    if (!userId) return alert("User not found!");

    const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/teams/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, name }),
    });

    const data = await res.json();
    if (data.success) {
      router.back(); // dön
    } else {
      alert("Failed");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Image source={BackArrow} style={{ fontSize: 24 }}></Image>
        </TouchableOpacity>
        <Text style={styles.headerText}>Create New Team</Text>
      </View>
      <TextInput
        placeholder="Team Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      <TouchableOpacity style={styles.btn} onPress={createTeam}>
        <Text style={styles.btnText}>Create</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 60 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },

  headerText: { fontSize: 26, fontWeight: "700", textAlign: "center", flex: 1 },
  input: {
    backgroundColor: "#F3F3F3",
    padding: 14,
    borderRadius: 12,
    marginBottom: 20,
  },
  btn: {
    backgroundColor: "#7CC540",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  btnText: { color: "white", fontSize: 18, fontWeight: "700" },
});
