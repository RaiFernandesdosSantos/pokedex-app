import React, { useState, useEffect } from "react";
import {
  FlatList,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";
import CardPokemon from "@/assets/components/CardPokemon";
import { fetchAllPokemons, Pokemon } from "@/services/pokemonService";
import { styles } from "@/assets/style/IndexStyle";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";

export default function HomeScreen() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const router = useRouter();
  const { user } = useAuth();

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
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar Pokémon"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>
      <FlatList
        data={filtrados}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3}
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
