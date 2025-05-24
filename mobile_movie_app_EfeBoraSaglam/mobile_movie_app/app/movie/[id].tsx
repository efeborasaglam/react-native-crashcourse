import { View, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { fetchMovieDetails } from '@/services/api';
import useFetch from '@/services/useFetch';
import { icons } from '@/constants/icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useUser } from '@clerk/clerk-expo';


interface MovieInfoProps {
  label: string;
  value?: string | number | null;
}

const MovieInfo = ({ label, value }: MovieInfoProps) => (
  <View className="flex-col items-start justify-center mt-5">
    <Text className="text-light-100 font-normal text-sm">{label}</Text>
    <Text className="text-light-100 font-bold text-sm mt-2">
      {value || "N/A"}
    </Text>
  </View>
);

const Details = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { data: movie, loading } = useFetch(() => fetchMovieDetails(id as string));
  const [comment, setComment] = useState('');
  const { user } = useUser();

  type CommentType = { email: string; text: string };

  const [comments, setComments] = useState<CommentType[]>([]);

  useEffect(() => {
    const loadComments = async () => {
      const saved = await AsyncStorage.getItem(`comments_${id}`);
      if (saved) {
        setComments(JSON.parse(saved));
      }
    };
    loadComments();
  }, [id]);

  const submitComment = async () => {
    if (!comment.trim() || !user) return;
    const newComment = { email: user.emailAddresses[0].emailAddress, text: comment.trim() };
    const updatedComments = [...comments, newComment];
    setComments(updatedComments);
    setComment('');
    await AsyncStorage.setItem(`comments_${id}`, JSON.stringify(updatedComments));
  };



  const saveMovie = async () => {
    if (!movie) return;
    const saved = await AsyncStorage.getItem('savedMovies');
    const savedMovies = saved ? JSON.parse(saved) : [];
    const updatedMovies = [...savedMovies, movie];
    await AsyncStorage.setItem('savedMovies', JSON.stringify(updatedMovies));
  };

  if (loading)
    return (
      <SafeAreaView className="bg-primary flex-1">
        <ActivityIndicator />
      </SafeAreaView>
    );

  return (
    <View className="bg-primary flex-1">
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        <View>
          <Image
            source={{
              uri: movie?.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : "https://via.placeholder.com/500x750?text=No+Image",
            }}
            style={{ width: "100%", height: 550 }}
            resizeMode="cover"
          />

          <TouchableOpacity onPress={saveMovie} className="absolute top-5 right-5 rounded-full size-14 bg-white flex items-center justify-center">
            <Image source={icons.save} className="w-6 h-6" resizeMode="stretch" />
          </TouchableOpacity>
        </View>

        <View className="flex-col items-start justify-center mt-5 px-5">
          <Text className="text-white font-bold text-xl">{movie?.title}</Text>
          <View className="flex-row items-center gap-x-1 mt-2">
            <Text className="text-white  text-sm">
              {movie?.release_date?.split("-")[0]} •
            </Text>
            <Text className="text-white  text-sm">{movie?.runtime}m</Text>
          </View>

          <View className="flex-row items-center bg-dark-100 px-2 py-1 rounded-md gap-x-1 mt-2">
            <Image source={icons.star} className="size-4" />
            <Text className="text-white font-bold text-sm">
              {Math.round(movie?.vote_average ?? 0)}/10
            </Text>
            <Text className="text-white text-sm bg-fuchsia-950">
              ({movie?.vote_count} votes)
            </Text>
          </View>

          <MovieInfo label="Overview" value={movie?.overview} />
          <MovieInfo
            label="Genres"
            value={movie?.genres?.map((g) => g.name).join(" • ") || "N/A"}
          />

          <View className="flex flex-row justify-between w-1/2">
            <MovieInfo
              label="Budget"
              value={`$${(movie?.budget ?? 0) / 1_000_000} million`}
            />
            <MovieInfo
              label="Revenue"
              value={`$${Math.round(
                (movie?.revenue ?? 0) / 1_000_000
              )} million`}
            />
          </View>

          <MovieInfo
            label="Production Companies"
            value={
              movie?.production_companies?.map((c) => c.name).join(" • ") ||
              "N/A"
            }
            
          />
        </View>
        
                <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={100}
          className="mt-4 px-5"
        >
          <TextInput
            placeholder="Add a comment..."
            placeholderTextColor="#aaa"
            value={comment}
            onChangeText={setComment}
            className="bg-dark-100 text-white rounded-md px-4 py-3 mb-2"
          />
          <TouchableOpacity
            onPress={submitComment}
            className="bg-accent rounded-md py-3 flex items-center justify-center"
          >
            <Text className="text-white font-semibold">Submit Comment</Text>
          </TouchableOpacity>

          {/* Kommentare anzeigen */}
          <View className="mt-4">
            {comments.map((c, idx) => (
              <View key={idx} className="mb-3 bg-dark-100 rounded-md p-3">
                <Text className="text-xs text-white mb-1">{c.email}</Text>
                <Text className="text-white">{c.text}</Text>
              </View>
            ))}
          </View>
        </KeyboardAvoidingView>

      </ScrollView>

      <View className="mt-6 w-full">

              <TouchableOpacity
        className="mb-4 bottom-5 left-0 right-0 mx-5 bg-accent rounded-lg py-3.5 flex flex-row items-center justify-center z-50"
        onPress={router.back}
      >
        <Image
          source={icons.arrow}
          className="size-5 mr-1 mt-0.5 rotate-180"
          tintColor="#fff"
        />
        <Text className="text-white font-semibold text-base">Go Back</Text>
      </TouchableOpacity>


      </View>

    </View>
  );
};

export default Details;
