import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  FlatList,
  Dimensions,
  Image,
  ActivityIndicator,
} from "react-native";

import * as ImagePicker from "expo-image-picker";
import { useVideoPlayer, VideoView } from "expo-video";
import Ionicons from "@expo/vector-icons/Ionicons";
import axios from "axios";
import { useRouter } from "expo-router";
import { useSelector } from "react-redux";

const SCREEN_WIDTH = Dimensions.get("window").width;

// -------------------------------------------------------------
// 🔥 Her video için ayrı player component
// -------------------------------------------------------------
function RenderVideo({ url }) {
  const player = useVideoPlayer(url, (player) => {
    player.loop = true;
    player.play();
  });

  return (
    <VideoView
      style={styles.media}
      player={player}
      fullscreenOptions={{ enabled: true }}
      pictureInPictureOptions={{ enabled: true }}
    />
  );
}

export default function NewPost() {
  const router = useRouter();
  const myUser = useSelector((state) => state.user?.userInfo);

  const [caption, setCaption] = useState("");
  const [medias, setMedias] = useState([]);
  const [loading, setLoading] = useState(false);

  // ---------------------------------------------------------
  // Media Picker
  // ---------------------------------------------------------
  const pickMedia = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "livePhotos", "videos"],
      allowsMultipleSelection: true,
      selectionLimit: 10,
      quality: 0.8,
    });

    if (result.canceled) return;

    const selected = result.assets;
    for (const file of selected) {
      await uploadMedia(file);
    }
  };

  // ---------------------------------------------------------
  // Upload to Backend
  // ---------------------------------------------------------
  const uploadMedia = async (file) => {
    try {
      let formData = new FormData();

      formData.append("file", {
        uri: file.uri,
        name: file.type === "video" ? "video.mp4" : "photo.jpg",
        type: file.type === "video" ? "video/mp4" : "image/jpeg",
      });

      formData.append("userId", myUser.id);
      formData.append("isVideo", file.type === "video" ? "true" : "false");

      const res = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/uploadMediaStream`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setMedias((prev) => [
        ...prev,
        { url: res.data.url, type: file.type === "video" ? "video" : "image" },
      ]);
    } catch (err) {
      console.log("UPLOAD ERR:", err);
      alert("Upload error");
    }
  };

  // ---------------------------------------------------------
  // Remove Media
  // ---------------------------------------------------------
  const removeMedia = (index) => {
    setMedias((prev) => prev.filter((_, i) => i !== index));
  };

  // ---------------------------------------------------------
  // Create Post
  // ---------------------------------------------------------
  const handleShare = async () => {
    if (medias.length === 0) return alert("Please select media.");

    setLoading(true);

    try {
      await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/post/new`, {
        userId: myUser.id,
        caption,
        medias,
      });

      router.back();
    } catch (err) {
      console.log("POST ERROR:", err);
      alert("Post error");
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------
  return (
    <ScrollView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.cancel}>Cancel</Text>
        </TouchableOpacity>

        <Text style={styles.title}>New Post</Text>

        <TouchableOpacity onPress={handleShare} disabled={loading}>
          <Text style={[styles.share, loading && { opacity: 0.4 }]}>Share</Text>
        </TouchableOpacity>
      </View>

      {/* MEDIA CAROUSEL */}
      <FlatList
        horizontal
        pagingEnabled
        data={medias}
        keyExtractor={(_, i) => i.toString()}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <View style={styles.mediaBox}>
            {item.type === "image" ? (
              <Image source={{ uri: item.url }} style={styles.media} />
            ) : (
              <RenderVideo url={item.url} />
            )}

            {/* DELETE BUTTON */}
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => removeMedia(index)}
            >
              <Ionicons name="trash" color="#fff" size={22} />
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <TouchableOpacity style={styles.emptyBox} onPress={pickMedia}>
            <Ionicons name="add" size={50} color="#aaa" />
            <Text style={{ color: "#aaa", marginTop: 8 }}>
              Add photo or video
            </Text>
          </TouchableOpacity>
        }
      />

      {/* ADD MORE */}
      {medias.length > 0 && (
        <TouchableOpacity style={styles.addMore} onPress={pickMedia}>
          <Ionicons name="add-circle" size={30} color="#007AFF" />
          <Text style={styles.addMoreText}>Add More</Text>
        </TouchableOpacity>
      )}

      {/* CAPTION */}
      <TextInput
        placeholder="Write a caption..."
        style={styles.caption}
        multiline
        value={caption}
        onChangeText={setCaption}
      />

      {loading && (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      )}
    </ScrollView>
  );
}

// -------------------------------------------------------------
// STYLES
// -------------------------------------------------------------
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 50,
    paddingHorizontal: 15,
    paddingBottom: 12,
  },
  cancel: { fontSize: 16, color: "#444" },
  title: { fontSize: 18, fontWeight: "700" },
  share: { fontSize: 16, fontWeight: "700", color: "#007AFF" },

  emptyBox: {
    width: SCREEN_WIDTH,
    height: 360,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
  },

  mediaBox: {
    width: SCREEN_WIDTH,
    height: 360,
  },
  media: {
    width: "100%",
    height: "100%",
    backgroundColor: "#000",
  },
  deleteBtn: {
    position: "absolute",
    right: 15,
    top: 15,
    padding: 6,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 8,
  },

  addMore: {
    flexDirection: "row",
    padding: 15,
    alignItems: "center",
  },
  addMoreText: { marginLeft: 6, fontSize: 16, color: "#007AFF" },

  caption: {
    padding: 15,
    fontSize: 16,
    minHeight: 120,
  },

  loading: { marginTop: 20, alignItems: "center" },
});
