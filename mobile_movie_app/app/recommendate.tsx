import React, { useEffect, useState } from "react";
import {
  ScrollView,
  FlatList,
  Text,
  TouchableOpacity,
  View,
  Image,
  ActivityIndicator,
} from "react-native";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { router } from "expo-router";
import useFetch from "@/services/useFetch";
import MovieCard from "@/components/MovieCard";
import { getTrendingMovies } from "@/services/appwrite";

const TMDB_SEARCH_URL = "https://api.themoviedb.org/3/search/movie";
const BEARER_TOKEN =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyMGJiNmVlOWVkMWIzOTU2NzI3ZTk4N2FiYjVkMTYzNyIsIm5iZiI6MTc0MjQ1ODA0NC4wNTQwMDAxLCJzdWIiOiI2N2RiY2NiY2M2MGQ1MTc3YWRlOWZkZDIiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.Co_FbU2yCYva9H7JzOf4LylnWpmMssbCS0QE63RN5DE";

const BACKEND_RECOMMEND_URL = "http://127.0.0.1:5000/recommend";

const Recommended = () => {
  const [movieName, setMovieName] = useState("");
  const [recommendedTitles, setRecommendedTitles] = useState<string[]>([]);
  const [recommendedMovies, setRecommendedMovies] = useState<object[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | Error>(null);

  const {
    data: trendingMovies,
    loading: trendingLoading,
    error: trendingError,
  } = useFetch(getTrendingMovies);

  // Set movieName automatisch auf den ersten Trending-Film
  useEffect(() => {
    if (trendingMovies && trendingMovies.length > 0 && !movieName) {
      setMovieName(trendingMovies[0].title);
    }
  }, [trendingMovies]);

  // Hole Empfehlungen vom Backend
  useEffect(() => {
    if (!movieName) return;

    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        const res = await fetch(BACKEND_RECOMMEND_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ movie_name: movieName }),
        });

        const data = await res.json();
        const titles = data.recommended_movies || [];

        setRecommendedTitles(titles);

        const results: any[] = [];
        for (const title of titles) {
          const tmdbRes = await fetch(
            `${TMDB_SEARCH_URL}?query=${encodeURIComponent(title)}`,
            {
              headers: {
                Authorization: `Bearer ${BEARER_TOKEN}`,
                Accept: "application/json",
              },
            }
          );

          const tmdbData = await tmdbRes.json();
          if (tmdbData.results && tmdbData.results.length > 0) {
            results.push(tmdbData.results[0]);
          }
        }

        setRecommendedMovies(results);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [movieName]);

  return (
    <ScrollView className="flex-1 bg-primary px-5">
      <Image
        source={images.bg}
        className="absolute w-full h-full z-0"
        resizeMode="cover"
      />
      <Text className="text-white text-2xl font-bold mt-20 mb-5 text-center">
        Empfohlene Filme
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color="#fff" className="mt-10" />
      ) : error ? (
        <Text className="text-red-500">Fehler: {error.message}</Text>
      ) : (
        <FlatList
          data={recommendedMovies}
          renderItem={({ item }) =>
            item && typeof item === "object" ? (
              <MovieCard
                id={0}
                title={""}
                adult={false}
                backdrop_path={""}
                genre_ids={[]}
                original_language={""}
                original_title={""}
                overview={""}
                popularity={0}
                poster_path={""}
                release_date={""}
                video={false}
                vote_average={0}
                vote_count={0}
                {...item}
              />
            ) : null
          }
          keyExtractor={(item) =>
            item && typeof item === "object" && "id" in item
              ? (item as { id: number }).id.toString()
              : Math.random().toString()
          }
          numColumns={3}
          columnWrapperStyle={{
            justifyContent: "flex-start",
            gap: 20,
            marginBottom: 20,
          }}
          scrollEnabled={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}

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
        <Text className="text-white font-semibold text-base">
          Get Recommendation
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Recommended;
