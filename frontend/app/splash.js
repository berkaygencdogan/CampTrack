import { View, Image, StyleSheet } from "react-native";
import { useEffect } from "react";
import { useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";

// GIF
const loadingGif = require("../src/assets/images/loadingScreen.gif");

export default function Splash() {
  const router = useRouter();

  useEffect(() => {
    const prepare = async () => {
      // Native splash kapatma
      await SplashScreen.hideAsync();

      // 1.5 saniye beklet
      setTimeout(() => {
        router.replace("/login");
      }, 3000);
    };

    prepare();
  }, []);

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
    justifyContent: "center",
    alignItems: "center",
  },
  gif: {
    width: "100%",
    height: "100%",
  },
});
