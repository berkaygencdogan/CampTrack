import { useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import DraggableFlatList from "react-native-draggable-flatlist";
import { useSelector } from "react-redux";

import MediaItem from "../components/media/MediaItem";
import UploadProgress from "../components/media/UploadProgress";

const SCREEN_WIDTH = Dimensions.get("window").width;

export default function NewPost() {
  const myUser = useSelector((state) => state.user?.userInfo);
  const router = useRouter();

  const [caption, setCaption] = useState("");
  const [medias, setMedias] = useState([]);

  // UPLOAD PROGRESS
  const [uploading, setUploading] = useState(false);
  const [uploadTotal, setUploadTotal] = useState(0);
  const [uploadCurrent, setUploadCurrent] = useState(0);
  const [showOrder, setShowOrder] = useState(false);

  const [saving, setSaving] = useState(false);

  /* -----------------------------
     MEDIA PICKER → MULTI
  ----------------------------- */
  const pickMedia = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (result.canceled) return;

    const selected = result.assets;
    setUploadTotal(selected.length);
    setUploadCurrent(0);
    setUploading(true);

    for (const file of selected) {
      await uploadMedia(file);
    }

    setUploading(false);
  };

  const openOrderModal = () => {
    setShowOrder(true);
  };
  /* -----------------------------
     UPLOAD BINARY TO BACKEND
  ----------------------------- */
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

      setUploadCurrent((prev) => prev + 1);
    } catch (err) {
      console.log("UPLOAD ERR:", err);
      alert("Upload error");
    }
  };

  /* -----------------------------
     DELETE
  ----------------------------- */
  const removeMedia = (index) => {
    setMedias((prev) => prev.filter((_, i) => i !== index));
  };

  /* -----------------------------
     CREATE POST
  ----------------------------- */
  const handleShare = async () => {
    if (medias.length === 0) return alert("Please select at least 1 media.");

    setSaving(true);

    try {
      await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/post/new`, {
        userId: myUser.id,
        caption,
        medias,
      });

      router.back();
    } catch (err) {
      console.log("POST ERROR:", err);
      alert("Post create failed");
    } finally {
      setSaving(false);
    }
  };

  /* -----------------------------
     RENDER
  ----------------------------- */
  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.cancel}>Cancel</Text>
        </TouchableOpacity>

        <Text style={styles.title}>New Post</Text>

        <TouchableOpacity disabled={saving} onPress={handleShare}>
          <Text style={[styles.share, saving && { opacity: 0.4 }]}>Share</Text>
        </TouchableOpacity>
      </View>

      {/* LIST */}
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
            onOpenOrder={openOrderModal}
          />
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

      {/* UPLOAD PROGRESS OVERLAY */}
      <UploadProgress
        visible={uploading}
        current={uploadCurrent}
        total={uploadTotal}
      />
    </View>
  );
}

/* -----------------------------
   STYLES
----------------------------- */
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

  addMore: { flexDirection: "row", padding: 15, alignItems: "center" },
  addMoreText: { marginLeft: 6, fontSize: 16, color: "#007AFF" },

  caption: {
    padding: 15,
    fontSize: 16,
    minHeight: 120,
  },
});
