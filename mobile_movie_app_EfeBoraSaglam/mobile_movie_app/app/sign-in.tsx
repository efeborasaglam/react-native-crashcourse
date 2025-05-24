import React from 'react';
import { View, Text, Button } from 'react-native';
import { useRouter } from 'expo-router';

export default function SignInScreen() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Sign In Screen</Text>
      <Button title="Go to Sign Up" onPress={() => router.push('/sign-up')} />
    </View>
  );
}