import { Link, router } from 'expo-router'
import { icons } from '@/constants/icons';
import { images } from '@/constants/images';
import { Camera, CameraType, CameraView } from 'expo-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useRef, useEffect } from 'react';
import { Button, Image, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React from 'react';

const Recommendate = () => {
    return (

        <SafeAreaView className="bg-primary flex-1">
            <Image source={images.bg} className="absolute w-full z-0" />
            <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false} contentContainerStyle={{ minHeight: "100%", paddingBottom: 10 }}>
                <Image source={icons.logo} className="w-12 h-10 mt-20 mb-5 mx-auto" />
                <Text>Recommendate _____________</Text>
                <TouchableOpacity
                    className="left-0 right-0 mx-5 bg-accent rounded-lg py-3.5 flex flex-row items-center justify-center z-50"
                    style={{ marginBottom: 120 }}
                    onPress={() => router.push("/search")}
                >
                    <Image
                        source={icons.arrow}
                        className="size-5 mr-1 mt-0.5 rotate-180"
                        tintColor="#fff"
                    />
                    <Text className="text-white font-semibold text-base">Go Back</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    )
}

export default Recommendate

const styles = StyleSheet.create({})
