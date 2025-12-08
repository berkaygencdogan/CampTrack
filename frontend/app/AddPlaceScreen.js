import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useSelector } from "react-redux";
import i18n from "./language/index";

export default function AddPlaceScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [description, setDescription] = useState("");
  const [photos, setPhotos] = useState([]);
  const [location, setLocation] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const user = useSelector((state) => state.user.userInfo);

  // 🔥 MapSelectScreen’den gelen koordinatı yakala
  useEffect(() => {
    if (params.lat && params.lng) {
      setLocation({
        latitude: Number(params.lat),
        longitude: Number(params.lng),
      });
    }
  }, [params]);

  // ---------------------------------------
  // PHOTO PICKER
  // ---------------------------------------
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

  // ---------------------------------------
  // SUBMIT PLACE
  // ---------------------------------------
  const submitPlace = async () => {
    if (!name || !city || photos.length === 0) {
      alert("Name, city and at least one photo are required.");
      return;
    }
    if (!location) {
      alert("Please select a location.");
      return;
    }

    try {
      setIsSubmitting(true);

      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/places/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          name,
          city,
          description,
          photos,
          location,
        }),
      });

      const data = await res.json();

      if (data) {
        alert("Place submitted!");
        router.push("/home");
      } else {
        alert("Error occurred.");
      }
    } catch (e) {
      alert("Error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* HEADER */}
        <TouchableOpacity
          style={{
            width: "100%",
            flexDirection: "row",
            justifyContent: "center",
            top: 20,
          }}
          onPress={() => router.back()}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color="black"
            style={{
              position: "absolute",
              left: 20,
              top: 5,
              zIndex: 999,
            }}
          />
          <Text style={styles.header}>{i18n.t("addnewplace")}</Text>
        </TouchableOpacity>

        {/* NAME */}
        <Text style={styles.label}>{i18n.t("name")}</Text>
        <TextInput
          style={styles.input}
          placeholder="Kelebekler Vadisi"
          value={name}
          onChangeText={setName}
        />

        {/* CITY */}
        <Text style={styles.label}>{i18n.t("city")}</Text>
        <TextInput
          style={styles.input}
          placeholder="Muğla"
          value={city}
          onChangeText={setCity}
        />

        {/* DESCRIPTION */}
        <Text style={styles.label}>{i18n.t("desc")}</Text>
        <TextInput
          style={[styles.input, { height: 100 }]}
          placeholder="Write description..."
          multiline
          value={description}
          onChangeText={setDescription}
        />

        {/* LOCATION */}
        <Text style={styles.label}>{i18n.t("location")}</Text>

        <TouchableOpacity
          style={styles.outlineBtn}
          onPress={() => router.push("/MapSelectScreen")}
        >
          <Text style={styles.outlineText}>
            {location ? "Location Selected ✓" : "Select Location (Map)"}
          </Text>
        </TouchableOpacity>

        {/* PHOTOS */}
        <Text style={styles.label}>{i18n.t("photos")}</Text>

        <TouchableOpacity style={styles.outlineBtn} onPress={pickPhotos}>
          <Text style={styles.outlineText}>{i18n.t("addphotos")}</Text>
        </TouchableOpacity>

        {photos.length > 0 && (
          <ScrollView horizontal style={{ marginTop: 10 }}>
            {photos.map((p, index) => (
              <Image
                key={index}
                source={{ uri: p }}
                style={styles.previewImg}
              />
            ))}
          </ScrollView>
        )}

        {/* SUBMIT */}
        <TouchableOpacity
          style={styles.saveBtn}
          onPress={submitPlace}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator />
          ) : (
            <Text style={styles.saveText}>{i18n.t("submit")}</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#fff", flex: 1 },

  header: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 25,
  },

  label: { marginTop: 10, marginBottom: 6, fontSize: 15, fontWeight: "500" },

  input: {
    backgroundColor: "#F5F5F5",
    padding: 15,
    borderRadius: 14,
    fontSize: 16,
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

  outlineText: { color: "#7CC540", fontWeight: "600" },

  previewImg: {
    width: 70,
    height: 70,
    borderRadius: 12,
    marginRight: 10,
  },

  saveBtn: {
    backgroundColor: "#7CC540",
    padding: 18,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 30,
    marginBottom: 50,
  },

  saveText: { color: "white", fontSize: 17, fontWeight: "bold" },
});
