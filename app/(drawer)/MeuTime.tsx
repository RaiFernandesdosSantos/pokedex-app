import React from "react";
import { View, Text, FlatList, Image, Button, StyleSheet } from "react-native";
import { usePokemonTeam } from "../../context/PokemonTeamContext";

export default function MeuTime() {
  const { team, removeFromTeam } = usePokemonTeam();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meu Time Pokémon</Text>
      {team.length === 0 ? (
        <Text style={styles.emptyText}>
          Você ainda não adicionou nenhum Pokémon ao seu time.
        </Text>
      ) : (
        <FlatList
          data={team}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image source={{ uri: item.imageUrl }} style={styles.image} />
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.types}>{item.types.join(", ")}</Text>
              </View>
              <Button title="Remover" onPress={() => removeFromTeam(item.id)} />
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  emptyText: { fontSize: 16 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eee",
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
  },
  image: { width: 60, height: 60, marginRight: 10 },
  name: { fontSize: 18, fontWeight: "bold" },
  types: { fontSize: 14, color: "#555" },
});
