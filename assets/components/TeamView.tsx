import React from "react";
import { FlatList, View, Text, StyleSheet } from "react-native";
import TeamMemberCard from "./TeamMemberCard";
import { TeamPokemon } from "@/context/PokemonTeamContext";

interface TeamViewProps {
  team: TeamPokemon[];
  isEditable?: boolean; // Para saber se é o time do usuário (editável) ou de um líder (não editável)
}

export default function TeamView({ team, isEditable = false }: TeamViewProps) {
  if (!team || team.length === 0) {
    return <Text style={styles.emptyText}>O time está vazio.</Text>;
  }

  return (
    <FlatList
      data={team}
      renderItem={({ item }) => (
        <View style={styles.cardWrapper}>
          <TeamMemberCard pokemon={item} isEditable={isEditable} />
        </View>
      )}
      keyExtractor={(item) => item.id.toString()}
      numColumns={1}
      contentContainerStyle={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
  },
  cardWrapper: {
    width: "100%",
    marginBottom: 12,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
    color: "gray",
  },
});
