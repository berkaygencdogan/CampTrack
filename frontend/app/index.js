import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { Image, StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";
import * as SplashScreen from "expo-splash-screen";
import * as Localization from "expo-localization";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NavigationBar from "expo-navigation-bar";
export default function Index() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  const hasSeenOnboarding = useSelector(
    (state) => state.onboard.showOnboardScreen
  );
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

  const loadingGif = require("../src/assets/images/loadingScreen.gif");

  useEffect(() => {
    const prepare = async () => {
      try {
        NavigationBar.setVisibilityAsync("hidden"); // Tamamen gizle
        NavigationBar.setBehaviorAsync("overlay-swipe"); // Immersive swipe-to-show
        // Splash ekranda kalsın
        SplashScreen.preventAutoHideAsync();

        // Minimum bekleme
        await new Promise((res) => setTimeout(res, 900));

        // Dil kaydet
        const langCode = Localization.getLocales()[0]?.languageCode ?? "en";
        await AsyncStorage.setItem(
          "appLanguage",
          langCode === "tr" ? "tr" : "en"
        );
      } finally {
        setReady(true);
      }
    };

    prepare();
  }, []);

  useEffect(() => {
    if (!ready) return;

    // Splash artık kapanabilir
    SplashScreen.hideAsync();

    // Redirect güvenli gecikmeyle
    setTimeout(() => {
      if (!hasSeenOnboarding) {
        router.replace("/onboarding");
        return;
      }
      if (isLoggedIn) {
        router.replace("/home");
        return;
      }
      router.replace("/login");
    }, 100);
  }, [ready]);

  return (
    <View style={styles.container}>
      <Image source={loadingGif} style={styles.gif} resizeMode="cover" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  gif: {
    width: "100%",
    height: "100%",
  },
});
