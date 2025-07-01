import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, Stack } from "expo-router";
import { fetchKantoLeaders, GymLeader } from "@/services/gymService";
import {
  fetchPokemonDetails,
  PokemonDetailsData,
} from "@/services/pokemonService";
import TeamMemberCard from "@/assets/components/TeamMemberCard";
import { usePokemonTeam, TeamPokemon } from "@/context/PokemonTeamContext";
import {
  getPokemonTypeWeaknesses,
  getPokemonTypeResistances,
} from "@/services/typeService";

type AdvantageAvatarProps = {
  pokemon: TeamPokemon;
  advantageType: "advantage" | "disadvantage";
};

const AdvantageAvatar: React.FC<AdvantageAvatarProps> = ({
  pokemon,
  advantageType,
}) => (
  <View style={{ alignItems: "center", marginHorizontal: 5 }}>
    <Image
      source={{ uri: pokemon.imageUrl }}
      style={[
        styles.advantageImage,
        { borderColor: advantageType === "advantage" ? "#4caf50" : "#c2343a" },
      ]}
    />
    <Text style={styles.advantageName}>{pokemon.name}</Text>
  </View>
);

export default function GymLeaderDetailScreen() {
  const { leaderId } = useLocalSearchParams();
  const [leader, setLeader] = useState<GymLeader | null>(null);
  const [teamDetails, setTeamDetails] = useState<PokemonDetailsData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { team: userTeam } = usePokemonTeam();
  const [advantageousPokemon, setAdvantageousPokemon] = useState<TeamPokemon[]>(
    []
  );
  const [disadvantageousPokemon, setDisadvantageousPokemon] = useState<
    TeamPokemon[]
  >([]);

  useEffect(() => {
    const loadLeaderData = async () => {
      setIsLoading(true);
      try {
        const allLeaders = await fetchKantoLeaders();
        const currentLeader = allLeaders.find((l) => l.id === leaderId);
        if (currentLeader) {
          setLeader(currentLeader);
          const details = await Promise.all(
            currentLeader.team.map((pokemon) => fetchPokemonDetails(pokemon.id))
          );
          setTeamDetails(details);
        }
      } catch (error) {
        console.error("Error loading leader data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (leaderId) {
      loadLeaderData();
    }
  }, [leaderId]);

  useEffect(() => {
    const checkMatchup = async () => {
      if (!userTeam.length || !teamDetails.length || !leader) return;
      const leaderTeamTypes = new Set(teamDetails.flatMap((p) => p.types));
      const leaderWeaknesses = new Set<string>();
      for (const type of leaderTeamTypes) {
        const weaknesses = await getPokemonTypeWeaknesses([type]);
        weaknesses.forEach((w) => leaderWeaknesses.add(w));
      }
      const leaderResistances = new Set<string>();
      for (const type of leaderTeamTypes) {
        const resistances = await getPokemonTypeResistances([type]);
        resistances.forEach((r) => leaderResistances.add(r));
      }
      const advantages = userTeam.filter((userPoke) =>
        userPoke.types.some((userType) => leaderWeaknesses.has(userType))
      );
      const disadvantages = userTeam.filter((userPoke) =>
        userPoke.types.some((userType) => leaderResistances.has(userType))
      );
      setAdvantageousPokemon(advantages);
      setDisadvantageousPokemon(disadvantages);
    };
    checkMatchup();
  }, [userTeam, teamDetails, leader]);

  const teamForView = teamDetails.map((pokemonDetail) => {
    const leaderPokemonInfo = leader?.team.find(
      (p) => p.id === pokemonDetail.id
    );
    return {
      id: pokemonDetail.id,
      name: pokemonDetail.name,
      imageUrl: pokemonDetail.imageUrl,
      types: pokemonDetail.types,
      stats: pokemonDetail.stats,
      ability: pokemonDetail.abilities[0] || "unknown",
      moves: pokemonDetail.learnableMoves?.slice(0, 4).map((m) => m.name) || [],
      level: leaderPokemonInfo?.level || 1,
      heldItem: null,
    };
  });

  if (isLoading) {
    return <ActivityIndicator size="large" style={styles.loadingContainer} />;
  }
  if (!leader) {
    return (
      <Text style={styles.errorText}>Líder de ginásio não encontrado.</Text>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{ title: `Time de ${leader.name}` }} />
      {teamForView.map((pokemon) => (
        <View style={styles.cardWrapper} key={pokemon.id}>
          <TeamMemberCard pokemon={pokemon} isEditable={false} />
        </View>
      ))}
      <View style={styles.advantageSection}>
        <Text style={styles.advantageTitle}>Sua Vantagem Estratégica</Text>
        {advantageousPokemon.length > 0 ? (
          <FlatList
            horizontal
            data={advantageousPokemon}
            renderItem={({ item }) => (
              <AdvantageAvatar pokemon={item} advantageType="advantage" />
            )}
            keyExtractor={(poke) => poke.id.toString()}
          />
        ) : (
          <Text style={styles.noAdvantageText}>
            Nenhum Pokémon do seu time possui vantagem de tipo clara.
          </Text>
        )}
        <Text style={[styles.advantageTitle, { marginTop: 16 }]}>
          Para Ficar de Olho (Desvantagens)
        </Text>
        {disadvantageousPokemon.length > 0 ? (
          <FlatList
            horizontal
            data={disadvantageousPokemon}
            renderItem={({ item }) => (
              <AdvantageAvatar pokemon={item} advantageType="disadvantage" />
            )}
            keyExtractor={(poke) => poke.id.toString()}
          />
        ) : (
          <Text style={styles.noAdvantageText}>
            Seu time não possui desvantagens de tipo óbvias.
          </Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgb(228, 227, 231)",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 18,
    color: "red",
  },
  cardWrapper: {
    width: 360,
    maxWidth: 420,
    alignSelf: "center",
    marginBottom: 12,
  },
  advantageSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 20,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginHorizontal: 16,
  },
  advantageTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  advantageImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#4caf50",
  },
  advantageName: {
    fontSize: 12,
    marginTop: 4,
  },
  noAdvantageText: {
    fontStyle: "italic",
    color: "gray",
  },
});
