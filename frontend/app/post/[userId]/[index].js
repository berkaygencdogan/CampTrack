// app/post/[userId]/[index].js
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Animated,
} from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";
import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSelector } from "react-redux";

import ZoomableMedia from "../../components/ZoomableMedia";
import DoubleTapLike from "../../components/DoubleTapLike";
import PostVideo from "../../components/PostVideo";

const SCREEN_WIDTH = Dimensions.get("window").width;

export default function PostDetail() {
  const { userId, index, highlight, refresh } = useLocalSearchParams();
  const router = useRouter();

  const myUser = useSelector((state) => state.user?.userInfo);
  const isMine = myUser.id === userId;

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [sending, setSending] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollRef = useRef();
  const flatRef = useRef();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(
          `${process.env.EXPO_PUBLIC_API_URL}/user/${userId}/gallery`
        );

        const p = res.data.posts[Number(index)];

        setPost({
          ...p,
          comments: p.comments || [],
          medias: p.medias || [
            {
              type: p.mediaType || "image",
              url: p.mediaUrl,
            },
          ],
        });
      } catch (err) {
        console.log("POST FETCH ERROR:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [refresh]);

  // -----------------------------------------------------
  // SCROLL TO COMMENT
  // -----------------------------------------------------
  useEffect(() => {
    if (!post || !highlight) return;

    setTimeout(() => {
      const i = post.comments.findIndex((c) => c.id === highlight);
      if (i !== -1 && scrollRef.current) {
        scrollRef.current.scrollTo({ y: i * 80, animated: true });
      }
    }, 400);
  }, [post]);

  // -----------------------------------------------------
  // SEND COMMENT
  // -----------------------------------------------------
  const sendComment = async () => {
    if (!comment.trim()) return;

    setSending(true);
    try {
      await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/post/comment`, {
        userId: myUser.id,
        ownerId: userId,
        index: Number(index),
        text: comment,
      });

      const res = await axios.get(
        `${process.env.EXPO_PUBLIC_API_URL}/user/${userId}/gallery`
      );

      setPost(res.data.posts[Number(index)]);
      setComment("");
    } catch (err) {
      console.log("COMMENT ERROR:", err);
    } finally {
      setSending(false);
    }
  };

  // -----------------------------------------------------
  if (loading || !post) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator size="large" color="#3D7AFF" />
      </View>
    );
  }

  // -----------------------------------------------------
  // RENDER MEDIA ITEM
  // -----------------------------------------------------
  const renderMedia = ({ item, index: mediaIndex }) => {
    const isActive = activeIndex === mediaIndex;
    if (item.type === "video") {
      return (
        <View style={styles.mediaWrapper}>
          <PostVideo url={item.url} active={isActive} />
        </View>
      );
    }

    return (
      <View style={styles.mediaWrapper}>
        <DoubleTapLike>
          <ZoomableMedia>
            <Image source={{ uri: item.url }} style={styles.postMedia} />
          </ZoomableMedia>
        </DoubleTapLike>
      </View>
    );
  };

  // -----------------------------------------------------
  // NEXT / PREVIOUS BUTTONS
  // -----------------------------------------------------
  const goPrev = () => {
    if (activeIndex === 0) return;
    flatRef.current.scrollToIndex({ index: activeIndex - 1, animated: true });
  };

  const goNext = () => {
    if (activeIndex === post.medias.length - 1) return;
    flatRef.current.scrollToIndex({ index: activeIndex + 1, animated: true });
  };

  // -----------------------------------------------------
  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="#000" />
        </TouchableOpacity>

        <Text style={styles.title}>Post</Text>

        {isMine ? (
          <TouchableOpacity
            onPress={() =>
              router.push(
                `/post/edit/${post.id}?owner=${userId}&index=${activeIndex}`
              )
            }
          >
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 40 }} />
        )}
      </View>

      {/* MAIN SCROLL */}
      <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false}>
        {/* USER INFO */}
        <View style={styles.userRow}>
          <Image source={{ uri: post.userAvatar }} style={styles.avatar} />
          <View>
            <Text style={styles.nickname}>{post.username}</Text>
            <Text style={styles.date}>
              {new Date(post.createdAt).toLocaleString()}
            </Text>
          </View>
        </View>

        {/* MEDIA CAROUSEL */}
        <View>
          {/* LEFT ARROW */}
          <TouchableOpacity
            style={[styles.arrow, styles.leftArrow]}
            onPress={goPrev}
            disabled={activeIndex === 0}
          >
            <Ionicons
              name="chevron-back"
              size={32}
              color={activeIndex === 0 ? "#888" : "#fff"}
            />
          </TouchableOpacity>

          {/* RIGHT ARROW */}
          <TouchableOpacity
            style={[styles.arrow, styles.rightArrow]}
            onPress={goNext}
            disabled={activeIndex === post.medias.length - 1}
          >
            <Ionicons
              name="chevron-forward"
              size={32}
              color={activeIndex === post.medias.length - 1 ? "#888" : "#fff"}
            />
          </TouchableOpacity>

          <FlatList
            ref={flatRef}
            data={post.medias}
            keyExtractor={(_, i) => i.toString()}
            horizontal
            pagingEnabled
            renderItem={renderMedia}
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(e) => {
              const newIndex = Math.round(
                e.nativeEvent.contentOffset.x / SCREEN_WIDTH
              );
              setActiveIndex(newIndex);
            }}
          />
        </View>

        {/* DOTS */}
        <View style={styles.dotsContainer}>
          {post.medias.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, { opacity: activeIndex === i ? 1 : 0.3 }]}
            />
          ))}
        </View>

        {/* CAPTION */}
        {post.caption && (
          <Text style={styles.caption}>
            <Text style={styles.captionName}>{post.username}: </Text>
            {post.caption}
          </Text>
        )}

        {/* COMMENTS */}
        <Text style={styles.commentsHeader}>Comments</Text>

        {post.comments.length === 0 ? (
          <Text style={styles.noComments}>No comments yet.</Text>
        ) : (
          post.comments.map((c) => (
            <CommentItem key={c.id} c={c} highlight={highlight} />
          ))
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* COMMENT INPUT */}
      <View style={styles.inputBar}>
        <TextInput
          style={styles.commentInput}
          placeholder="Add a comment..."
          placeholderTextColor="#999"
          value={comment}
          onChangeText={setComment}
        />

        <TouchableOpacity disabled={sending} onPress={sendComment}>
          <Text style={[styles.sendBtn, sending && { opacity: 0.5 }]}>
            Send
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ======================================================================
// COMMENT ITEM
// ======================================================================
function CommentItem({ c, highlight }) {
  const bg = useRef(new Animated.Value(0)).current;
  const isTarget = c.id === highlight;

  useEffect(() => {
    if (isTarget) {
      bg.setValue(1);
      Animated.timing(bg, {
        toValue: 0,
        duration: 2000,
        useNativeDriver: false,
      }).start();
    }
  }, [isTarget]);

  return (
    <Animated.View
      style={[
        styles.commentRow,
        {
          backgroundColor: bg.interpolate({
            inputRange: [0, 1],
            outputRange: ["#FFFFFF", "#FFF8A3"],
          }),
        },
      ]}
    >
      <Image source={{ uri: c.userAvatar }} style={styles.commentAvatar} />

      <View>
        <Text style={styles.commentText}>
          <Text style={styles.commentName}>{c.username}: </Text>
          {c.text}
        </Text>

        <Text style={styles.commentDate}>
          {new Date(c.createdAt).toLocaleString()}
        </Text>
      </View>
    </Animated.View>
  );
}

// ======================================================================
// STYLES
// ======================================================================
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  loadingScreen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 45,
    paddingHorizontal: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    alignItems: "center",
  },
  title: { fontSize: 20, fontWeight: "700" },
  editText: { fontSize: 16, color: "#3D7AFF" },

  userRow: {
    flexDirection: "row",
    padding: 15,
    alignItems: "center",
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 30,
    marginRight: 10,
  },
  nickname: { fontSize: 16, fontWeight: "700" },
  date: { fontSize: 12, color: "#888" },

  mediaWrapper: {
    width: SCREEN_WIDTH,
    height: 450,
    backgroundColor: "#000",
  },

  arrow: {
    position: "absolute",
    top: "45%",
    zIndex: 10,
    padding: 12,
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 30,
  },
  leftArrow: { left: 10 },
  rightArrow: { right: 10 },

  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#3D7AFF",
    marginHorizontal: 4,
  },

  caption: {
    paddingHorizontal: 15,
    paddingTop: 10,
    fontSize: 15,
    lineHeight: 20,
  },
  captionName: { fontWeight: "700" },

  commentsHeader: {
    paddingHorizontal: 15,
    marginTop: 20,
    fontSize: 16,
    fontWeight: "600",
  },
  noComments: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    color: "#777",
  },

  commentRow: {
    flexDirection: "row",
    padding: 15,
    borderRadius: 10,
    marginBottom: 6,
  },
  commentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 20,
    marginRight: 10,
  },
  commentText: { fontSize: 14 },
  commentName: { fontWeight: "700" },
  commentDate: { fontSize: 11, color: "#888" },

  inputBar: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    padding: 10,
    backgroundColor: "#fff",
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  commentInput: { flex: 1, fontSize: 14 },
  sendBtn: {
    marginLeft: 12,
    fontWeight: "700",
    fontSize: 15,
    color: "#3D7AFF",
  },
  postMedia: {
    width: SCREEN_WIDTH,
    height: 450,
    resizeMode: "cover",
    backgroundColor: "#000",
  },
});
