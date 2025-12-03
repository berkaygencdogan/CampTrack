// components/PostComment.js
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";

export default function PostComment({ comment, onDelete, isMe }) {
  return (
    <View style={styles.commentRow}>
      <Image
        source={{
          uri: comment.userAvatar || "https://i.imgur.com/0y8Ftya.png",
        }}
        style={styles.avatar}
      />

      <View style={{ flex: 1 }}>
        <Text style={styles.username}>{comment.userNickname || "User"}</Text>
        <Text style={styles.text}>{comment.text}</Text>
      </View>

      {isMe && (
        <TouchableOpacity onPress={() => onDelete(comment.id)}>
          <Text style={styles.delete}>Delete</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  commentRow: {
    flexDirection: "row",
    paddingVertical: 10,
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 40,
    marginRight: 10,
  },
  username: { fontWeight: "700" },
  text: { color: "#333" },
  delete: { color: "red", marginLeft: 10 },
});
