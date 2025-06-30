// TypeBadge.tsx
// Badge colorido para tipo de Pokémon.
//
// Props:
//   - typeName: nome do tipo (ex: 'fire', 'water')
//
// Usado em cards, detalhes e filtros.

import React from "react";
import { View, Text } from "react-native";
import { theme } from "../style/theme";
import styles from "../style/BadgeStyle";

type TypeBadgeProps = {
  typeName: string;
};

export default function TypeBadge({ typeName }: TypeBadgeProps) {
  const key = `pokemonType${
    typeName.charAt(0).toUpperCase() + typeName.slice(1)
  }`;
  // Corrige o erro de tipagem usando as const assertions e type assertion para acessar a cor dinamicamente
  const typeColor =
    (theme.colors as Record<string, string>)[key] ||
    theme.colors.grayscaleMedium;
  return (
    <View style={[styles.badge, { backgroundColor: typeColor }]}>
      <Text style={styles.text}>{typeName}</Text>
    </View>
  );
}
