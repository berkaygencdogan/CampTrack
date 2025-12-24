import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { useRouter } from "expo-router";

const PlaceCard = ({ item, small }) => {
  const router = useRouter();
  return (
    <TouchableOpacity
      style={[styles.card, small && { width: 200 }]}
      onPress={() => {
        if (!item?.id) return;

        router.push({
          pathname: "/LocationDetail",
          params: { id: item.id },
        });
      }}
    >
      <Image
        source={{ uri: item?.photos?.[0] ?? "https://picsum.photos/200" }}
        style={styles.cardImg}
      />

      <Text style={styles.cardTitle} numberOfLines={1}>
        {item.name}
      </Text>
      <Text style={styles.cardCity}>{item.city}</Text>
    </TouchableOpacity>
  );
};

export default PlaceCard;

const styles = StyleSheet.create({
  card: {
    width: "100%",
    marginRight: 15,
  },
  cardImg: {
    width: "100%",
    height: 130,
    borderRadius: 12,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "600",
    marginTop: 6,
  },
  cardCity: {
    fontSize: 14,
    color: "#777",
  },
});
