// CardPokemon.tsx
// Card visual de Pokémon para listas e grids.
// Exibe imagem, nome, número e tipos do Pokémon.
// Permite customização de clique ou ações extras via props.

import React from "react";
import { View, Text, Image } from "react-native";
import TypeBadge from "./TypeBadge";
import { theme } from "../style/theme";
import PokeballBg from "@/assets/icons/PokeballBg";
import styles from "../style/CardStyle";

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
