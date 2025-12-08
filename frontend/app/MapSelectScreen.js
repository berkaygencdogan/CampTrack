import Ionicons from "@expo/vector-icons/Ionicons";
import * as Location from "expo-location";
import { AppleMaps, GoogleMaps } from "expo-maps";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function MapSelectScreen() {
  const router = useRouter();
  const [userLocation, setUserLocation] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [allPlaces, setAllPlaces] = useState([]);

  const [searchText, setSearchText] = useState("");
  const [googleResults, setGoogleResults] = useState([]);
  const [loadingResults, setLoadingResults] = useState(false);

  // ---------------------------------------------------------
  // 📌 1) Kullanıcı Konumu Alma
  // ---------------------------------------------------------
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      const loc = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
    })();
  }, []);

  // ---------------------------------------------------------
  // 📌 2) Backend'den kamp yerleri çek
  // ---------------------------------------------------------
  useEffect(() => {
    fetch(`${process.env.EXPO_PUBLIC_API_URL}/places/all`)
      .then((res) => res.json())
      .then((data) => setAllPlaces(data.places || []))
      .catch((err) => console.log("ALL_PLACES_ERR:", err));
  }, []);

  console.log("harita", allPlaces);

  // ---------------------------------------------------------
  // 📌 3) Google Places Autocomplete
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
  // 📌 4) Google place ID → koordinat
  // ---------------------------------------------------------
  const fetchPlaceDetails = async (placeId) => {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${process.env.EXPO_PUBLIC_GOOGLE_API}`;

    const res = await fetch(url);
    const json = await res.json();

    const loc = json?.result?.geometry?.location;
    if (!loc) return;

    const coords = {
      latitude: loc.lat,
      longitude: loc.lng,
    };

    setSelectedLocation(coords);
  };

  // ---------------------------------------------------------
  // 📌 5) Konumu AddPlaceScreen'e geri gönder
  // ---------------------------------------------------------
  const confirmLocation = () => {
    if (!selectedLocation) {
      alert("Lütfen bir konum seç.");
      return;
    }

    router.push({
      pathname: "/add-place",
      params: {
        lat: selectedLocation.latitude,
        lng: selectedLocation.longitude,
      },
    });
  };

  if (!userLocation)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Konum alınıyor...</Text>
      </View>
    );

  const MapComponent =
    Platform.OS === "android" ? GoogleMaps.View : AppleMaps.View;

  return (
    <View style={{ flex: 1 }}>
      {/* ------------------------------------------------- */}
      {/* 🔍 Arama Barı (Floating Top) */}
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
      {/* 🗺️ Harita */}
      {/* ------------------------------------------------- */}
      <MapComponent
        style={{ flex: 1 }}
        cameraPosition={{
          coordinates: selectedLocation || userLocation,
          zoom: selectedLocation ? 15 : 13,
        }}
        onMapClick={(e) => setSelectedLocation(e.coordinates)}
        markers={[
          // Kullanıcı konumu
          {
            coordinates: userLocation,
            title: "Konumum",
          },
          // Seçilen konum
          ...(selectedLocation
            ? [
                {
                  coordinates: selectedLocation,
                  title: "Seçilen Konum",
                },
              ]
            : []),

          // Kamp yerleri
          ...allPlaces.map((p) => ({
            id: p.id,
            coordinates: { latitude: p.latitude, longitude: p.longitude },
            title: p.name,
          })),
        ]}
      />

      {/* ------------------------------------------------- */}
      {/* 📄 Google Search Result List */}
      {/* ------------------------------------------------- */}
      {searchText.length > 1 && (
        <View style={styles.resultPanel}>
          {loadingResults ? (
            <ActivityIndicator />
          ) : (
            <FlatList
              data={googleResults}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.resultItem}
                  onPress={() => fetchPlaceDetails(item.place_id)}
                >
                  <Ionicons name="location" size={20} color="#444" />
                  <Text style={styles.resultText}>{item.description}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.place_id}
            />
          )}
        </View>
      )}

      {/* ------------------------------------------------- */}
      {/* ✔ CONFIRM BUTTON */}
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
    shadowColor: "#000",
  },
  searchInput: {
    marginLeft: 10,
    fontSize: 16,
  },

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
