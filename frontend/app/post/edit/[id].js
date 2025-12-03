// app/post/edit/[id].js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Dimensions,
} from "react-native";

import * as ImagePicker from "expo-image-picker";
import { VideoView, useVideoPlayer } from "expo-video";
import DraggableFlatList from "react-native-draggable-flatlist";

import Ionicons from "@expo/vector-icons/Ionicons";
import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSelector } from "react-redux";

const SCREEN_WIDTH = Dimensions.get("window").width;

/* --------------------------------------------------
   VIDEO COMPONENT (Hook burada!)
-------------------------------------------------- */
function RenderVideo({ url }) {
  const player = useVideoPlayer(url, (player) => {
    player.loop = true;
    player.play();
  });

  return (
    <VideoView
      style={styles.mediaImg}
      player={player}
      fullscreenOptions={{ enabled: true }}
      pictureInPictureOptions={{ enabled: true }}
      contentFit="cover"
    />
  );
}

/* --------------------------------------------------
   MEDIA ITEM (Hook yok!)
-------------------------------------------------- */
function MediaItem({ item, index, drag, onDelete }) {
  if (item.type === "image") {
    return (
      <TouchableOpacity onLongPress={drag} activeOpacity={1}>
        <View style={styles.mediaBox}>
          <Image
            source={{ uri: item.url }}
            style={styles.mediaImg}
            resizeMode="cover"
          />

          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={() => onDelete(index)}
          >
            <Ionicons name="trash" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity onLongPress={drag} activeOpacity={1}>
      <View style={styles.mediaBox}>
        <RenderVideo url={item.url} />

        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => onDelete(index)}
        >
          <Ionicons name="trash" size={22} color="#fff" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

/* --------------------------------------------------
   MAIN SCREEN
-------------------------------------------------- */
export default function EditPost() {
  const { id, owner } = useLocalSearchParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [caption, setCaption] = useState("");
  const [medias, setMedias] = useState([]);

  /* ---------------- FETCH POST ------------------ */
  useEffect(() => {
    const loadPost = async () => {
      try {
        const res = await axios.get(
          `${process.env.EXPO_PUBLIC_API_URL}/user/${owner}/gallery`
        );

        const posts = res.data.posts || [];
        const post = posts.find((p) => p.id == id);

        if (!post) {
          alert("Post not found");
          router.back();
          return;
        }

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

  /* ---------------- PICK MEDIA ------------------ */
  const pickMedia = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 0.8,
    });

    if (result.canceled) return;

    await uploadMedia(result.assets[0]);
  };

  const uploadMedia = async (file) => {
    try {
      let formData = new FormData();

      formData.append("file", {
        uri: file.uri,
        name: file.type === "video" ? "video.mp4" : "photo.jpg",
        type: file.type === "video" ? "video/mp4" : "image/jpeg",
      });

      formData.append("userId", owner);
      formData.append("isVideo", file.type === "video" ? "true" : "false");

      const res = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/uploadMediaStream`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const newMedia = {
        url: res.data.url,
        type: file.type === "video" ? "video" : "image",
      };

      setMedias((prev) => [...prev, newMedia]);
    } catch (err) {
      console.log("UPLOAD ERR:", err);
      alert("Upload error");
    }
  };

  /* ---------------- REMOVE MEDIA ------------------ */
  const removeMedia = (index) => {
    setMedias((prev) => prev.filter((_, i) => i !== index));
  };

  /* ---------------- SAVE ------------------ */
  const saveChanges = async () => {
    setSaving(true);

    try {
      await axios.put(
        `${process.env.EXPO_PUBLIC_API_URL}/post/${id}/edit?owner=${owner}`,
        { caption, medias }
      );

      router.back();
    } catch (err) {
      console.log("SAVE ERROR:", err);
      alert("Save failed");
    } finally {
      setSaving(false);
    }
  };

  /* ---------------- LOADING ------------------ */
  if (loading)
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );

  /* ---------------- RENDER ------------------ */
  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.cancel}>Cancel</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Edit Post</Text>

        <TouchableOpacity disabled={saving} onPress={saveChanges}>
          <Text style={[styles.save, saving && { opacity: 0.4 }]}>Save</Text>
        </TouchableOpacity>
      </View>

      {/* DRAGGABLE LIST */}
      <DraggableFlatList
        data={medias}
        horizontal
        pagingEnabled
        keyExtractor={(_, i) => i.toString()}
        onDragEnd={({ data }) => setMedias(data)}
        renderItem={({ item, index, drag }) => (
          <MediaItem
            item={item}
            index={index}
            drag={drag}
            onDelete={removeMedia}
          />
        )}
      />

      {/* ADD MEDIA */}
      <TouchableOpacity style={styles.addBtn} onPress={pickMedia}>
        <Ionicons name="add-circle" size={32} color="#007AFF" />
        <Text style={styles.addText}>Add Media</Text>
      </TouchableOpacity>

      {/* CAPTION */}
      <TextInput
        style={styles.caption}
        placeholder="Edit caption..."
        value={caption}
        onChangeText={setCaption}
        multiline
      />
    </View>
  );
}

/* --------------------------------------------------
   STYLES
-------------------------------------------------- */
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

  mediaBox: { width: SCREEN_WIDTH, height: 360 },

  mediaImg: {
    width: SCREEN_WIDTH,
    height: 360,
    backgroundColor: "#000",
    resizeMode: "cover",
  },

  deleteBtn: {
    position: "absolute",
    right: 15,
    top: 15,
    padding: 6,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 8,
  },

  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
    paddingHorizontal: 15,
  },

  addText: { marginLeft: 8, fontSize: 16, color: "#007AFF" },

  caption: {
    padding: 15,
    fontSize: 16,
  },
});
