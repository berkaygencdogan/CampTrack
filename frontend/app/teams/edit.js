import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Image,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Image as ExpoImage } from "expo-image";
import BackArrow from "../../src/assets/images/arrow-left.png";

export default function TeamEdit() {
  const router = useRouter();
  const { teamId } = useLocalSearchParams();
  const API = process.env.EXPO_PUBLIC_API_URL;

  const [teamName, setTeamName] = useState("");
  const [logo, setLogo] = useState(null);
  const [members, setMembers] = useState([]);
  const [loadingSave, setLoadingSave] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTeam();
    loadMembers();
  }, []);

  // -----------------------------------
  // TEAM DATA LOAD
  // -----------------------------------
  const loadTeam = async () => {
    try {
      const res = await fetch(`${API}/teams/${teamId}`);
      const data = await res.json();

      setTeamName(data.team.teamName);
      setLogo(data.team.logo || null);
    } catch (err) {
      console.log("LOAD TEAM ERROR:", err);
    }
  };

  // -----------------------------------
  // MEMBERS (READ ONLY)
  // -----------------------------------
  const loadMembers = async () => {
    try {
      const res = await fetch(`${API}/teams/${teamId}/members`);
      const data = await res.json();

      setMembers(data.members);
      setLoading(false);
    } catch (err) {
      console.log("LOAD MEMBERS ERROR:", err);
    }
  };

  // -----------------------------------
  // PICK NEW LOGO
  // -----------------------------------
  const pickLogo = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      base64: true,
      allowsMultipleSelection: false,
      quality: 0.8,
    });

    if (!res.canceled) {
      setLogo({
        uri: res.assets[0].uri,
        base64: res.assets[0].base64,
      });
    }
  };

  // -----------------------------------
  // SAVE CHANGES
  // -----------------------------------
  const saveChanges = async () => {
    if (!teamName.trim()) {
      alert("Team name is required!");
      return;
    }

    setLoadingSave(true);

    try {
      await fetch(`${API}/teams/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teamId,
          newName: teamName,
          newLogoBase64: logo?.base64 || null,
        }),
      });

      setLoadingSave(false);
      alert("Changes saved!");
      router.push("/teammates");
    } catch (err) {
      console.log("SAVE ERROR:", err);
      setLoadingSave(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator size="large" color="#7CC540" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.backArrow} onPress={() => router.back()}>
        <Image source={BackArrow} style={{ width: 26, height: 26 }} />
      </TouchableOpacity>
      <Text style={styles.title}>Edit Team</Text>

      {/* TEAM NAME */}
      <Text style={styles.label}>Team Name</Text>
      <TextInput
        value={teamName}
        onChangeText={setTeamName}
        style={styles.input}
      />

      {/* LOGO */}
      <Text style={styles.label}>Team Logo</Text>
      <TouchableOpacity style={styles.logoBox} onPress={pickLogo}>
        {logo ? (
          <ExpoImage
            source={{
              uri: (logo.uri || logo) + `?t=${Date.now()}`,
            }}
            style={styles.logo}
          />
        ) : (
          <Ionicons name="camera" size={32} color="#7CC540" />
        )}
      </TouchableOpacity>

      {/* MEMBERS LIST (READ ONLY) */}
      <Text style={[styles.label, { marginTop: 30 }]}>Members</Text>

      {members.map((m) => (
        <View key={m.id} style={styles.memberRow}>
          <ExpoImage
            source={{ uri: m.avatar || "https://i.imgur.com/0y8Ftya.png" }}
            style={styles.avatar}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.memberName}>{m.name}</Text>
            <Text style={styles.memberEmail}>{m.email}</Text>
          </View>
        </View>
      ))}

      {/* SAVE BUTTON */}
      <TouchableOpacity style={styles.saveBtn} onPress={saveChanges}>
        {loadingSave ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.saveText}>Save</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

/* ----------------- STYLES ------------------ */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    backgroundColor: "#fff",
  },
  loadingScreen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    width: "100%",
    textAlign: "center",
    fontSize: 26,
    fontWeight: "700",
    marginVertical: 30,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 20,
  },
  input: {
    backgroundColor: "#F2F2F2",
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
    marginTop: 6,
  },
  logoBox: {
    width: 120,
    height: 120,
    backgroundColor: "#E9F5E3",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 20,
  },

  /* MEMBERS */
  memberRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
  },
  avatar: {
    width: 55,
    height: 55,
    borderRadius: 10,
    marginRight: 12,
  },
  memberName: {
    fontSize: 17,
    fontWeight: "600",
  },
  memberEmail: {
    fontSize: 13,
    color: "#777",
  },

  /* SAVE BUTTON */
  saveBtn: {
    backgroundColor: "#7CC540",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 35,
    marginBottom: 50,
  },
  saveText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },
  backArrow: {
    position: "absolute",
    top: 60,
    left: 40,
    zIndex: 999,
  },
});
