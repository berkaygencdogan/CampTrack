import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import LeftImage from "../src/assets/images/arrow-left.png";
import I18n from "./language/index";
import AdBanner from "../utils/admob/AdManager";

const { width } = Dimensions.get("window");

const slides = [
  {
    id: 1,
    title: I18n.t("onboard1Title"),
    desc: I18n.t("onboard1Desc"),
    image: require("../src/assets/images/onboarding1.png"),
  },
  {
    id: 2,
    title: I18n.t("onboard2Title"),
    desc: I18n.t("onboard2Desc"),
    image: require("../src/assets/images/onboarding2.png"),
  },
  {
    id: 3,
    title: I18n.t("onboard3Title"),
    desc: I18n.t("onboard3Desc"),
    image: require("../src/assets/images/onboarding3.png"),
  },
  {
    id: 4,
    title: I18n.t("onboard4Title"),
    desc: I18n.t("onboard4Desc"),
    image: require("../src/assets/images/onboarding4.png"),
  },
  {
    id: 5,
    title: I18n.t("onboard5Title"),
    desc: I18n.t("onboard5Desc"),
    image: require("../src/assets/images/onboarding5.png"),
  },
  {
    id: 6,
    title: I18n.t("onboard6Title"),
    desc: I18n.t("onboard6Desc"),
    image: require("../src/assets/images/onboarding6.png"),
  },
];

export default function Onboarding() {
  const [index, setIndex] = useState(0);
  const router = useRouter();
  const flatRef = useRef(null);

  // ✔ onboarding bitince bir daha açılmasın
  const finish = async () => {
    await AsyncStorage.setItem("onboardingSeen", "true");
    router.replace("/login");
  };

  // ✔ scroll index yakalama
  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setIndex(viewableItems[0].index);
    }
  });

  const next = () => {
    if (index < slides.length - 1) {
      flatRef.current.scrollToIndex({ index: index + 1 });
    } else {
      finish();
    }
  };

  const prev = () => {
    if (index > 0) {
      flatRef.current.scrollToIndex({ index: index - 1 });
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={slides}
        horizontal
        pagingEnabled
        ref={flatRef}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        onViewableItemsChanged={onViewableItemsChanged.current}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        renderItem={({ item }) => (
          <View
            style={{
              width,
              alignItems: "center",
              paddingTop: 60,
            }}
          >
            <Image source={item.image} style={styles.image} />
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.desc}>{item.desc}</Text>
          </View>
        )}
      />
      <AdBanner />
      <View style={{ flex: 3 }}>
        <View style={styles.buttons}>
          <TouchableOpacity style={styles.navBtn} onPress={prev}>
            <Image source={LeftImage} style={styles.navText}></Image>
          </TouchableOpacity>
          <View style={styles.dots}>
            {slides.map((_, i) => (
              <View
                key={i}
                style={[styles.dot, index === i && styles.activeDot]}
              />
            ))}
          </View>
          <TouchableOpacity style={styles.navBtn} onPress={next}>
            <Image
              source={LeftImage}
              style={styles.navText}
              transform={[{ rotate: "180deg" }]}
            ></Image>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.loginBtn} onPress={finish}>
          <Text style={styles.loginText}>Log in</Text>
        </TouchableOpacity>

        <Text style={styles.register}>
          Don't have an Account?
          <Text style={styles.registerLink}> Register</Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    height: "100%",
  },
  image: {
    width: 250,
    height: 250,
    resizeMode: "contain",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginTop: 20,
    textAlign: "center",
  },
  desc: {
    fontSize: 15,
    color: "#666",
    marginTop: 10,
    paddingHorizontal: 40,
    textAlign: "center",
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 10,
    backgroundColor: "#ccc",
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "#78C63E",
    width: 10,
    height: 10,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 40,
    marginBottom: 15,
    marginTop: 50,
  },
  navBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#E8F5D0",
    justifyContent: "center",
    alignItems: "center",
  },
  navText: {
    width: 24,
    height: 24,
  },
  loginBtn: {
    backgroundColor: "#78C63E",
    marginHorizontal: 30,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 30,
  },
  loginText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  register: {
    textAlign: "center",
    marginTop: 15,
    color: "#444",
  },
  registerLink: {
    color: "#78C63E",
    fontWeight: "bold",
  },
});
