import React, { useEffect, useState } from "react";
import { ScrollView, Text } from "react-native";
import { kantoGymLeaders } from "../../services/gymService";
import {
  fetchPokemonDetails,
  PokemonDetailsData,
} from "../../services/pokemonService";
import GymLeaderCard from "../../assets/components/GymLeaderCard";
import { styles } from "../../assets/style/GymStyle";

export default function GymScreen() {
  const [leadersWithDetails, setLeadersWithDetails] = useState<any[]>([]);

  useEffect(() => {
    async function loadDetails() {
      const all = await Promise.all(
        kantoGymLeaders.map(async (leader) => {
          const teamDetails: PokemonDetailsData[] = await Promise.all(
            leader.team.map((pokeId) => fetchPokemonDetails(pokeId))
          );
          return { ...leader, teamDetails };
        })
      );
      setLeadersWithDetails(all);
    }
    loadDetails();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Líderes de Ginásio (Kanto)</Text>
      {leadersWithDetails.map((leader) => (
        <GymLeaderCard
          key={leader.name}
          leader={leader}
          teamDetails={leader.teamDetails}
        />
      ))}
    </ScrollView>
  );
}
