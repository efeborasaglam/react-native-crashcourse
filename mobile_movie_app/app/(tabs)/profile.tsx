import { icons } from '@/constants/icons';
import { images } from '@/constants/images';
import { Camera, CameraType, CameraView } from 'expo-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useRef, useEffect } from 'react';
import { Button, Image, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React from 'react';

export default function App() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const cameraRef = useRef<Camera | null>(null);
  const [facing, setFacing] = useState<CameraType>('back');

  // Load saved profile data on component mount
  useEffect(() => {
    loadProfileData();
  }, []);

  // Save profile data to AsyncStorage
  async function saveProfileData() {
    try {
      const profileData = {
        firstName,
        lastName,
        email,
        photo,
      };
      await AsyncStorage.setItem('profileData', JSON.stringify(profileData));
      alert('Profile saved successfully!');
    } catch (error) {
      console.error('Failed to save profile data:', error);
    }
  }

  // Load profile data from AsyncStorage
  async function loadProfileData() {
    try {
      const savedData = await AsyncStorage.getItem('profileData');
      if (savedData) {
        const { firstName, lastName, email, photo } = JSON.parse(savedData);
        setFirstName(firstName || '');
        setLastName(lastName || '');
        setEmail(email || '');
        setPhoto(photo || null);
      }
    } catch (error) {
      console.error('Failed to load profile data:', error);
    }
  }

  // Request camera permissions
  async function requestCameraPermission() {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === 'granted');
  }

  // Open camera
  function openCamera() {
    requestCameraPermission();
    setCameraOpen(true);
  }

  // Take picture
  async function takePicture() {
    if (cameraRef.current) {
      const photoData = await cameraRef.current.takePictureAsync();
      setPhoto(photoData.uri);
      setCameraOpen(false); // Close camera
    }
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  if (cameraOpen) {
    return (
      <CameraView style={styles.camera} ref={cameraRef} facing={facing}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
            <Text style={styles.text}>📸 Take Picture</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.captureButton} onPress={toggleCameraFacing}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
    );
  }

  return (
    <SafeAreaView className="bg-primary flex-1">
      <Image source={images.bg} className="absolute w-full z-0" />
      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false} contentContainerStyle={{ minHeight: "100%", paddingBottom: 10 }}>
        <Image source={icons.logo} className="w-12 h-10 mt-20 mb-5 mx-auto" />

        <Text className="text-lg text-white font-bold mt-5">Profile</Text>

        {photo ? (
          <Image source={{ uri: photo }} style={styles.profileImage} />
        ) : (
          <Text style={styles.placeholder}>No Profile Picture</Text>
        )}

        <TouchableOpacity onPress={openCamera}>
          <Text style={styles.text}>Take Image</Text>
        </TouchableOpacity>

        {/* Input fields for profile details */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="First Name"
            placeholderTextColor="#888"
            value={firstName}
            onChangeText={setFirstName}
          />
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            placeholderTextColor="#888"
            value={lastName}
            onChangeText={setLastName}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#888"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={saveProfileData}>
          <Text style={styles.text}>Save Profile</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

// 🔹 STYLES
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  placeholder: {
    fontSize: 16,
    color: '#888',
    marginBottom: 20,
  },
  profileImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 20,
  },
  takeImageButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
  },
  text: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  camera: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  buttonContainer: {
    alignSelf: 'center',
    marginBottom: 30,
  },
  captureButton: {
    backgroundColor: '#ff4757',
    padding: 15,
    borderRadius: 50,
    marginBottom: 100,
  },
  inputContainer: {
    marginTop: 20,
  },
  input: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
    color: '#333',
  },
  saveButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
});
