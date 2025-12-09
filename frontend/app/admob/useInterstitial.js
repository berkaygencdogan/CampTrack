// hooks/useInterstitial.js
import { InterstitialAd, AdEventType } from "react-native-google-mobile-ads";
import { useEffect, useState } from "react";

export function useInterstitial() {
  const [loaded, setLoaded] = useState(false);

  const adUnitId = __DEV__
    ? "ca-app-pub-3940256099942544/1033173712"
    : process.env.EXPO_ADMOB_VIDEO;

  const interstitial = InterstitialAd.createForAdRequest(adUnitId);

  useEffect(() => {
    const unsubscribeLoaded = interstitial.addAdEventListener(
      AdEventType.LOADED,
      () => {
        setLoaded(true);
      }
    );

    const unsubscribeClosed = interstitial.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        interstitial.load(); // tekrar yükle
      }
    );

    interstitial.load();

    return () => {
      unsubscribeLoaded();
      unsubscribeClosed();
    };
  }, []);

  const show = () => {
    if (loaded) interstitial.show();
    else console.log("⚠️ Reklam hazır değil");
  };

  return { show };
}
