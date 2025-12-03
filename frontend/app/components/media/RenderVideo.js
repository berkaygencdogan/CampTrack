// components/RenderVideo.js
import { VideoView, useVideoPlayer } from "expo-video";
import { StyleSheet } from "react-native";

export default function RenderVideo({ url }) {
  const player = useVideoPlayer(url, (p) => {
    p.loop = true;
    p.play();
  });

  return (
    <VideoView
      player={player}
      style={styles.video}
      fullscreenOptions={{ enabled: true }}
      pictureInPictureOptions={{ enabled: true }}
    />
  );
}

const styles = StyleSheet.create({
  video: {
    width: "100%",
    height: "100%",
    backgroundColor: "#000",
  },
});
