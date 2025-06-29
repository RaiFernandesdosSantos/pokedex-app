import React from "react";
import { View, Text, Image } from "react-native";
import styles from "../style/EvolutionStyle";

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
