import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { View, Text, Image, FlatList, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useEffect } from "react";
import MovieCard from "@/components/MovieCard";

const Save = () => {
  const [savedMovies, setSavedMovies] = useState<{ id: number; [key: string]: any }[]>([]);

  useEffect(() => {
    const loadSavedMovies = async () => {
      const saved = await AsyncStorage.getItem("savedMovies");
      setSavedMovies(saved ? JSON.parse(saved).map((movie: any) => ({ ...movie, id: Number(movie.id) })) : []);
    };
    loadSavedMovies();
  }, []);

  const removeMovie = async (id: any) => {
    const updatedMovies = savedMovies.filter((movie) => movie.id !== id);
    setSavedMovies(updatedMovies);
    await AsyncStorage.setItem("savedMovies", JSON.stringify(updatedMovies));
  };

  return (
    <SafeAreaView className="bg-primary flex-1">
      <Image source={images.bg} className="absolute w-full z-0" />
      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false} contentContainerStyle={{ minHeight: "100%", paddingBottom: 10 }}>
        <Image source={icons.logo} className="w-12 h-10 mt-20 mb-5 mx-auto" />
        <Text className="text-lg text-white font-bold mt-5 mb-3">Saved Movies</Text>
        {savedMovies.length === 0 ? (
          <Text className="text-gray-500 text-base text-center">No saved movies</Text>
        ) : (
          <FlatList
            data={savedMovies}
            renderItem={({ item }) => (
              <View className="relative w-[30%]"> 
               <Text className="text-white text-sm font-bold">X</Text>
                <MovieCard title={""} adult={false} backdrop_path={""} genre_ids={[]} original_language={""} original_title={""} overview={""} popularity={0} poster_path={""} release_date={""} video={false} vote_average={0} vote_count={0} {...item} />
                <TouchableOpacity
                  className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-red-600 rounded-full p-2"
                  onPress={() => removeMovie(item.id)}
                >
                 
                </TouchableOpacity>
              </View>
            )}
            keyExtractor={(item) => item.id.toString()}
            numColumns={3}
            columnWrapperStyle={{
              justifyContent: "space-between",
              marginBottom: 20,
            }}
            className="mt-2 pb-32"
            scrollEnabled={false}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Save;