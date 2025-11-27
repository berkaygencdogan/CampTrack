import { useEffect, useState } from "react";
import { Redirect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Localization from "expo-localization";
import ImmersiveMode from "react-native-immersive-mode";
import { useSelector } from "react-redux";
import * as SplashScreen from "expo-splash-screen";
import { Image, StyleSheet, View } from "react-native";

export default function Index() {
  const [loading, setLoading] = useState(true);

  const seenOnboarding = useSelector(
    (state) => state.onboard.showOnboardScreen
  );
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

  const loadingGif = require("../src/assets/images/loadingScreen.gif");

  useEffect(() => {
    const init = async () => {
      ImmersiveMode.fullLayout(true);
      ImmersiveMode.setBarMode("BottomSticky");

      // Native splash kapanıyor
      await SplashScreen.hideAsync();

      // 2-3 saniye splash görünmesi için küçük delay
      await new Promise((res) => setTimeout(res, 2000));

      // Dil
      const locales = Localization.getLocales();
      const langCode = locales?.[0]?.languageCode || "en";
      const appLang = langCode === "tr" ? "tr" : "en";
      await AsyncStorage.setItem("appLanguage", appLang);

      setLoading(false);
    };

    init();
  }, []);

  // 🔥 Splash ekranı göster
  if (loading) {
    return (
      <View style={styles.container}>
        <Image source={loadingGif} style={styles.gif} resizeMode="cover" />
      </View>
    );
  }

  // 🔥 Onboarding
  if (!seenOnboarding) {
    return <Redirect href="/onboarding" />;
  }

  // 🔥 Kullanıcı giriş yaptıysa → Home
  if (isLoggedIn) {
    return <Redirect href="/home" />;
  }

  // 🔥 Giriş yapılmadı → Login
  return <Redirect href="/login" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  gif: {
    width: "100%",
    height: "100%",
  },
});
