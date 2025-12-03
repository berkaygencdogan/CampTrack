import { deactivateKeepAwake } from "expo-keep-awake";
import { Stack } from "expo-router";
import DataProvider from "../redux/DataProvider";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  deactivateKeepAwake();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <DataProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </DataProvider>
    </GestureHandlerRootView>
  );
}
