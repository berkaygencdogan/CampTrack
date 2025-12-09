import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { useSelector } from "react-redux";
import adManager from "../../utils/admob/AdManager";

export default function CreateTeam() {
  const API = process.env.EXPO_PUBLIC_API_URL;
  const router = useRouter();
  const user = useSelector((state) => state.user.userInfo);

  const [teamName, setTeamName] = useState("");
  const [logo, setLogo] = useState(null);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const [members, setMembers] = useState([user]); // kendi kullanıcı her zaman ilk

  // ---------------------------------------------
  // LOGO PICKER
  // ---------------------------------------------
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

  // ---------------------------------------------
  // SEARCH USER
  // ---------------------------------------------
  const searchUser = async (text) => {
    setSearch(text);

    if (text.length < 2) return;

    try {
      const res = await fetch(`${API}/users/search?username=${text}`);
      const data = await res.json();
      setSearchResults(data.users);
    } catch (err) {
      console.log("Search error:", err);
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

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Yeni Takım Oluştur</Text>

      {/* ------------------------ */}
      {/* TEAM NAME */}
      {/* ------------------------ */}
      <Text style={styles.label}>Takım Adı</Text>
      <TextInput
        style={styles.input}
        placeholder="Takım adı..."
        value={teamName}
        onChangeText={setTeamName}
      />

      {/* ------------------------ */}
      {/* LOGO PICKER */}
      {/* ------------------------ */}
      <Text style={styles.label}>Takım Logosu</Text>

      <TouchableOpacity style={styles.logoBox} onPress={pickLogo}>
        {logo ? (
          <Image source={{ uri: logo.uri }} style={styles.logo} />
        ) : (
          <Ionicons name="camera" size={30} color="#7CC540" />
        )}
      </TouchableOpacity>

      {/* ------------------------ */}
      {/* CREATE BUTTON */}
      {/* ------------------------ */}
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
    padding: 25,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
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
