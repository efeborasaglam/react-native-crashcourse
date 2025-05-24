import React from 'react';
import { Button } from 'react-native';
import { useSignOut } from '@clerk/clerk-expo';

const TestSignOut = () => {
  const { signOut } = useSignOut();

  const handleSignOut = async () => {
    try {
      await signOut();
      console.log('Signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return <Button title="Test Sign Out" onPress={handleSignOut} />;
};

export default TestSignOut;