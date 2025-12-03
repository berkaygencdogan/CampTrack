// components/media/VideoPlayer.js
import React, { useEffect, useRef, useState } from "react";
import { View, TouchableOpacity, StyleSheet, Animated } from "react-native";
import { VideoView } from "expo-video";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function VideoPlayer({
  source,
  shouldPlay,
  loop = true,
  defaultMuted = true,
  style,
}) {
  const videoRef = useRef(null);
  const [muted, setMuted] = useState(defaultMuted);
  const [iconVisible, setIconVisible] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Fade animation for sound icon
  const showIcon = () => {
    setIconVisible(true);
    fadeAnim.setValue(1);

    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 1200,
      useNativeDriver: true,
    }).start(() => setIconVisible(false));
  };

  // Toggle mute on tap
  const toggleMute = () => {
    setMuted(!muted);
    showIcon();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity activeOpacity={1} onPress={toggleMute}>
        <VideoView
          ref={videoRef}
          source={source}
          style={style}
          contentFit="cover"
          shouldPlay={shouldPlay}
          isLooping={loop}
          isMuted={muted}
        />
      </TouchableOpacity>

      {iconVisible && (
        <Animated.View style={[styles.iconWrapper, { opacity: fadeAnim }]}>
          <Ionicons
            name={muted ? "volume-mute" : "volume-high"}
            size={42}
            color="#fff"
          />
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
  },
  iconWrapper: {
    position: "absolute",
    alignSelf: "center",
    top: "40%",
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: 10,
    borderRadius: 50,
  },
});
