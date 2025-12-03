// app/profile/edit.js
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { setAuthData } from "../../redux/userSlice";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function EditProfile() {
  const router = useRouter();
  const dispatch = useDispatch();

  const user = useSelector((s) => s.user.userInfo);

  const [nickname, setNickname] = useState(user.nickname);
  const [bio, setBio] = useState(user.bio || "");

  const [avatar, setAvatar] = useState(user.avatar);
  const [cover, setCover] = useState(user.coverPhoto);

  const [loading, setLoading] = useState(false);

  // -----------------------------------------
  // IMAGE PICKER (Base64)
  // -----------------------------------------
  const pickImage = async (type) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      base64: true,
      quality: 0.8,
      mediaTypes: ["images"],
    });

    if (!result.canceled) {
      uploadImage(result.assets[0].base64, type);
    }
  };

  // -----------------------------------------
  // UPLOAD TO BACKEND → Firebase Storage
  // -----------------------------------------
  const uploadImage = async (base64, type) => {
    setLoading(true);

    try {
      const res = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/uploadImage`,
        {
          imageBase64: base64,
          userId: user.id,
        }
      );

      if (res.data.url) {
        if (type === "avatar") setAvatar(res.data.url);
        if (type === "cover") setCover(res.data.url);
      }
    } catch (err) {
      console.log("UPLOAD ERROR:", err);
    }

    setLoading(false);
  };

  // -----------------------------------------
  // SAVE PROFILE
  // -----------------------------------------
  const saveProfile = async () => {
    setLoading(true);

    try {
      const res = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/user/update`,
        {
          userId: user.id,
          avatar,
          coverPhoto: cover,
          nickname,
          bio,
        }
      );

      if (res.data.success) {
        // Redux update
        dispatch(
          setAuthData({
            userId: user.id,
            email: user.email,
            token: user.token,
            user: {
              ...user,
              avatar,
              coverPhoto: cover,
              nickname,
              bio,
            },
          })
        );

        router.back();
      }
    } catch (err) {
      console.log("PROFILE SAVE ERROR:", err);
    }

    setLoading(false);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Edit Profile</Text>

      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={28} color="#333" />
      </TouchableOpacity>

      {/* COVER */}
      <TouchableOpacity onPress={() => pickImage("cover")}>
        {cover ? (
          <Image source={{ uri: cover }} style={styles.coverPhoto} />
        ) : (
          <View style={styles.coverPlaceholder}>
            <Ionicons name="camera-outline" size={40} color="#666" />
            <Text style={{ color: "#666" }}>Add Cover Photo</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* AVATAR */}
      <TouchableOpacity
        style={styles.avatarWrapper}
        onPress={() => pickImage("avatar")}
      >
        <Image
          source={{
            uri: avatar || "https://i.imgur.com/0y8Ftya.png",
          }}
          style={styles.avatar}
        />
        <View style={styles.cameraBadge}>
          <Ionicons name="camera" size={18} color="#fff" />
        </View>
      </TouchableOpacity>

      {/* INPUTS */}
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>Nickname</Text>
        <TextInput
          style={styles.input}
          value={nickname}
          onChangeText={setNickname}
        />
      </View>

      <View style={styles.inputWrapper}>
        <Text style={styles.label}>Bio</Text>
        <TextInput
          style={[styles.input, { height: 100 }]}
          value={bio}
          multiline
          onChangeText={setBio}
        />
      </View>

      <TouchableOpacity style={styles.saveBtn} onPress={saveProfile}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.saveText}>Save</Text>
        )}
      </TouchableOpacity>

      <View style={{ height: 50 }} />
    </ScrollView>
  );
}

/* ---------------------- STYLES ---------------------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    backgroundColor: "#F5F7FA",
  },

  backBtn: {
    position: "absolute",
    left: 20,
    top: 0,
    zIndex: 20,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },

  coverPhoto: {
    width: "100%",
    height: 180,
    borderRadius: 12,
  },
  coverPlaceholder: {
    width: "100%",
    height: 180,
    borderRadius: 12,
    backgroundColor: "#e2e2e2",
    justifyContent: "center",
    alignItems: "center",
  },

  avatarWrapper: {
    alignSelf: "center",
    marginTop: -40,
  },

  avatar: {
    width: 120,
    height: 120,
    borderRadius: 100,
    borderWidth: 4,
    borderColor: "#fff",
    backgroundColor: "#eee",
  },

  cameraBadge: {
    position: "absolute",
    bottom: 5,
    right: 5,
    backgroundColor: "#7C3AED",
    padding: 6,
    borderRadius: 20,
  },

  inputWrapper: {
    marginTop: 25,
  },
  label: {
    color: "#555",
    marginBottom: 5,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },

  saveBtn: {
    marginTop: 30,
    backgroundColor: "#7C3AED",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  saveText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
