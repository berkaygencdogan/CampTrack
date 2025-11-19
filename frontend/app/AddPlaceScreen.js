import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { useRouter } from "expo-router";

export default function AddTripScreen() {
  const router = useRouter();

  const [tripName, setTripName] = useState("");
  const [location, setLocation] = useState("");
  const [photos, setPhotos] = useState([]);

  // --- PHOTO PICKER ---
  const pickPhotos = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      base64: true,
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!res.canceled) {
      const selected = res.assets.map(
        (item) => `data:image/jpeg;base64,${item.base64}`
      );
      setPhotos((prev) => [...prev, ...selected]);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.header}>Add New Trip</Text>

      {/* Trip Name */}
      <Text style={styles.label}>Trip Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Our Catalina Trip 2021"
        value={tripName}
        onChangeText={setTripName}
      />

      {/* Location */}
      <Text style={styles.label}>Location</Text>
      <View style={styles.locationInput}>
        <TextInput
          style={{ flex: 1 }}
          placeholder="Select a location"
          value={location}
          onChangeText={setLocation}
        />
        <Ionicons name="checkmark" size={20} color="#7CC540" />
      </View>

      {/* View Locations Button */}
      <TouchableOpacity
        style={styles.outlineBtn}
        onPress={() => router.push("/view-locations")}
      >
        <Text style={styles.outlineText}>View Locations</Text>
      </TouchableOpacity>

      {/* Add Photos Button → SAME STYLE */}
      <TouchableOpacity style={styles.outlineBtn} onPress={pickPhotos}>
        <Text style={styles.outlineText}>Add Photos</Text>
      </TouchableOpacity>

      {/* Preview Photos */}
      {photos.length > 0 && (
        <ScrollView horizontal style={{ marginTop: 10 }}>
          {photos.map((p, index) => (
            <Image key={index} source={{ uri: p }} style={styles.previewImg} />
          ))}
        </ScrollView>
      )}

      {/* Teammates */}
      <Text style={styles.label}>Teammates</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.teammateBox} />
        <View style={styles.teammateBox} />
        <View style={styles.teammateBox} />
      </ScrollView>

      <TouchableOpacity style={styles.outlineBtn}>
        <Text style={styles.outlineText}>Add New Teammates</Text>
      </TouchableOpacity>

      {/* Continue */}
      <TouchableOpacity style={styles.continueBtn}>
        <Text style={styles.continueText}>Continue</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    flex: 1,
  },

  header: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 25,
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

  locationInput: {
    flexDirection: "row",
    backgroundColor: "#F5F5F5",
    padding: 15,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 15,
  },

  outlineBtn: {
    borderWidth: 1,
    borderColor: "#7CC540",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
    alignSelf: "flex-start",
    marginBottom: 15,
  },

  outlineText: {
    color: "#7CC540",
    fontWeight: "600",
  },

  previewImg: {
    width: 70,
    height: 70,
    borderRadius: 12,
    marginRight: 10,
  },

  teammateBox: {
    width: 60,
    height: 60,
    backgroundColor: "#eee",
    borderRadius: 12,
    marginRight: 10,
  },

  continueBtn: {
    backgroundColor: "#7CC540",
    padding: 18,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 50,
  },

  continueText: {
    color: "white",
    fontSize: 17,
    fontWeight: "bold",
  },
});
