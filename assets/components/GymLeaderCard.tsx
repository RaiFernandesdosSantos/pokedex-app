// GymLeaderCard.tsx
// Card de líder de ginásio interativo.
// - Recebe dados do líder e detalhes completos do time do líder.
// - Mostra imagem, nome, cidade, tipo e time do líder (com sprites e tipos).
// - Analisa vantagem de tipo do time do usuário contra o ginásio usando typeService.
// - Destaca visualmente os Pokémons do usuário com vantagem de tipo.

import React, { useEffect, useState } from "react";
import { View, Text, Image, FlatList } from "react-native";
import { usePokemonTeam, TeamPokemon } from "@/context/PokemonTeamContext";
import TypeBadge from "@/assets/components/TypeBadge";
import { styles } from "@/assets/style/GymStyle";
import { PokemonDetailsData } from "@/services/pokemonService";
import { getPokemonTypeWeaknesses } from "@/services/typeService";

interface GymLeaderCardProps {
  leader: {
    name: string;
    city: string;
    type: string;
    imageUrl: string;
  };
  teamDetails: PokemonDetailsData[];
}

export default function GymLeaderCard({
  leader,
  teamDetails,
}: GymLeaderCardProps) {
  const { team } = usePokemonTeam();
  const [advantages, setAdvantages] = useState<boolean[]>([]);

  useEffect(() => {
    async function checkAdvantages() {
      // Para cada Pokémon do usuário, verifica se tem vantagem contra o tipo do ginásio
      const adv = await Promise.all(
        team.map(async (userPoke: TeamPokemon) => {
          const weaknesses = await getPokemonTypeWeaknesses([leader.type]);
          // Se algum dos tipos do usuário for super efetivo contra o tipo do ginásio
          return userPoke.types.some((t) => weaknesses.includes(t));
        })
      );
      setAdvantages(adv);
    }
    if (team && leader) checkAdvantages();
  }, [team, leader]);

  return (
    <View style={styles.leaderCard}>
      <Image source={{ uri: leader.imageUrl }} style={styles.gymImage} />
      <Text style={styles.leaderName}>
        {leader.name} - {leader.city}
      </Text>
      <View style={styles.typeContainer}>
        <TypeBadge typeName={leader.type} />
      </View>
      <Text style={styles.sectionTitle}>Pokémons do Líder:</Text>
      <FlatList
        horizontal
        data={teamDetails}
        keyExtractor={(poke) => poke.id.toString()}
        renderItem={({ item }) => (
          <View style={{ alignItems: "center", marginRight: 12 }}>
            <Image
              source={{ uri: item.imageUrl }}
              style={{ width: 48, height: 48 }}
              resizeMode="contain"
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
      <Text style={styles.sectionTitle}>Seu time com vantagem:</Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        {team.map((poke, idx) =>
          advantages[idx] ? (
            <View
              key={poke.id}
              style={{ alignItems: "center", marginRight: 10 }}
            >
              <Image
                source={{ uri: poke.imageUrl }}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  borderWidth: 2,
                  borderColor: "#4caf50",
                }}
              />
              <Text style={{ fontSize: 10, color: "#4caf50" }}>Vantagem</Text>
            </View>
          ) : null
        )}
        {team.every((_, idx) => !advantages[idx]) && (
          <Text style={{ color: "#c2343a" }}>
            Nenhum Pokémon do seu time tem vantagem de tipo.
          </Text>
        )}
      </View>
    </View>
  );
}
