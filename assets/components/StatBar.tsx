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
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { theme } from "../style/theme";

type StatBarProps = {
  statName: string;
  value: number;
  max?: number;
};

export default function StatBar({ statName, value, max = 255 }: StatBarProps) {
  const { styles } = useStyles(stylesheet);
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

const stylesheet = createStyleSheet((theme) => ({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },
  label: {
    width: 70,
    color: theme.colors.grayscaleDark,
    fontWeight: "bold",
    fontSize: 13,
  },
  barBackground: {
    flex: 1,
    height: 10,
    backgroundColor: theme.colors.grayscaleLight,
    borderRadius: 6,
    marginHorizontal: 8,
    overflow: "hidden",
  },
  barFill: {
    height: 10,
    borderRadius: 6,
  },
  value: {
    width: 32,
    textAlign: "right",
    color: theme.colors.grayscaleDark,
    fontWeight: "bold",
  },
}));
