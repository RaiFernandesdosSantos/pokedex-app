import React, { useState, useEffect } from "react";
import {
  FlatList,
  View,
  Text,
  TouchableOpacity,
  TextInput,
} from "react-native";
import CardPokemon from "@/assets/components/CardPokemon"; // Ajuste o caminho se necessário
import { fetchAllPokemons, Pokemon } from "@/services/pokemonService";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "./index"; // Ajuste conforme a sua estrutura
import { useNavigation } from "@react-navigation/native";
import { styles } from "@/assets/style/IndexStyle";

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, "Home">;

export default function HomeScreen() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredPokemons, setFilteredPokemons] = useState<Pokemon[]>([]);
  const [searchText, setSearchText] = useState("");
  const navigation = useNavigation<HomeScreenNavigationProp>();

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
            onPress={() =>
              navigation.navigate("PokemonDetails", { pokemonId: item.id })
            }
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
