// GymLeaderCard.tsx
// Card de líder de ginásio interativo.
// - Recebe dados do líder e detalhes completos do time do líder.
// - Mostra imagem, nome, cidade, tipo e time do líder (com sprites e tipos).
// - Analisa vantagem de tipo do time do usuário contra o ginásio usando typeService.
// - Expande ao ser tocado para revelar análise estratégica detalhada.

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  LayoutAnimation,
} from "react-native";
import { useRouter } from "expo-router";
import { usePokemonTeam, TeamPokemon } from "@/context/PokemonTeamContext";
import TypeBadge from "@/assets/components/TypeBadge";
import styles from "@/assets/style/GymLeaderCardStyle";
import { PokemonDetailsData } from "@/services/pokemonService";

interface GymLeaderCardProps {
  leader: {
    id: string;
    name: string;
    city: string;
    type: string;
    imageUrl: string;
  };
  teamDetails: PokemonDetailsData[];
}

// Pequeno componente para o avatar do Pokémon do seu time
const UserPokemonAvatar = ({
  pokemon,
  isAdvantage,
}: {
  pokemon: TeamPokemon;
  isAdvantage: boolean;
}) => (
  <View style={{ alignItems: "center", margin: 4 }}>
    <Image
      source={{ uri: pokemon.imageUrl }}
      style={{
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: isAdvantage ? "#4caf50" : "#c2343a",
      }}
    />
    <Text style={{ fontSize: 10, color: isAdvantage ? "#4caf50" : "#c2343a" }}>
      {pokemon.name}
    </Text>
  </View>
);

export default function GymLeaderCard({
  leader,
  teamDetails,
}: GymLeaderCardProps) {
  const router = useRouter();
  const { team: userTeam } = usePokemonTeam();
  const [isExpanded, setIsExpanded] = useState(false); // Estado para controlar se o card está expandido
  const [advantageousPokemon, setAdvantageousPokemon] = useState<TeamPokemon[]>(
    []
  );
  const [disadvantageousPokemon, setDisadvantageousPokemon] = useState<
    TeamPokemon[]
  >([]);

  useEffect(() => {
    // A LÓGICA DE ANÁLISE APRIMORADA
    const checkAdvantages = () => {
      if (userTeam.length === 0) return;

      const leaderPokemonTypes = new Set(teamDetails.flatMap((p) => p.types));
      const effectiveUserPokemon = new Set<TeamPokemon>();
      const weakUserPokemon = new Set<TeamPokemon>();

      // Para cada Pokémon do time do líder, verificamos suas fraquezas e resistências
      leaderPokemonTypes.forEach((leaderType) => {
        const weaknesses =
          teamDetails.find((p) => p.types.includes(leaderType))?.damageRelations
            .weaknesses || [];
        const resistances =
          teamDetails.find((p) => p.types.includes(leaderType))?.damageRelations
            .resistances || [];

        // Verificamos se algum Pokémon do USUÁRIO tem um tipo que bate nessas fraquezas
        userTeam.forEach((userPoke) => {
          if (
            userPoke.types.some((userType) => weaknesses.includes(userType))
          ) {
            effectiveUserPokemon.add(userPoke);
          }
          if (
            userPoke.types.some((userType) => resistances.includes(userType))
          ) {
            weakUserPokemon.add(userPoke);
          }
        });
      });
      setAdvantageousPokemon(Array.from(effectiveUserPokemon));
      setDisadvantageousPokemon(Array.from(weakUserPokemon));
    };

    checkAdvantages();
  }, [userTeam, teamDetails]);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded(!isExpanded);
  };

  return (
    // O card agora navega para a página de detalhes do líder
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/ginasio/${leader.id}`)}
      activeOpacity={0.8}
    >
      {/* --- SEÇÃO SEMPRE VISÍVEL --- */}
      <Image source={{ uri: leader.imageUrl }} style={styles.leaderImage} />
      <View style={styles.infoContainer}>
        <Text style={styles.leaderName}>{leader.name}</Text>
        <Text style={styles.cityName}>{leader.city}</Text>
        <TypeBadge typeName={leader.type} />
      </View>

      {/* --- SEÇÃO EXPANSÍVEL --- */}
      {isExpanded && (
        <View style={{ marginTop: 16 }}>
          <Text style={styles.sectionTitle}>Time do Líder:</Text>
          <FlatList
            horizontal
            data={teamDetails}
            keyExtractor={(poke) => poke.id.toString()}
            renderItem={({ item }) => (
              <View style={{ alignItems: "center", marginRight: 12 }}>
                <Image
                  source={{ uri: item.imageUrl }}
                  style={styles.pokemonImage}
                />
                <Text style={{ fontSize: 12 }}>{item.name}</Text>
                <View style={{ flexDirection: "row", marginTop: 2 }}>
                  {item.types.map((t) => (
                    <TypeBadge key={t} typeName={t} />
                  ))}
                </View>
              </View>
            )}
            style={{ marginVertical: 8 }}
          />

          <Text style={styles.sectionTitle}>Sua Vantagem Estratégica:</Text>
          {advantageousPokemon.length > 0 ? (
            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              {advantageousPokemon.map((poke) => (
                <UserPokemonAvatar
                  key={poke.id}
                  pokemon={poke}
                  isAdvantage={true}
                />
              ))}
            </View>
          ) : (
            <Text style={styles.noAdvantageText}>
              Nenhum Pokémon do seu time possui vantagem de tipo clara.
            </Text>
          )}

          <Text style={styles.sectionTitle}>Sua Desvantagem Estratégica:</Text>
          {disadvantageousPokemon.length > 0 ? (
            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              {disadvantageousPokemon.map((poke) => (
                <UserPokemonAvatar
                  key={poke.id}
                  pokemon={poke}
                  isAdvantage={false}
                />
              ))}
            </View>
          ) : (
            <Text style={styles.noAdvantageText}>
              Nenhum Pokémon do seu time possui desvantagem de tipo clara.
            </Text>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}
