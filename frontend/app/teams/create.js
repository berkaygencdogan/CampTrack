import Ionicons from "@expo/vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useSelector } from "react-redux";
import adManager from "../../utils/admob/AdManager";

export default function CreateTeam() {
  const API = process.env.EXPO_PUBLIC_API_URL;
  const router = useRouter();
  const user = useSelector((state) => state.user.userInfo);

  const [teamName, setTeamName] = useState("");
  const [logo, setLogo] = useState(null);
  const [loading, setLoading] = useState(false);

  const pickLogo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      base64: true,
      allowsMultipleSelection: false,
      quality: 0.8,
      mediaTypes: ["images"],
    });

    if (!result.canceled) {
      setLogo(result.assets[0]);
    }
  };

  const createTeam = async () => {
    if (!teamName) return alert("Takım adı gerekli!");

    setLoading(true);

    try {
      const body = {
        teamName,
        logo: logo ? logo.base64 : null,
        createdBy: user.id,
      };

      const res = await fetch(`${API}/teams/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (data.success) {
        alert("Takım başarıyla oluşturuldu!");
        adManager.onTeamCreate();
        router.back();
      }
    } catch (err) {
      console.log("CREATE TEAM ERROR:", err);
      alert("Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <ScrollView
        contentContainerStyle={[styles.container, { justifyContent: "center" }]}
      >
        <ActivityIndicator size="large" color="#7CC540" />
      </ScrollView>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
        <Ionicons name="chevron-back" size={26} color="black" />
      </TouchableOpacity>
      <Text style={styles.title}>Yeni Takım Oluştur</Text>

      <Text style={styles.label}>Takım Adı</Text>
      <TextInput
        style={styles.input}
        placeholder="Takım adı..."
        value={teamName}
        onChangeText={setTeamName}
      />

      <Text style={styles.label}>Takım Logosu</Text>

      <TouchableOpacity style={styles.logoBox} onPress={pickLogo}>
        {logo ? (
          <Image source={{ uri: logo.uri }} style={styles.logo} />
        ) : (
          <Ionicons name="camera" size={30} color="#7CC540" />
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.btn, loading && { opacity: 0.7 }]}
        onPress={createTeam}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#ffffff" />
        ) : (
          <Text style={styles.btnText}>Oluştur</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    paddingTop: 100,
    backgroundColor: "#fff",
  },
  backBtn: {
    position: "absolute",
    top: 100,
    left: 20,
    zIndex: 999,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    marginTop: 20,
    marginBottom: 6,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#F5F5F5",
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
  },
  logoBox: {
    width: 120,
    height: 120,
    backgroundColor: "#E9F5E3",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 20,
  },
  row: {
    flexDirection: "row",
    marginTop: 10,
    flexWrap: "wrap",
    gap: 10,
  },
  avatar: {
    width: 55,
    height: 55,
    borderRadius: 45,
  },
  removeX: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "red",
    width: 20,
    height: 20,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  search: {
    backgroundColor: "#F5F5F5",
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
  },
  searchBox: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    marginTop: 6,
  },
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  userImg: {
    width: 40,
    height: 40,
    borderRadius: 25,
  },
  userName: {
    marginLeft: 10,
    fontSize: 16,
  },
  btn: {
    backgroundColor: "#7CC540",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 30,
  },
  btnText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },
});
