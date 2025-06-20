import React, { useState, useEffect } from "react";
import {
  FlatList,
  View,
  Text,
  TouchableOpacity,
  TextInput,
} from "react-native";
import CardPokemon from "@/assets/components/CardPokemon";
import { fetchAllPokemons, Pokemon } from "@/services/pokemonService";
import { styles } from "@/assets/style/IndexStyle";
import { useRouter } from "expo-router";

const router = useRouter();

export default function HomeScreen() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredPokemons, setFilteredPokemons] = useState<Pokemon[]>([]);
  const [searchText, setSearchText] = useState("");

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
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar Pokémon"
        value={searchText}
        onChangeText={setSearchText}
      />
      <FlatList
        data={pokemons}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.cardContainer}
            onPress={() => router.push(`/Home/${item.id}`)}
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
