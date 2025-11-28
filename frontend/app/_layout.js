import { Stack } from "expo-router";
import DataProvider from "../redux/DataProvider";
import { deactivateKeepAwake } from "expo-keep-awake";

export default function RootLayout() {
  deactivateKeepAwake();

  return (
    <DataProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </DataProvider>
  );
}
