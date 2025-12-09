// components/AdBanner.js
import { BannerAd, BannerAdSize } from "react-native-google-mobile-ads";

export default function AdBanner() {
  const adUnitId = __DEV__
    ? "ca-app-pub-3940256099942544/6300978111"
    : process.env.EXPO_ADMOB_BANNER;

  return <BannerAd unitId={adUnitId} size={BannerAdSize.ADAPTIVE_BANNER} />;
}
