import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  FlatList,
  Image,
} from "react-native";
import { useLocalSearchParams, Stack } from "expo-router";
import { kantoGymLeaders } from "@/services/gymService";
import {
  fetchPokemonDetails,
  PokemonDetailsData,
} from "@/services/pokemonService";
import TeamMemberCard from "@/assets/components/TeamMemberCard";
import { usePokemonTeam, TeamPokemon } from "@/context/PokemonTeamContext";
import { getPokemonTypeWeaknesses } from "@/services/typeService";

export default function GymLeaderDetailScreen() {
  const { leaderId } = useLocalSearchParams<{ leaderId: string }>();
  const [teamDetails, setTeamDetails] = useState<PokemonDetailsData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { team: userTeam } = usePokemonTeam();
  const [advantageousPokemon, setAdvantageousPokemon] = useState<TeamPokemon[]>(
    []
  );

  // Encontra o líder correspondente no nosso serviço
  const leader = kantoGymLeaders.find((l) => l.id === leaderId);

  useEffect(() => {
    const loadTeamDetails = async () => {
      if (leader && leader.team.length > 0) {
        setIsLoading(true);
        try {
          // Busca detalhes usando o novo formato {id, level}
          const details = await Promise.all(
            leader.team.map((pokemon) => fetchPokemonDetails(pokemon.id))
          );
          setTeamDetails(details);
        } catch (error) {
          console.error("Error loading team details:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };
    loadTeamDetails();
  }, [leader]);

  // NOVO useEffect para calcular a vantagem estratégica
  useEffect(() => {
    const checkAdvantages = async () => {
      if (!userTeam || userTeam.length === 0 || teamDetails.length === 0)
        return;
      const leaderTeamTypes = new Set(teamDetails.flatMap((p) => p.types));
      const effectiveUserPokemon = new Set<TeamPokemon>();
      const leaderWeaknesses = new Set<string>();
      for (const type of leaderTeamTypes) {
        const weaknesses = await getPokemonTypeWeaknesses([type]);
        weaknesses.forEach((w) => leaderWeaknesses.add(w));
      }
      userTeam.forEach((userPoke) => {
        if (userPoke.types.some((userType) => leaderWeaknesses.has(userType))) {
          effectiveUserPokemon.add(userPoke);
        }
      });
      setAdvantageousPokemon(Array.from(effectiveUserPokemon));
    };
    checkAdvantages();
  }, [userTeam, teamDetails]);

  // LÓGICA DE MAPEAMENTO FINALMENTE CORRETA
  const teamForView = teamDetails.map((pokemonDetail) => {
    // Encontra o Pokémon no time do líder para pegar seu nível específico
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
      level: leaderPokemonInfo?.level || 50, // <-- USA O NÍVEL CORRETO!
      heldItem: null,
    };
  });

  if (!leader) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Líder de ginásio não encontrado.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Configura o título do header dinamicamente */}
      <Stack.Screen options={{ title: `Time de ${leader.name}` }} />
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loadingText}>Carregando time...</Text>
        </View>
      ) : (
        <>
          <View style={styles.teamWrapper}>
            <FlatList
              data={teamForView}
              renderItem={({ item }) => (
                <View style={styles.cardWrapper}>
                  <TeamMemberCard pokemon={item} isEditable={false} />
                </View>
              )}
              keyExtractor={(item) => item.id.toString()}
              numColumns={1}
              contentContainerStyle={{ alignItems: "center" }}
            />
          </View>
          {/* NOVA SEÇÃO DE ANÁLISE ESTRATÉGICA */}
          <View style={styles.advantageSection}>
            <Text style={styles.advantageTitle}>Sua Vantagem Estratégica</Text>
            {advantageousPokemon.length > 0 ? (
              <FlatList
                horizontal
                data={advantageousPokemon}
                keyExtractor={(poke) => poke.id.toString()}
                renderItem={({ item }) => (
                  <View style={{ alignItems: "center", marginHorizontal: 5 }}>
                    <Image
                      source={{ uri: item.imageUrl }}
                      style={styles.advantageImage}
                    />
                    <Text style={styles.advantageName}>{item.name}</Text>
                  </View>
                )}
              />
            ) : (
              <Text style={styles.noAdvantageText}>
                Seu time não possui vantagem de tipo clara.
              </Text>
            )}
          </View>
        </>
      )}
    </View>
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
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "gray",
  },
  errorText: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 18,
    color: "red",
  },
  teamWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
  },
  cardWrapper: {
    width: 360, // ou '95%' para responsivo
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
