import React, { useEffect, useState } from "react";
import { View, Text, Image, ScrollView, Button } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { usePokemonTeam } from "../../context/PokemonTeamCotext";
import {
  fetchPokemonDetails,
  PokemonDetailsData,
} from "@/services/pokemonService";
import { getTypeColor, styles } from "@/assets/style/DetalhesStyle";
import { useNavigation } from "expo-router";

type PokemonDetailsParams = {
  PokemonDetails: {
    pokemonId: number;
  };
};

type PokemonDetailsRouteProp = RouteProp<
  PokemonDetailsParams,
  "PokemonDetails"
>;

export default function PokemonDetails() {
  const route = useRoute<PokemonDetailsRouteProp>();
  const { pokemonId } = route.params;
  const [pokemon, setPokemon] = useState<PokemonDetailsData | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToTeam } = usePokemonTeam();
  const navigation = useNavigation();

  useEffect(() => {
    async function loadPokemonDetails() {
      try {
        const data = await fetchPokemonDetails(pokemonId);
        setPokemon(data);
      } catch (error) {
        console.error("Erro ao carregar os detalhes:", error);
      } finally {
        setLoading(false);
      }
    }
    loadPokemonDetails();
  }, [pokemonId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  if (!pokemon) {
    return (
      <View style={styles.errorContainer}>
        <Text>Erro ao carregar os dados do Pokémon.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image style={styles.image} source={{ uri: pokemon.imageUrl }} />
      <Text style={styles.title}>{pokemon.name}</Text>
      <View style={{ marginTop: 20 }}>
        <Button
          title="Adicionar ao Time"
          onPress={() => {
            addToTeam(pokemon);
            navigation.goBack();
          }}
        />
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tipos:</Text>
        <View style={styles.typesContainer}>
          {pokemon.types.map((type) => (
            <View
              key={type}
              style={[styles.typeBox, { backgroundColor: getTypeColor(type) }]}
            >
              <Text style={styles.typeText}>{type}</Text>
            </View>
          ))}
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Habilidades:</Text>
        {pokemon.abilities.map((ability) => (
          <Text key={ability} style={styles.textItem}>
            {ability}
          </Text>
        ))}
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Estatísticas:</Text>
        {pokemon.stats.map((stat) => (
          <View key={stat.name} style={styles.statContainer}>
            <Text style={styles.textItem}>
              {stat.name}: {stat.base_stat}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
