import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

/**
 * EvolutionStage.tsx
 *
 * Componente visual para exibir uma etapa da cadeia de evolução de um Pokémon.
 *
 * Props:
 *   - id: número do Pokémon
 *   - name: nome do Pokémon
 *   - imageUrl: imagem oficial do Pokémon
 *
 * Usado na tela de detalhes para mostrar a linha evolutiva.
 */

type EvolutionStageProps = {
  id: number;
  name: string;
  imageUrl: string;
};

export default function EvolutionStage({
  id,
  name,
  imageUrl,
}: EvolutionStageProps) {
  return (
    <View style={styles.container}>
      <Image style={styles.image} source={{ uri: imageUrl }} />
      <Text style={styles.name}>{name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    margin: 5,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  image: {
    width: 80,
    height: 80,
    resizeMode: "contain",
  },
  name: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
});
