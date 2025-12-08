import * as Location from "expo-location";
import { AppleMaps, GoogleMaps } from "expo-maps";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useImage } from "expo-image";

export default function MapSelectScreen() {
  const router = useRouter();
  const [userLocation, setUserLocation] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [allPlaces, setAllPlaces] = useState([]);
  const userIcon = useImage(require("../src/assets/images/human.png"));
  const tentIcon = useImage(require("../src/assets/images/tent.png"));

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      const loc = await Location.getCurrentPositionAsync({});

      const userLoc = {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      };

      setUserLocation(userLoc);
      setSelectedLocation(userLoc);
    })();
  }, []);

  useEffect(() => {
    fetch(`${process.env.EXPO_PUBLIC_API_URL}/places/all`)
      .then((res) => res.json())
      .then((data) => setAllPlaces(data.places || []))
      .catch((err) => console.log("ALL_PLACES_ERR:", err));
  }, []);

  const confirmLocation = () => {
    if (!selectedLocation) {
      alert("Konum seçilmedi!");
      return;
    }

    router.push({
      pathname: "/AddPlaceScreen",
      params: {
        lat: selectedLocation.latitude,
        lng: selectedLocation.longitude,
      },
    });
  };

  if (!userLocation) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Konum alınıyor...</Text>
      </View>
    );
  }

  const MapComponent =
    Platform.OS === "android" ? GoogleMaps.View : AppleMaps.View;

  return (
    <View style={{ flex: 1 }}>
      <MapComponent
        style={{ flex: 1 }}
        cameraPosition={{
          coordinates: selectedLocation || userLocation,
          zoom: selectedLocation ? 15 : 13,
        }}
        // ⚡ En stabil çalışan event bu
        onMapLongClick={(e) => {
          const c = e?.coordinates;

          if (c) {
            setSelectedLocation({
              latitude: c.latitude,
              longitude: c.longitude,
            });
          }
        }}
        onMarkerClick={(marker) => {
          if (marker?.coordinates) {
            setSelectedLocation(marker.coordinates);
          }
        }}
        markers={[
          {
            id: "user-location",
            coordinates: userLocation,
            title: "Konumum",
            icon: userIcon,
            anchor: { x: 0.5, y: 1 },
          },
          ...(selectedLocation
            ? [
                {
                  id: "selected-location",
                  coordinates: selectedLocation,
                  title: "Seçilen Konum",
                  icon: userIcon,
                  anchor: { x: 0.5, y: 1 },
                },
              ]
            : []),
          ...allPlaces.map((p) => ({
            id: String(p.id),
            coordinates: { latitude: p.latitude, longitude: p.longitude },
            title: p.name,
            icon: tentIcon,
            anchor: { x: 0.5, y: 1 },
          })),
        ]}
      />
      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          Bir konum seçmek için haritaya uzun basın
        </Text>
      </View>

      <TouchableOpacity style={styles.confirmBtn} onPress={confirmLocation}>
        <Text style={styles.confirmText}>Konumu Onayla</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  confirmBtn: {
    position: "absolute",
    bottom: 40,
    left: 20,
    width: "45%",
    padding: 15,
    backgroundColor: "#7CC540",
    borderRadius: 14,
    alignItems: "center",
  },

  confirmText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },
  infoBox: {
    position: "absolute",
    top: 40,
    left: 20,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.7)",
    padding: 12,
    borderRadius: 10,
    zIndex: 99,
  },
  infoText: {
    color: "#fff",
    fontSize: 14,
    textAlign: "center",
  },
});
