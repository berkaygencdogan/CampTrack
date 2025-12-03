// components/media/Carousel.js
import React, { useRef, useState } from "react";
import { View, FlatList, Dimensions, StyleSheet } from "react-native";

import ZoomableMedia from "./ZoomableView";
import VideoPlayer from "./VideoPlayer";

const SCREEN_WIDTH = Dimensions.get("window").width;

export default function Carousel({ medias, height = 400 }) {
  const flatRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const renderItem = ({ item, index }) => {
    const isVideo = item.type === "video";
    const src = item.url || item.uri;

    return (
      <View style={{ width: SCREEN_WIDTH, height }}>
        {isVideo ? (
          <VideoPlayer
            source={{ uri: src }}
            shouldPlay={activeIndex === index} // 🔥 sadece aktif video oynar
            style={{ width: SCREEN_WIDTH, height }}
          />
        ) : (
          <ZoomableMedia
            source={src}
            type="image"
            style={{ width: SCREEN_WIDTH, height }}
          />
        )}
      </View>
    );
  };

  return (
    <>
      <FlatList
        ref={flatRef}
        data={medias}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, i) => i.toString()}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(
            e.nativeEvent.contentOffset.x / SCREEN_WIDTH
          );
          setActiveIndex(index);
        }}
        renderItem={renderItem}
      />

      {/* Dots */}
      <View style={styles.dotsContainer}>
        {medias.map((_, i) => (
          <View
            key={i}
            style={[styles.dot, { opacity: activeIndex === i ? 1 : 0.3 }]}
          />
        ))}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 6,
    backgroundColor: "#3D7AFF",
    marginHorizontal: 4,
  },
});
