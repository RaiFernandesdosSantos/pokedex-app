import React from "react";
import { View, Text, Image } from "react-native";
import styles from "../style/EvolutionStyle";

/**
 * EvolutionStage.tsx
 * Mostra etapa da cadeia evolutiva do Pokémon.
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
