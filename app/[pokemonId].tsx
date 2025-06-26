import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  Button,
  StyleSheet,
  FlatList,
} from "react-native";
import EvolutionStage from "@/assets/components/EvolutionStage";
import TypeBadge from "@/assets/components/TypeBadge";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { usePokemonTeam } from "../context/PokemonTeamContext";
import {
  fetchPokemonDetails,
  PokemonDetailsData,
} from "@/services/pokemonService";
import { getTypeColor, styles } from "@/assets/style/DetalhesStyle";

export default function PokemonDetails() {
  const { pokemonId } = useLocalSearchParams<{ pokemonId: string }>();
  const [pokemon, setPokemon] = useState<PokemonDetailsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [debugMessage, setDebugMessage] = useState<string>("Initializing...");
  const { addToTeam } = usePokemonTeam();
  const navigation = useNavigation();

  useEffect(() => {
    async function loadPokemonDetails() {
      if (!pokemonId) {
        console.error("No pokemonId provided");
        setLoading(false);
        setDebugMessage("Error: No Pokémon ID provided.");
        return;
      }
      setDebugMessage("Loading Pokémon data for ID: " + pokemonId);
      try {
        console.log("Fetching data for Pokémon ID:", pokemonId);
        const data = await fetchPokemonDetails(Number(pokemonId));
        console.log("Data fetched successfully:", data);
        setPokemon(data);
        setDebugMessage(
          "Data loaded successfully for Pokémon ID: " + pokemonId
        );
      } catch (error) {
        console.error("Erro ao carregar os detalhes:", error);
        if (error instanceof Error) {
          console.error("Error message:", error.message);
          console.error("Error stack:", error.stack);
          setDebugMessage("Error loading data: " + error.message);
        } else {
          setDebugMessage("Unknown error loading data.");
        }
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
        <Text style={localStyles.debugText}>{debugMessage}</Text>
      </View>
    );
  }

  if (!pokemon) {
    return (
      <View style={styles.errorContainer}>
        <Text>
          Erro ao carregar os dados do Pokémon. Por favor, tente novamente.
        </Text>
        <Text style={localStyles.debugText}>{debugMessage}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={localStyles.debugText}>{debugMessage}</Text>
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
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Evoluções:</Text>
        <FlatList
          horizontal
          data={pokemon.evolutionChain}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item, index }) => (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <EvolutionStage {...item} />
              {index < pokemon.evolutionChain.length - 1 && (
                <Text style={{ fontSize: 24, marginHorizontal: 10 }}>→</Text>
              )}
            </View>
          )}
        />
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Fraquezas (Dano x2):</Text>
        <View style={localStylesExtended.typeGrid}>
          {pokemon.damageRelations.weaknesses.map((type) => (
            <TypeBadge key={type} typeName={type} />
          ))}
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Resistências (Dano x0.5):</Text>
        <View style={localStylesExtended.typeGrid}>
          {pokemon.damageRelations.resistances.map((type) => (
            <TypeBadge key={type} typeName={type} />
          ))}
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Imunidades (Dano x0):</Text>
        <View style={localStylesExtended.typeGrid}>
          {pokemon.damageRelations.immunities.map((type) => (
            <TypeBadge key={type} typeName={type} />
          ))}
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Descrição da Pokédex:</Text>
        <View style={localStylesExtended.pokedexDescription}>
          <Text style={localStylesExtended.pokedexText}>
            {pokemon.pokedexDescription}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const localStyles = StyleSheet.create({
  debugText: {
    color: "rgb(206, 52, 58)", // Red as per theme for visibility
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    padding: 5,
    borderRadius: 5,
  },
});

// Local styles for new UI elements
const localStylesExtended = StyleSheet.create({
  typeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  pokedexDescription: {
    backgroundColor: "#f0f0f0",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginTop: 5,
  },
  pokedexText: {
    fontFamily: "monospace",
    fontSize: 14,
    color: "#333",
  },
});
