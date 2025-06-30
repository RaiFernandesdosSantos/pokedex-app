import React, { useEffect, useState } from "react";
import {
  FlatList,
  Text,
  ActivityIndicator,
  useWindowDimensions,
  View,
} from "react-native";
import { kantoGymLeaders } from "../../services/gymService";
import {
  fetchPokemonDetails,
  PokemonDetailsData,
} from "../../services/pokemonService";
import GymLeaderCard from "../../assets/components/GymLeaderCard";
import { styles } from "../../assets/style/GymStyle";

export default function GymScreen() {
  const [leadersWithDetails, setLeadersWithDetails] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { width } = useWindowDimensions(); // Hook to get screen width
  // Calculate number of columns based on screen width
  const cardWidth = 160; // Approximate width of leader card
  const numColumns = Math.floor(width / cardWidth) || 1; // Ensure at least 1 column

  useEffect(() => {
    async function loadDetails() {
      try {
        const all = await Promise.all(
          kantoGymLeaders.map(async (leader) => {
            // Mapeia sobre o objeto {id, level} para pegar apenas o ID para o fetch
            const teamDetails: PokemonDetailsData[] = await Promise.all(
              leader.team.map((pokemon) => fetchPokemonDetails(pokemon.id))
            );
            return { ...leader, teamDetails };
          })
        );
        setLeadersWithDetails(all);
      } catch (error) {
        console.error("Erro ao carregar detalhes dos líderes:", error);
      } finally {
        setLoading(false);
      }
    }
    loadDetails();
  }, []);

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        style={{ flex: 1, justifyContent: "center" }}
      />
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Líderes de Ginásio (Kanto)</Text>
      <FlatList
        data={leadersWithDetails}
        keyExtractor={(leader) => leader.name}
        key={numColumns} // Forces re-render if number of columns changes
        numColumns={numColumns}
        renderItem={({ item }) => (
          <GymLeaderCard leader={item} teamDetails={item.teamDetails} />
        )}
        contentContainerStyle={{ alignItems: "center" }}
      />
    </View>
  );
}
