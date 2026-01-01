// useInterstitial.js
import {
  InterstitialAd,
  AdEventType,
  TestIds,
} from "react-native-google-mobile-ads";

// 🔒 Güvenli adUnitId belirleme
const adUnitId = __DEV__
  ? TestIds.INTERSTITIAL
  : process.env.EXPO_PUBLIC_ADMOB_VIDEO;

// 🔒 Guard state
let interstitial = null;
let isLoaded = false;
let isInitialized = false;

try {
  // ❗ adUnitId yoksa interstitial oluşturma
  if (!adUnitId || typeof adUnitId !== "string") {
    console.log("⚠️ Interstitial disabled: adUnitId missing");
  } else {
    interstitial = InterstitialAd.createForAdRequest(adUnitId);

    interstitial.addAdEventListener(AdEventType.LOADED, () => {
      isLoaded = true;
    });

    interstitial.addAdEventListener(AdEventType.CLOSED, () => {
      isLoaded = false;
      interstitial.load();
    });

    interstitial.addAdEventListener(AdEventType.ERROR, (error) => {
      console.log("❌ Interstitial error:", error);
      isLoaded = false;
    });

    interstitial.load();
    isInitialized = true;
  }
} catch (err) {
  console.log("❌ Interstitial init crash prevented:", err);
  interstitial = null;
  isInitialized = false;
}

// 👉 GLOBAL FONKSİYON (ASLA crash etmez)
export const showInterstitial = () => {
  try {
    if (!isInitialized || !interstitial) {
      // Reklam yok → sessizce geç
      return;
    }

    if (isLoaded) {
      interstitial.show();
      isLoaded = false;
    } else {
      interstitial.load();
    }
  } catch (err) {
    console.log("❌ Interstitial show prevented:", err);
  }
};
