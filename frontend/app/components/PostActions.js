// components/PostActions.js
import { View, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function PostActions({
  post,
  isMe,
  onLike,
  onDelete,
  onEdit,
  onCommentPress,
}) {
  return (
    <View style={{ flexDirection: "row", gap: 20, marginVertical: 10 }}>
      <TouchableOpacity onPress={onLike}>
        <Ionicons
          name={
            post.likedBy?.includes(post.myUserId) ? "heart" : "heart-outline"
          }
          size={30}
          color={post.likedBy?.includes(post.myUserId) ? "red" : "#333"}
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={onCommentPress}>
        <Ionicons name="chatbubble-outline" size={28} color="#333" />
      </TouchableOpacity>

      {isMe && (
        <>
          <TouchableOpacity onPress={onEdit}>
            <Ionicons name="pencil" size={28} color="#333" />
          </TouchableOpacity>

          <TouchableOpacity onPress={onDelete}>
            <Ionicons name="trash" size={28} color="red" />
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}
