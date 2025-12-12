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
import propertiesData from "./properties.json";

export default function AddPlaceScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const user = useSelector((state) => state.user.userInfo);

  const [name, setName] = useState("");

  // READONLY GOOGLE FIELDS
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");

  const [description, setDescription] = useState("");
  const [properties, setProperties] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [location, setLocation] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const GOOGLE_GEOCODE_KEY = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;

  useEffect(() => {
    if (!location) return;

    const fetchReverseGeocode = async () => {
      try {
        const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.latitude},${location.longitude}&key=${GOOGLE_GEOCODE_KEY}`;

        const res = await fetch(url);
        const json = await res.json();

        if (!json.results || json.results.length === 0) {
          console.log("⚠ No geocode result");
          return;
        }

        const components = json.results[0].address_components;

        const get = (type) =>
          components.find((c) => c.types.includes(type))?.long_name || "";

        const _country = get("country");

        const _city =
          get("administrative_area_level_1") ||
          get("administrative_area_level_2") ||
          get("locality");

        const findDistrict = () => {
          const tryTypes = [
            "administrative_area_level_3",
            "administrative_area_level_2",
            "locality",
            "sublocality",
            "neighborhood",
          ];
          for (let t of tryTypes) {
            const v = components.find((c) => c.types.includes(t))?.long_name;
            if (v) return v;
          }
          return "";
        };

        const _district = findDistrict();

        if (_country) setCountry(_country);
        if (_city) setCity(_city);
        if (_district) setDistrict(_district);
      } catch (e) {
        console.log("REVERSE_GEOCODE_ERR:", e);
      }
    };

    fetchReverseGeocode();
  }, [location]);

  // -------------------------------------------
  // GET LOCATION FROM MAP SCREEN
  // -------------------------------------------
  useEffect(() => {
    if (!params.lat || !params.lng) return;

    const lat = Number(params.lat);
    const lng = Number(params.lng);

    if (!isNaN(lat) && !isNaN(lng)) {
      setLocation({ latitude: lat, longitude: lng });
    }
  }, [params.lat, params.lng]);

  // -------------------------------------------
  // PROPERTIES (FROM PARAMS)
  // -------------------------------------------
  useEffect(() => {
    if (typeof params.properties === "string") {
      try {
        const arr = JSON.parse(params.properties);
        if (Array.isArray(arr)) setProperties(arr);
      } catch {}
    }
  }, [params.properties]);

  // -------------------------------------------
  // PICK IMAGES
  // -------------------------------------------
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

  // -------------------------------------------
  // SUBMIT PLACE
  // -------------------------------------------
  const submitPlace = async () => {
    if (!name || !country || !city || !district) {
      alert("Fill all fields.");
      return;
    }

    if (!location) {
      alert("Select location from map.");
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
          country,
          city,
          district,
          description,
          properties,
          photos,
          location,
        }),
      });

      const data = await res.json();

      if (data?.success) router.push("/home");
      else alert("Error occurred");
    } catch (e) {
      console.log("SUBMIT_ERR:", e);
      alert("Error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            justifyContent: "center",
            marginTop: 50,
          }}
        >
          <TouchableOpacity
            style={styles.headerBack}
            onPress={() => router.push("/home")}
          >
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>

          <Text style={styles.header}>{i18n.t("addnewplace")}</Text>
        </View>
        {/* NAME */}
        <Text style={styles.label}>{i18n.t("name")}</Text>
        <TextInput
          style={styles.input}
          placeholder="Yer İsmi buraya yazılacak ..."
          value={name}
          onChangeText={setName}
          placeholderTextColor={"black"}
        />

        {/* SELECT LOCATION BUTTON */}
        <TouchableOpacity
          style={styles.outlineBtn}
          onPress={() => router.push("/MapSelectScreen")}
        >
          <Text style={styles.outlineText}>
            {location ? "Location ✓" : "Select Location"}
          </Text>
        </TouchableOpacity>

        {/* COUNTRY */}
        <Text style={styles.label}>Country</Text>
        <TextInput
          style={[styles.input, styles.disabledInput]}
          value={country}
          editable={false}
          selectTextOnFocus={false}
          placeholder="—"
          placeholderTextColor={"black"}
        />

        {/* CITY */}
        <Text style={styles.label}>City</Text>
        <TextInput
          style={[styles.input, styles.disabledInput]}
          value={city}
          editable={false}
          selectTextOnFocus={false}
          placeholder="—"
          placeholderTextColor={"black"}
        />

        {/* DISTRICT */}
        <Text style={styles.label}>District</Text>
        <TextInput
          style={[styles.input, styles.disabledInput]}
          value={district}
          editable={false}
          selectTextOnFocus={false}
          placeholder="—"
          placeholderTextColor={"black"}
        />

        {/* PROPERTIES */}
        <Text style={styles.label}>Properties</Text>
        <View style={styles.propertiesBox}>
          {propertiesData.properties.map((item, index) => {
            const active = properties.includes(item);
            return (
              <TouchableOpacity
                key={index}
                style={styles.propertyRow}
                onPress={() => {
                  if (active)
                    setProperties((prev) => prev.filter((p) => p !== item));
                  else setProperties((prev) => [...prev, item]);
                }}
              >
                <Ionicons
                  name={active ? "checkbox" : "square-outline"}
                  size={26}
                  color={active ? "#7CC540" : "#555"}
                />
                <Text style={styles.propertyLabel}>{i18n.t(item)}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* DESCRIPTION */}
        <Text style={styles.label}>{i18n.t("desc")}</Text>
        <TextInput
          style={[styles.input, { height: 100 }]}
          placeholder="Description..."
          placeholderTextColor={"black"}
          multiline
          value={description}
          onChangeText={setDescription}
        />

        {/* PHOTOS */}
        <TouchableOpacity style={styles.outlineBtn} onPress={pickPhotos}>
          <Text style={styles.outlineText}>Add Photos</Text>
        </TouchableOpacity>

        {photos.length > 0 && (
          <ScrollView horizontal style={{ marginTop: 10 }}>
            {photos.map((p, i) => (
              <Image key={i} source={{ uri: p }} style={styles.photo} />
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
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveText}>{i18n.t("submit")}</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  headerBack: { position: "absolute", top: 5, left: 20 },
  header: { fontSize: 22, fontWeight: "600", marginBottom: 20 },
  label: { marginTop: 10, marginBottom: 6, fontSize: 15 },

  input: {
    backgroundColor: "#f4f4f4",
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
  },

  disabledInput: {
    opacity: 0.6,
  },

  outlineBtn: {
    borderWidth: 1,
    borderColor: "#7CC540",
    padding: 12,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginBottom: 12,
  },

  outlineText: {
    color: "#7CC540",
    fontWeight: "600",
  },

  photo: {
    width: 70,
    height: 70,
    marginRight: 10,
    borderRadius: 10,
  },

  saveBtn: {
    backgroundColor: "#7CC540",
    padding: 16,
    borderRadius: 12,
    marginTop: 30,
    marginBottom: 50,
    alignItems: "center",
  },

  saveText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 17,
  },

  propertiesBox: {
    backgroundColor: "#f4f4f4",
    padding: 10,
    borderRadius: 12,
    marginBottom: 20,
  },

  propertyRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },

  propertyLabel: {
    marginLeft: 10,
    fontSize: 15,
    color: "#333",
  },
});
