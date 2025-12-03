import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Dimensions,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import axios from "axios";

const { width } = Dimensions.get("window");

export default function UserGallery() {
  const { userId } = useLocalSearchParams();
  const router = useRouter();

  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGallery = async () => {
      try {
        const res = await axios.get(
          `${process.env.EXPO_PUBLIC_API_URL}/user/${userId}/gallery`
        );
        setGallery(res.data.posts || []);
      } catch (err) {
        console.log("GALLERY FETCH ERROR:", err);
      } finally {
        setLoading(false);
      }
    };

    loadGallery();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator size="large" color="#3D7AFF" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Gallery</Text>

      <View style={styles.gridWrapper}>
        {gallery.length === 0 ? (
          <Text style={styles.empty}>No posts yet.</Text>
        ) : (
          gallery.map((post, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => router.push(`/post/${userId}/${index}`)}
            >
              <Image source={{ uri: post.imageUrl }} style={styles.gridItem} />
            </TouchableOpacity>
          ))
        )}
      </View>

      <View style={{ height: 50 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  loadingScreen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  header: {
    fontSize: 24,
    fontWeight: "700",
    padding: 20,
  },

  gridWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 12,
  },

  gridItem: {
    width: (width - 48) / 3,
    height: (width - 48) / 3,
    margin: 5,
    borderRadius: 12,
    backgroundColor: "#eee",
  },

  empty: {
    width: "100%",
    textAlign: "center",
    marginTop: 30,
    color: "#888",
  },
});
