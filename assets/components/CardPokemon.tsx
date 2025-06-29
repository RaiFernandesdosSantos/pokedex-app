/**
 * CardPokemon.tsx
 *
 * Componente visual para exibir um Pokémon em formato de card.
 *
 * - Exibe imagem, nome, número e tipos do Pokémon.
 * - Usado em listas, grids e telas de detalhes.
 * - Permite customização de clique ou ações extras via props.
 *
 * Props esperadas: number, name, types, imageUrl.
 */

import React from "react";
import { View, Text, Image } from "react-native";
import TypeBadge from "./TypeBadge";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { theme } from "../style/theme";
import PokeballBg from "@/assets/icons/PokeballBg";

type CardPokemonProps = {
  number: number;
  name: string;
  types: string[];
  imageUrl: string;
};

export default function CardPokemon({
  number,
  name,
  types,
  imageUrl,
}: CardPokemonProps) {
  const { styles } = useStyles(stylesheet);
  // Cor dinâmica do topo do card
  const primaryType = types[0];
  const typeColor =
    (theme.colors as Record<string, string>)[
      `pokemonType${primaryType.charAt(0).toUpperCase() + primaryType.slice(1)}`
    ] || theme.colors.grayscaleBackground;

  return (
    <View style={styles.root}>
      {/* Topo colorido e imagem sobreposta */}
      <View
        style={[
          styles.top,
          { backgroundColor: typeColor, position: "relative" },
        ]}
      >
        {/* SVG Pokeball de fundo */}
        <PokeballBg
          width={80}
          height={80}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: [{ translateX: -40 }, { translateY: -40 }],
            opacity: 0.18,
            zIndex: 1,
          }}
        />
        <Image
          style={[styles.image, { zIndex: 2 }]}
          source={{ uri: imageUrl }}
        />
      </View>
      {/* Card branco sobreposto */}
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.number}>#{String(number).padStart(3, "0")}</Text>
        </View>
        <View style={styles.typesContainer}>
          {types.map((type) => (
            <TypeBadge key={type} typeName={type} />
          ))}
        </View>
      </View>
    </View>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  root: {
    width: 160,
    margin: 8,
  },
  top: {
    height: 80,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  image: {
    width: 96,
    height: 96,
    marginTop: 8,
    marginBottom: -32, // Sobrepõe a imagem ao card
    zIndex: 3,
  },
  card: {
    backgroundColor: theme.colors.grayscaleWhite,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 40,
    paddingBottom: 16,
    paddingHorizontal: 12,
    alignItems: "center",
    marginTop: -32, // Sobrepõe o card ao topo colorido
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    zIndex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.grayscaleDark,
    flex: 1,
    textTransform: "capitalize",
  },
  number: {
    fontWeight: "bold",
    fontSize: 14,
    color: theme.colors.grayscaleMedium,
    marginLeft: 8,
  },
  typesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 4,
  },
}));
