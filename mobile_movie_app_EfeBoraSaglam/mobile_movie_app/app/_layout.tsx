import { Stack } from 'expo-router';
import './globals.css';
import { StatusBar } from 'react-native';
import React from 'react';
import { ClerkProvider } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import Constants from 'expo-constants';

export default function RootLayout() {
  return (
    <ClerkProvider
      tokenCache={tokenCache}
      publishableKey={Constants.expoConfig?.extra?.clerkPublishableKey}
    >
      <StatusBar hidden />

      <Stack>
        {/* Slot rendert Layout-Dateien wie (tabs)/_layout.tsx */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="movie/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="recommendate" options={{ headerShown: false }} />
        <Stack.Screen name="sign-in" options={{ headerShown: false }} />
        <Stack.Screen name="sign-up" options={{ headerShown: false }} />
      </Stack>
    </ClerkProvider>
  );
}