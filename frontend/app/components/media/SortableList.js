// components/media/SortableList.js
import React from "react";
import { View, Image, TouchableOpacity, Text, StyleSheet } from "react-native";
import DraggableFlatList, {
  ScaleDecorator,
} from "react-native-draggable-flatlist";
import { VideoView } from "expo-video";
import VideoThumbnail from "./VideoThumbnail";

export default function SortableList({
  data,
  onChange,
  height = 120,
  width = 120,
}) {
  const renderItem = ({ item, drag, isActive }) => {
    return (
      <ScaleDecorator>
        <TouchableOpacity
          onLongPress={drag}
          disabled={isActive}
          style={[
            styles.item,
            {
              width,
              height,
              opacity: isActive ? 0.8 : 1,
            },
          ]}
        >
          {item.type === "image" ? (
            <Image
              source={{ uri: item.url || item.uri }}
              style={{ width: "100%", height: "100%", borderRadius: 10 }}
            />
          ) : (
            <View style={{ width: "100%", height: "100%" }}>
              <VideoThumbnail
                uri={item.url || item.uri}
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: 10,
                }}
              />
              <View style={styles.videoTag}>
                <Text style={styles.videoText}>🎥</Text>
              </View>
            </View>
          )}
        </TouchableOpacity>
      </ScaleDecorator>
    );
  };

  return (
    <DraggableFlatList
      data={data}
      onDragEnd={({ data }) => onChange(data)}
      keyExtractor={(item, index) => index.toString()}
      renderItem={renderItem}
      horizontal
      contentContainerStyle={{ paddingHorizontal: 10 }}
    />
  );
}

const styles = StyleSheet.create({
  item: {
    marginRight: 12,
    borderRadius: 10,
    overflow: "hidden",
  },
  videoTag: {
    position: "absolute",
    bottom: 6,
    right: 6,
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  videoText: {
    color: "#fff",
    fontSize: 12,
  },
});
