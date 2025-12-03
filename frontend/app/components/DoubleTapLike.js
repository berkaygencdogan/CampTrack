import React from "react";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function DoubleTapLike({ children }) {
  const scale = useSharedValue(0);

  const animate = () => {
    scale.value = 0.8;
    scale.value = withTiming(1, { duration: 180 }, () => {
      scale.value = withTiming(0, { duration: 250 });
    });
  };

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      animate();
    });

  const style = useAnimatedStyle(() => ({
    opacity: scale.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <GestureDetector gesture={doubleTap}>
      <Animated.View style={{ flex: 1 }}>
        {children}

        <Animated.View
          style={[
            {
              position: "absolute",
              top: "40%",
              left: "40%",
              zIndex: 10,
            },
            style,
          ]}
        >
          <Ionicons name="heart" size={90} color="white" />
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
}
