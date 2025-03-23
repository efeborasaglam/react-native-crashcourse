import { StatusBar } from 'expo-status-bar';
import { Text, View, Image, ScrollView } from 'react-native';
import { Redirect, router } from 'expo-router';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import {images} from '../constants';
import CustomButton from '../components/CustomButton';
import { useGlobalContext } from '../context/GlobalProvider';


export default function App() {
  const {isLoading, isLoggedIn} = useGlobalContext();

  if(!isLoading && isLoggedIn) return <Redirect to="/home" />;

  return (
    <SafeAreaView className = "bg-primary h-full">
      <ScrollView contencContainerStyle = {{height: '100%'}}>
        <View className="w-full justify-center items-center min-h-[85vh] px-4">
        <Image
        source={images.logo_1}
        className="w-[130px] h-[84px]"
        resizeMode='contain'
        />

        <Image
        source={images.cards}
        className="max-w-[380px] w-full h-[300px]"
        resizeMode='contain'
        />

        <View className="relative mt-5 flex flex-row">
          <Text className="text-3xl text-white font-bold text-center">Discover Endless Possibilities with {'  '}</Text>
          <Text className="text-secondary-200 text-3xl mt-8">EFSHARE</Text>

          <Image
          source={images.path}
          className="absolute w-[136px] h-15px -bottom-6 -right-1"
          resizeMode='contain'
          />
        </View>
        <Text className="text-sm font-pregular text-gray-100 mt-9 text-center">
          Where creativity meets innovation: embark on a journey of limitless expolration with Efshare
        </Text>

        <CustomButton
          title="Continue with Email"
          handlePress={() => router.push('/sign-in')}
          containerStyles="w-full mt-7"
        />
        </View>
      </ScrollView>
      <StatusBar backgroundColor='#161622' style='light'/>
    </SafeAreaView>
  );
}


// nur der benutzung von Tailwind gibt fehler