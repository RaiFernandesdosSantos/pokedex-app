import React, { useState, useEffect, useRef } from "react";
import {
  FlatList,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  useWindowDimensions,
  Animated,
  Easing,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CardPokemon from "@/assets/components/CardPokemon";
import { fetchAllPokemons, Pokemon } from "@/services/pokemonService";
import { styles } from "@/assets/style/IndexStyle";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";

export default function HomeScreen() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const router = useRouter();
  const { user } = useAuth();
  const { width } = useWindowDimensions(); // Hook to get screen dimensions
  const searchAnimation = useRef(new Animated.Value(0)).current;
  // Calculate number of columns based on screen width
  const cardWidth = 160; // Card width from CardStyle.ts
  const cardMargin = 8 * 2; // Margin from CardStyle.ts (both sides)
  const numColumns = Math.floor(width / (cardWidth + cardMargin)) || 1; // Ensure at least 1 column

  const toggleSearch = () => {
    const toValue = isSearchVisible ? 0 : 1;
    Animated.timing(searchAnimation, {
      toValue,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: false, // 'width' is not supported by native driver
    }).start();
    setIsSearchVisible(!isSearchVisible);
  };

  // Interpolate for search bar width
  const searchBarWidth = searchAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "85%"], // From 0% to 85% of width
  });

  useEffect(() => {
    async function loadPokemons() {
      const data = await fetchAllPokemons(151);
      setPokemons(data);
      setLoading(false);
    }
    loadPokemons();
  }, []);

  const filtrados = pokemons.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(searchText.toLowerCase())
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={localStyles.header}>
        {/* Search icon to toggle visibility */}
        <TouchableOpacity onPress={toggleSearch}>
          <Ionicons name="search" size={24} color="black" />
        </TouchableOpacity>

        {/* Animated search bar */}
        <Animated.View style={{ width: searchBarWidth, marginLeft: 8 }}>
          {isSearchVisible && (
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar Pokémon"
              value={searchText}
              onChangeText={setSearchText}
              autoFocus={true} // Focus automatically when opened
            />
          )}
        </Animated.View>
      </View>
      <FlatList
        data={filtrados}
        keyExtractor={(item) => item.id.toString()}
        key={numColumns} // Important: Changes key when orientation changes, forcing re-render
        numColumns={numColumns} // Use dynamic value based on screen width
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.cardContainer}
            onPress={() => router.push(`/${item.id}`)}
          >
            <CardPokemon
              number={item.id}
              name={item.name}
              types={item.types}
              imageUrl={item.imageUrl}
            />
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.gridContainer}
      />
    </View>
  );
}

const localStyles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "rgb(228, 227, 231)", // Light gray background as per theme
  },
});
