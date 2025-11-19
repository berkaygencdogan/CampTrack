import { useRouter, useLocalSearchParams } from "expo-router";
import MapView, { Marker } from "expo-maps";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function MapViewScreen() {
  const router = useRouter();
  const { lat, lng, name } = useLocalSearchParams();

  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity
        style={{
          position: "absolute",
          zIndex: 10,
          top: 40,
          left: 20,
          backgroundColor: "#fff",
          padding: 8,
          borderRadius: 8,
        }}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: parseFloat(lat),
          longitude: parseFloat(lng),
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker
          coordinate={{
            latitude: parseFloat(lat),
            longitude: parseFloat(lng),
          }}
          title={name}
        />
      </MapView>
    </View>
  );
}
