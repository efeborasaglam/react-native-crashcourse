import { Stack } from "expo-router";
import './globals.css';
import { StatusBar } from "react-native";
import React from "react";

export default function RootLayout() {
  return(
  <>
    <StatusBar hidden={true} />
    <Stack >
      <Stack.Screen
        name="(tabs)"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="movie/[id]"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="recommendate"
        options={{ headerShown: false }}
      />
    </Stack>
  </>
  )
}
