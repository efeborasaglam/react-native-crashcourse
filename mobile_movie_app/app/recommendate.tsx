import React, { useState } from "react";
import {
    SafeAreaView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    FlatList,
    Image,
    ActivityIndicator,
} from "react-native";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { router } from "expo-router";
import MovieDisplayCard from "@/components/MovieCard";
import Search from "./(tabs)/search";
import SearchBar from "@/components/SearchBar";

const TMDB_API_URL = "https://api.themoviedb.org/3/search/movie";
const BEARER_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyMGJiNmVlOWVkMWIzOTU2NzI3ZTk4N2FiYjVkMTYzNyIsIm5iZiI6MTc0MjQ1ODA0NC4wNTQwMDAxLCJzdWIiOiI2N2RiY2NiY2M2MGQ1MTc3YWRlOWZkZDIiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.Co_FbU2yCYva9H7JzOf4LylnWpmMssbCS0QE63RN5DE";

const Recommendate = () => {
    const [query, setQuery] = useState("");
    const [movies, setMovies] = useState<{ id: number; title: string; poster_path?: string }[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchMovies = async () => {
        if (!query.trim()) return;

        setLoading(true);
        setError("");
        try {
            const res = await fetch(`${TMDB_API_URL}?query=${encodeURIComponent(query)}`, {
                headers: {
                    Authorization: `Bearer ${BEARER_TOKEN}`,
                    Accept: "application/json",
                },
            });

            const data = await res.json();
            if (data.results) {
                setMovies(data.results);
            } else {
                setMovies([]);
                setError("Keine Filme gefunden.");
            }
        } catch (e: any) {
            setError("Fehler beim Laden der Filme.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-primary px-5">
            <Image source={images.bg} className="absolute w-full h-full z-0" resizeMode="cover" />
            <View className="mt-20">
                <Text className="text-white text-xl font-bold mb-4">What do you want to watch?</Text>
                <SearchBar
                    value={query}
                    onChangeText={setQuery}
                    placeholder="z. B. Action mit Tom Cruise"
                />
                <TouchableOpacity
                    onPress={fetchMovies}
                    className="left-0 right-0 mx-5 bg-accent rounded-lg py-3.5 flex flex-row items-center justify-center z-50"
                >
                    <Text className="text-white font-semibold text-base">Empfehlen</Text>
                </TouchableOpacity>
            </View>

            {loading && <ActivityIndicator className="mt-5" size="large" color="#fff" />}
            {error ? <Text className="text-red-500 mt-5">{error}</Text> : null}

            <FlatList
                className="px-5"
                data={movies}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <MovieDisplayCard
                        {...item}
                        adult={false} // Default value
                        backdrop_path={item.poster_path || ""} // Use poster_path as fallback
                        genre_ids={[]} // Default empty array
                        original_language="en" // Default language
                        original_title={item.title} // Use title as fallback
                        overview="" // Default empty string
                        popularity={0} // Default value
                        release_date="" // Default empty string
                        video={false} // Default value
                        vote_average={0} // Default value
                        vote_count={0} // Default value
                    />
                )}
                numColumns={3}
                columnWrapperStyle={{
                    justifyContent: "flex-start",
                    gap: 16,
                    marginVertical: 16,
                }}
                contentContainerStyle={{ paddingBottom: 100 }}
                ListHeaderComponent={<></>}
                ListEmptyComponent={
                    !loading && !error ? (
                        <View className="mt-10 px-5">
                            <Text className="text-center text-gray-500">
                                {query.trim()
                                    ? "No movies found"
                                    : "Start describing movies to get recommendations"}
                            </Text>
                        </View>
                    ) : null
                }
            />
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
        </SafeAreaView>
    );
};

export default Recommendate;
