// useInterstitial.js
import {
  InterstitialAd,
  AdEventType,
  TestIds,
} from "react-native-google-mobile-ads";

const adUnitId = __DEV__ ? TestIds.INTERSTITIAL : process.env.EXPO_ADMOB_VIDEO;

// Tek global reklam objesi
const interstitial = InterstitialAd.createForAdRequest(adUnitId);

// Reklam yüklü mü?
let isLoaded = false;

// Yükleme olaylarını dinle
interstitial.addAdEventListener(AdEventType.LOADED, () => {
  isLoaded = true;
});

interstitial.addAdEventListener(AdEventType.CLOSED, () => {
  interstitial.load();
});

// İlk yükleme
interstitial.load();

// 👉 GLOBAL FONKSİYON: AdManager burayı kullanacak
export const showInterstitial = () => {
  if (isLoaded) {
    interstitial.show();
    isLoaded = false;
  } else {
    interstitial.load();
  }
};
