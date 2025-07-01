import React, { useEffect, useState } from "react";
import {
  FlatList,
  Text,
  ActivityIndicator,
  useWindowDimensions,
  View,
} from "react-native";
import { fetchKantoLeaders, GymLeader } from "@/services/gymService";
import {
  fetchPokemonDetails,
  PokemonDetailsData,
} from "@/services/pokemonService";
import GymLeaderCard from "@/assets/components/GymLeaderCard";
import { styles } from "@/assets/style/GymStyle";

type LeaderWithDetails = GymLeader & { teamDetails: PokemonDetailsData[] };

export default function GymScreen() {
  const [leadersWithDetails, setLeadersWithDetails] = useState<
    LeaderWithDetails[]
  >([]);
  const [loading, setLoading] = useState(true);
  const { width } = useWindowDimensions();
  const cardWidth = 180;
  const numColumns = Math.floor(width / cardWidth) || 1;

  useEffect(() => {
    async function loadDetails() {
      try {
        setLoading(true);
        const leaders = await fetchKantoLeaders();
        const allLeadersWithDetails = await Promise.all(
          leaders.map(async (leader) => {
            const teamDetails = await Promise.all(
              leader.team.map((pokemon) => fetchPokemonDetails(pokemon.id))
            );
            return { ...leader, teamDetails };
          })
        );
        setLeadersWithDetails(allLeadersWithDetails);
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
        keyExtractor={(leader) => leader.id}
        key={numColumns}
        numColumns={numColumns}
        renderItem={({ item }) => (
          <GymLeaderCard leader={item} teamDetails={item.teamDetails} />
        )}
        contentContainerStyle={{ alignItems: "center" }}
      />
    </View>
  );
}
