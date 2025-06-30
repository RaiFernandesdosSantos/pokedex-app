/**
 * StatBar.tsx
 *
 * Componente visual para exibir uma barra de estatística de Pokémon.
 *
 * Props:
 *   - statName: nome da estatística
 *   - value: valor da estatística
 *   - max: valor máximo (opcional, padrão 255)
 *
 * Usado na tela de detalhes para mostrar os stats base do Pokémon.
 */

import React from "react";
import { View, Text } from "react-native";
import { theme } from "../style/theme";
import styles from "../style/StatusStyle";

type StatBarProps = {
  statName: string;
  value: number;
  max?: number;
};

export default function StatBar({ statName, value, max = 255 }: StatBarProps) {
  const percent = Math.min(value / max, 1);
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{statName.toUpperCase()}</Text>
      <View style={styles.barBackground}>
        <View
          style={[
            styles.barFill,
            {
              width: `${percent * 100}%`,
              backgroundColor: theme.colors.identityPrimary,
            },
          ]}
        />
      </View>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}
