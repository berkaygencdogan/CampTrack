// app/VideoPlayer.js
import React, { useEffect, useRef } from "react";
import { View, TouchableOpacity } from "react-native";
import { VideoView, useVideoPlayer } from "expo-video";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function VideoPlayer({ uri, isActive }) {
  // Her video mount olduğunda yeni player oluştur
  const player = useVideoPlayer(uri, (p) => {
    p.loop = true;
    p.pause();
  });

  const muted = useRef(true);

  useEffect(() => {
    if (isActive) {
      player.play();
    } else {
      player.pause();
    }
  }, [isActive]);

  return (
    <View style={{ width: "100%", height: "100%" }}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => {
          muted.current = !muted.current;
          player.muted = muted.current;
        }}
        style={{ width: "100%", height: "100%" }}
      >
        {/* 🔥 CRASH FIX: key={uri} → VideoView TEKRAR MOUNT OLUR */}
        <VideoView
          key={uri}
          style={{ width: "100%", height: "100%", backgroundColor: "#000" }}
          player={player}
          contentFit="cover"
        />

        {/* Volume Icon */}
        <View
          style={{
            position: "absolute",
            top: 15,
            right: 15,
            backgroundColor: "rgba(0,0,0,0.5)",
            padding: 8,
            borderRadius: 40,
          }}
        >
          <Ionicons
            name={muted.current ? "volume-mute" : "volume-high"}
            color="white"
            size={22}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
}
