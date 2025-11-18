import { useEffect, useState } from "react";
import { Redirect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Index() {
  const [loading, setLoading] = useState(true);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const check = async () => {
      const v = await AsyncStorage.getItem("onboardingSeen");
      setSeen(v === "true");
      setLoading(false);
    };
    check();
  }, []);

  if (loading) return null;

  if (!seen) return <Redirect href="/onboarding" />;

  return <Redirect href="/home" />;
}
