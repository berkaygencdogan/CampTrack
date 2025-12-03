import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  FlatList,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

import MediaItem from "../../components/media/MediaItem";
import MediaOrderModal from "../../components/media/MediaOrderModal";

const SCREEN_WIDTH = Dimensions.get("window").width;

export default function EditPost() {
  const { id, owner, index } = useLocalSearchParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [caption, setCaption] = useState("");
  const [medias, setMedias] = useState([]);

  // --- MODAL ---
  const [orderVisible, setOrderVisible] = useState(false);
  const [startIndex, setStartIndex] = useState(0);

  useEffect(() => {
    const loadPost = async () => {
      try {
        const res = await axios.get(
          `${process.env.EXPO_PUBLIC_API_URL}/user/${owner}/gallery`
        );
        const posts = res.data.posts || [];
        const post = posts.find((p) => p.id == id);

        setCaption(post.caption || "");
        setMedias(post.medias || []);
      } catch (err) {
        console.log("EDIT FETCH ERROR:", err);
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, []);

  // -------------------------------
  // PICK MEDIA
  // -------------------------------
  const pickMedia = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos", "livePhotos"],
      quality: 0.8,
    });

    if (result.canceled) return;

    const file = result.assets[0];
    let fd = new FormData();

    fd.append("file", {
      uri: file.uri,
      name: file.type === "video" ? "video.mp4" : "photo.jpg",
      type: file.type === "video" ? "video/mp4" : "image/jpeg",
    });

    fd.append("userId", owner);
    fd.append("isVideo", file.type === "video" ? "true" : "false");

    const upload = await axios.post(
      `${process.env.EXPO_PUBLIC_API_URL}/uploadMediaStream`,
      fd,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    setMedias((prev) => [
      ...prev,
      { url: upload.data.url, type: file.type === "video" ? "video" : "image" },
    ]);
  };

  // -------------------------------
  // SAVE
  // -------------------------------
  const saveChanges = async () => {
    setSaving(true);

    try {
      await axios.put(
        `${process.env.EXPO_PUBLIC_API_URL}/post/${id}/edit?owner=${owner}`,
        { caption, medias }
      );

      router.replace(`/post/${owner}/${index}?refresh=1`);
    } catch (err) {
      console.log("SAVE ERROR:", err);
      alert("Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );

  return (
    <View style={styles.container}>
      {/* ---------- HEADER ---------- */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.cancel}>Cancel</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Edit Post</Text>

        <TouchableOpacity onPress={saveChanges} disabled={saving}>
          <Text style={[styles.save, saving && { opacity: 0.4 }]}>Save</Text>
        </TouchableOpacity>
      </View>

      {/* ---------- MEDIA CAROUSEL ---------- */}
      <FlatList
        data={medias}
        horizontal
        pagingEnabled
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item, index }) => (
          <View style={{ width: SCREEN_WIDTH }}>
            <MediaItem
              item={item}
              index={index}
              onDelete={(i) =>
                setMedias((prev) => prev.filter((_, idx) => idx !== i))
              }
              onOpenOrder={(i) => {
                setStartIndex(i);
                setOrderVisible(true);
              }}
            />
          </View>
        )}
      />

      {/* ---------- ADD MEDIA ---------- */}
      <TouchableOpacity style={styles.addBtn} onPress={pickMedia}>
        <Ionicons name="add-circle" size={30} color="#007AFF" />
        <Text style={styles.addText}>Add Media</Text>
      </TouchableOpacity>

      {/* ---------- CAPTION ---------- */}
      <TextInput
        value={caption}
        onChangeText={setCaption}
        style={styles.caption}
        placeholder="Edit caption..."
        multiline
      />

      {/* ---------- ORDER MODAL ---------- */}
      <MediaOrderModal
        visible={orderVisible}
        medias={medias}
        startIndex={startIndex}
        setMedias={setMedias}
        onClose={() => setOrderVisible(false)}
        onSave={() => setOrderVisible(false)}
      />
    </View>
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
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 50,
    paddingHorizontal: 15,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  cancel: { fontSize: 16, color: "#444" },
  title: { fontSize: 18, fontWeight: "700" },
  save: { fontSize: 16, fontWeight: "700", color: "#007AFF" },

  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
  },

  addText: { marginLeft: 8, fontSize: 16, color: "#007AFF" },

  caption: {
    padding: 15,
    fontSize: 16,
    minHeight: 120,
  },
});
