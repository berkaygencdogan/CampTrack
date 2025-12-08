import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Image,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";

export default function MapSelectScreen() {
  const router = useRouter();

  const [userLocation, setUserLocation] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [allPlaces, setAllPlaces] = useState([]);

  const [searchText, setSearchText] = useState("");
  const [googleResults, setGoogleResults] = useState([]);
  const [loadingResults, setLoadingResults] = useState(false);

  // ---------------------------------------------------------
  // 📌 Konum izni + kullanıcı konumu
  // ---------------------------------------------------------
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return alert("Konum izni gerekiyor.");

      const loc = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
    })();
  }, []);

  // ---------------------------------------------------------
  // 📌 Backend'den kamp yerleri çek
  // ---------------------------------------------------------
  useEffect(() => {
    fetch(`${process.env.EXPO_PUBLIC_API_URL}/places/all`)
      .then((res) => res.json())
      .then((data) => setAllPlaces(data.places || []))
      .catch((err) => console.log("ALL_PLACES_ERR:", err));
  }, []);

  // ---------------------------------------------------------
  // 📌 Google autocomplete
  // ---------------------------------------------------------
  useEffect(() => {
    if (searchText.length < 2) {
      setGoogleResults([]);
      return;
    }

    const fetchResults = async () => {
      try {
        setLoadingResults(true);

        const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${searchText}&key=${process.env.EXPO_PUBLIC_GOOGLE_API}`;
        const res = await fetch(url);
        const json = await res.json();

        setGoogleResults(json.predictions || []);
      } catch (err) {
        console.log("SEARCH_ERR:", err);
      } finally {
        setLoadingResults(false);
      }
    };

    fetchResults();
  }, [searchText]);

  // ---------------------------------------------------------
  // 📌 Place Details → koordinat al
  // ---------------------------------------------------------
  const fetchPlaceDetails = async (placeId) => {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${process.env.EXPO_PUBLIC_GOOGLE_API}`;
    const res = await fetch(url);
    const json = await res.json();

    const loc = json?.result?.geometry?.location;
    if (!loc) return;

    setSelectedLocation({
      latitude: loc.lat,
      longitude: loc.lng,
    });
  };

  // ---------------------------------------------------------
  // 📌 Konumu AddPlaceScreen'e gönder
  // ---------------------------------------------------------
  const confirmLocation = () => {
    if (!selectedLocation) return alert("Konum seç.");

    router.push({
      pathname: "/add-place",
      params: {
        lat: selectedLocation.latitude,
        lng: selectedLocation.longitude,
      },
    });
  };

  // ---------------------------------------------------------
  // 📌 Kullanıcı konumu yoksa loading
  // ---------------------------------------------------------
  if (!userLocation)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Konum alınıyor...</Text>
      </View>
    );

  return (
    <View style={{ flex: 1 }}>
      {/* ------------------------------------------------- */}
      {/* 🔍 Arama Barı */}
      {/* ------------------------------------------------- */}
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color="#888" />
        <TextInput
          placeholder="Yer ara..."
          style={styles.searchInput}
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {/* ------------------------------------------------- */}
      {/* 🗺️ HARİTA */}
      {/* ------------------------------------------------- */}
      <MapView
        provider={PROVIDER_GOOGLE}
        style={{ flex: 1 }}
        initialRegion={{
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        onPress={(e) => setSelectedLocation(e.nativeEvent.coordinate)}
      >
        {/* Kullanıcı Konumu */}
        <Marker
          coordinate={userLocation}
          title="Konumum"
          anchor={{ x: 0.5, y: 1 }}
        >
          <Image
            source={require("../src/assets/images/human.png")}
            style={{ width: 35, height: 35 }}
          />
        </Marker>

        {/* Seçilen Konum */}
        {selectedLocation && (
          <Marker
            coordinate={selectedLocation}
            title="Seçilen Konum"
            pinColor="#7CC540"
          />
        )}

        {/* Kamp Yerleri */}
        {allPlaces.map((p) => (
          <Marker
            key={p.id}
            coordinate={{ latitude: p.lat, longitude: p.lng }}
            title={p.name}
            anchor={{ x: 0.5, y: 1 }}
          >
            <Image
              source={require("../src/assets/images/tent.png")}
              style={{ width: 32, height: 32 }}
            />
          </Marker>
        ))}
      </MapView>

      {/* ------------------------------------------------- */}
      {/* 📜 Arama Sonuçları */}
      {/* ------------------------------------------------- */}
      {searchText.length > 1 && (
        <View style={styles.resultPanel}>
          {loadingResults ? (
            <ActivityIndicator />
          ) : (
            <FlatList
              data={googleResults}
              keyExtractor={(item) => item.place_id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.resultItem}
                  onPress={() => fetchPlaceDetails(item.place_id)}
                >
                  <Ionicons name="location" size={20} color="#444" />
                  <Text style={styles.resultText}>{item.description}</Text>
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      )}

      {/* ------------------------------------------------- */}
      {/* ✔ KONUMU ONAYLA */}
      {/* ------------------------------------------------- */}
      <TouchableOpacity style={styles.confirmBtn} onPress={confirmLocation}>
        <Text style={styles.confirmText}>Konumu Onayla</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  searchBar: {
    position: "absolute",
    top: 50,
    left: 15,
    right: 15,
    zIndex: 10,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    elevation: 5,
  },
  searchInput: { marginLeft: 10, fontSize: 16 },

  resultPanel: {
    position: "absolute",
    top: 110,
    left: 15,
    right: 15,
    maxHeight: 260,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 8,
    elevation: 5,
    zIndex: 15,
  },
  resultItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
  },
  resultText: { marginLeft: 10, fontSize: 15 },

  confirmBtn: {
    position: "absolute",
    bottom: 40,
    left: 40,
    right: 40,
    padding: 15,
    backgroundColor: "#7CC540",
    borderRadius: 14,
    alignItems: "center",
  },
  confirmText: { color: "#fff", fontSize: 17, fontWeight: "600" },
});
