import React from 'react';
import { View, Text, Button } from 'react-native';
import { useRouter } from 'expo-router';

export default function SignUpScreen() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Sign Up Screen</Text>
      <Button title="Go to Sign In" onPress={() => router.push('/(auth)/sign-in')} />
    </View>
  );
}