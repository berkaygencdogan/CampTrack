import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { useState } from "react";

import * as ImagePicker from "expo-image-picker";

import { auth, db, storage } from "../src/firebase/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function AddTeammate() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [localImage, setLocalImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const pickPhoto = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setLocalImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (uri) => {
    const blob = await (await fetch(uri)).blob();
    const id = Date.now().toString();
    const imageRef = ref(storage, `teammates/${id}.jpg`);

    await uploadBytes(imageRef, blob);
    return await getDownloadURL(imageRef);
  };

  const saveTeammate = async () => {
    if (!name || !role || !localImage) {
      Alert.alert("Missing Fields", "Please fill all fields.");
      return;
    }

    setLoading(true);

    const uid = auth.currentUser.uid;
    const teammateId = Date.now().toString();

    try {
      const imageUrl = await uploadImage(localImage);

      await setDoc(doc(db, "users", uid, "teammates", teammateId), {
        name,
        role,
        image: imageUrl,
      });

      Alert.alert("Success", "Teammate added!");
      router.back();
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Something went wrong.");
    }

    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Add New Teammate</Text>

      <TouchableOpacity style={styles.photoBox} onPress={pickPhoto}>
        {localImage ? (
          <Image source={{ uri: localImage }} style={styles.photo} />
        ) : (
          <Ionicons name="add" size={40} color="#7CC540" />
        )}
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Teammate Name"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Role (Chef, Scout, etc.)"
        value={role}
        onChangeText={setRole}
      />

      <TouchableOpacity
        style={styles.saveBtn}
        onPress={saveTeammate}
        disabled={loading}
      >
        <Text style={styles.saveText}>{loading ? "Saving..." : "Add"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#fff", flex: 1 },
  header: { fontSize: 22, fontWeight: "700", marginBottom: 15 },

  photoBox: {
    width: 120,
    height: 120,
    backgroundColor: "#F2F2F2",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  photo: { width: 120, height: 120, borderRadius: 14 },

  input: {
    backgroundColor: "#F4F4F4",
    padding: 15,
    borderRadius: 14,
    fontSize: 16,
    marginBottom: 15,
  },

  saveBtn: {
    backgroundColor: "#7CC540",
    padding: 18,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 10,
  },
  saveText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
