import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";

import { db, storage } from "../firebase/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// keyword generator
function generateKeywords(place) {
  const { name, city, description } = place;

  const base = `${name} ${city} ${description}`
    .toLowerCase()
    .replace(/[^a-zA-ZğüşöçıİĞÜŞÖÇ ]/g, "");

  const words = base.split(" ").filter((w) => w.length > 0);

  const keywords = new Set();

  words.forEach((word) => {
    keywords.add(word);

    for (let i = 1; i <= word.length; i++) {
      keywords.add(word.substring(0, i));
    }
  });

  return Array.from(keywords);
}

export default function AddPlaceScreen() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [description, setDescription] = useState("");

  const [localImage, setLocalImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // ---------------- IMAGE PICKER ----------------
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled) {
      setLocalImage(result.assets[0].uri);
    }
  };

  // --------------- UPLOAD TO STORAGE ------------
  const uploadImage = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();

    const id = Date.now().toString();
    const imageRef = ref(storage, `places/${id}.jpg`);

    await uploadBytes(imageRef, blob);
    return await getDownloadURL(imageRef);
  };

  // ---------------- SAVE PLACE -------------------
  const handleSave = async () => {
    if (!name || !city || !description || !localImage) {
      Alert.alert("Missing Fields", "Please fill all fields before saving.");
      return;
    }

    setLoading(true);

    try {
      const imageUrl = await uploadImage(localImage);

      const placeData = {
        name,
        city,
        description,
        image: imageUrl,
        rating: 0,
        isPopular: false,
      };

      const searchKeywords = generateKeywords(placeData);
      const id = Date.now().toString();

      await setDoc(doc(db, "places", id), {
        ...placeData,
        searchKeywords,
      });

      Alert.alert("Success", "New place added successfully!");
      router.back();
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Something went wrong.");
    }

    setLoading(false);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* HEADER */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={26} color="black" />
        </TouchableOpacity>
        <Text style={styles.header}>Add New Place</Text>
      </View>

      {/* FORM */}
      <Text style={styles.label}>Place Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Write place name..."
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>City</Text>
      <TextInput
        style={styles.input}
        placeholder="City / Region"
        value={city}
        onChangeText={setCity}
      />

      <TouchableOpacity style={styles.viewLocations}>
        <Text style={styles.viewLocationText}>View Locations</Text>
      </TouchableOpacity>

      {/* IMAGE */}
      <Text style={styles.label}>Photo</Text>

      <TouchableOpacity style={styles.photoBox} onPress={pickImage}>
        {localImage ? (
          <Image source={{ uri: localImage }} style={styles.photo} />
        ) : (
          <View style={styles.photoPlaceholder}>
            <Ionicons name="add" size={36} color="#7CC540" />
            <Text style={{ color: "#888" }}>Add Photo</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* DESCRIPTION */}
      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, { height: 120 }]}
        placeholder="Explain this place..."
        value={description}
        onChangeText={setDescription}
        multiline
      />

      {/* SAVE / CONTINUE */}
      <TouchableOpacity
        style={styles.continueBtn}
        onPress={handleSave}
        disabled={loading}
      >
        <Text style={styles.continueText}>
          {loading ? "Saving..." : "Continue"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

/* ------------------ STYLES ------------------ */

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    flex: 1,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },

  header: {
    fontSize: 22,
    fontWeight: "600",
    marginLeft: 10,
  },

  label: {
    marginTop: 10,
    marginBottom: 6,
    fontSize: 15,
    fontWeight: "500",
  },

  input: {
    backgroundColor: "#F5F5F5",
    padding: 15,
    borderRadius: 14,
    fontSize: 16,
    marginBottom: 15,
  },

  viewLocations: {
    borderWidth: 1,
    borderColor: "#7CC540",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
    alignSelf: "flex-start",
    marginBottom: 15,
  },
  viewLocationText: {
    color: "#7CC540",
    fontWeight: "600",
    fontSize: 14,
  },

  photoBox: {
    width: 120,
    height: 120,
    borderRadius: 14,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 25,
  },

  photo: {
    width: "100%",
    height: "100%",
    borderRadius: 14,
  },

  photoPlaceholder: {
    justifyContent: "center",
    alignItems: "center",
  },

  continueBtn: {
    backgroundColor: "#7CC540",
    padding: 18,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 50,
  },
  continueText: {
    color: "white",
    fontSize: 17,
    fontWeight: "bold",
  },
});
