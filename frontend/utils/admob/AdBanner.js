import { View } from "react-native";
import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from "react-native-google-mobile-ads";
import Constants from "expo-constants";

export default function AdBanner() {
  const bannerId = Constants.expoConfig?.extra?.admobBanner || TestIds.BANNER; // fallback

  const adUnitId = __DEV__ ? TestIds.BANNER : bannerId;

  return (
    <View style={{ width: "100%", alignItems: "center", marginVertical: 10 }}>
      <BannerAd unitId={adUnitId} size={BannerAdSize.BANNER} />
    </View>
  );
}
