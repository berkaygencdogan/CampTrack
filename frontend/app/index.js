import { useEffect, useState } from "react";
import { Redirect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Localization from "expo-localization";
import ImmersiveMode from "react-native-immersive-mode";

export default function Index() {
  const [loading, setLoading] = useState(true);
  const [splashDone, setSplashDone] = useState(false);
  const [seenOnboarding, setSeenOnboarding] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    ImmersiveMode.fullLayout(true);
    ImmersiveMode.setBarMode("BottomSticky");

    const init = async () => {
      // 1) Splash beklet
      await new Promise((res) => setTimeout(res, 3000));
      setSplashDone(true);

      // 2) Onboarding kontrolü
      const seen = await AsyncStorage.getItem("onboardingSeen");
      setSeenOnboarding(seen === "true");

      // 3) Login kontrolü
      const token = await AsyncStorage.getItem("token");
      setIsLoggedIn(!!token);

      // 4) Dil tespiti
      const locales = Localization.getLocales();
      const langCode = locales?.[0]?.languageCode || "en";
      const appLang = langCode === "tr" ? "tr" : "en";
      await AsyncStorage.setItem("appLanguage", appLang);

      setLoading(false);
    };

    init();
  }, []);

  // 🔥 İlk açılış: Splash göster
  if (loading || !splashDone) {
    return <Redirect href="/splash" />;
  }

  // 🔥 Eğer kullanıcı giriş yaptıysa → Home
  if (isLoggedIn) {
    return <Redirect href="/home" />;
  }

  // 🔥 Onboarding görülmemiş → onboarding
  if (!seenOnboarding) {
    return <Redirect href="/onboarding" />;
  }

  // 🔥 Onboarding görüldü ama login yok → login sayfası
  return <Redirect href="/login" />;
}
