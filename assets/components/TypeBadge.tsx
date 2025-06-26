import React from "react";
import { View, Text } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { theme } from "../style/theme";

type TypeBadgeProps = {
  typeName: string;
};

export default function TypeBadge({ typeName }: TypeBadgeProps) {
  const { styles } = useStyles(stylesheet);
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

const stylesheet = createStyleSheet((theme) => ({
  badge: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
    margin: 5,
    minWidth: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: theme.colors.grayscaleWhite,
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
    textTransform: "capitalize",
  },
}));
