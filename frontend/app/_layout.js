import { Stack } from "expo-router";
import DataProvider from "../redux/DataProvider";

export default function RootLayout() {
  return (
    <DataProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </DataProvider>
  );
}
