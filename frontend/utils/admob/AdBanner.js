import React from "react";
import { StyleSheet, View, Platform } from "react-native";
import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from "react-native-google-mobile-ads";

const isDev = __DEV__;

const BANNER_AD_UNIT_ID = isDev
  ? TestIds.BANNER
  : Platform.select({
      ios: "ca-app-pub-6790689850057549/8519536699",
      android: "ca-app-pub-6790689850057549/3115893126",
      default: TestIds.BANNER,
    });

const AdBanner = () => {
  return (
    <View style={styles.container}>
      <BannerAd
        unitId={BANNER_AD_UNIT_ID}
        size={BannerAdSize.BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
      />
    </View>
  );
};

export default AdBanner;

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});
