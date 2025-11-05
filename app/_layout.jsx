import * as NavigationBar from "expo-navigation-bar";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Platform } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../global.css";

export default function RootLayout() {
  useEffect(() => {
    if (Platform.OS === "android") {
      // Set navigation bar to dark theme with light icons
      NavigationBar.setButtonStyleAsync("light"); // White icons for dark background
      NavigationBar.setPositionAsync("absolute"); // Transparent overlay for edge-to-edge
      NavigationBar.setVisibilityAsync("visible");
    }
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style="light" backgroundColor="#2b2b2b" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </SafeAreaProvider>
  );
}