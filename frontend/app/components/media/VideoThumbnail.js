// components/media/VideoThumbnail.js
import React, { useEffect, useState } from "react";
import { Image, ActivityIndicator, View, StyleSheet } from "react-native";
import * as VideoThumbnails from "expo-video-thumbnails";

export default function VideoThumbnail({ uri, style }) {
  const [thumbnail, setThumbnail] = useState(null);
  const [loading, setLoading] = useState(true);

  const generateThumbnail = async () => {
    try {
      const { uri: thumb } = await VideoThumbnails.getThumbnailAsync(uri, {
        time: 500,
      });
      setThumbnail(thumb);
    } catch (err) {
      console.log("THUMB ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generateThumbnail();
  }, [uri]);

  if (loading) {
    return (
      <View style={[style, styles.center]}>
        <ActivityIndicator size="small" color="#fff" />
      </View>
    );
  }

  return <Image source={{ uri: thumbnail }} style={style} />;
}

const styles = StyleSheet.create({
  center: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
});
