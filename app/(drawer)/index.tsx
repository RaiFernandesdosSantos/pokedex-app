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

  const handleProfileOrLogin = () => {
    if (user) {
      // If logged in, navigate to profile screen
      router.push("/(drawer)/perfil");
    } else {
      router.push("/login");
    }
  };

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
        <TouchableOpacity
          style={localStyles.profileButton}
          onPress={handleProfileOrLogin}
        >
          <Text style={localStyles.profileButtonText}>
            {user ? "Perfil" : "Login"}
          </Text>
        </TouchableOpacity>
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
  profileButton: {
    backgroundColor: "rgb(206, 52, 58)", // Red as per theme
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginLeft: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  profileButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 14,
  },
});
