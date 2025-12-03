// components/PostVideo.js
import { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { VideoView, useVideoPlayer } from "expo-video";

export default function PostVideo({ url, active }) {
  // Video player instance
  const player = useVideoPlayer(url, (player) => {
    player.loop = false;
  });

  // Aktif değilken durdur
  useEffect(() => {
    if (!active) {
      player.pause();
    } else {
      player.play();
    }
  }, [active]);

  return (
    <View style={styles.container}>
      <VideoView
        style={styles.video}
        player={player}
        allowsPictureInPicture // sorun yok
        fullscreenOptions={{
          enabled: true,
          presentationStyle: "fullScreen",
        }}
        contentFit="cover"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "#000",
  },
  video: {
    width: "100%",
    height: "100%",
  },
});
