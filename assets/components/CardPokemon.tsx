/**
 * CardPokemon.tsx
 *
 * Componente visual para exibir um Pokémon em formato de card.
 *
 * Propósito:
 *   - Exibe imagem, nome, número e tipos do Pokémon.
 *   - Usado em listas, grids e telas de detalhes.
 *
 * Integração:
 *   - Importe e use <CardPokemon ... /> nas telas que listam ou detalham Pokémon.
 *
 * Exemplo de uso:
 *   <CardPokemon number={25} name="pikachu" types={["electric"]} imageUrl={...} />
 *
 * Pontos de atenção:
 *   - O componente espera props bem formatadas (id, nome, tipos, url da imagem).
 *   - Os estilos podem ser customizados conforme o tema do app.
 *
 * Sugestão:
 *   - Permita customização de clique ou ações extras via props.
 */

import React from "react";
import { View, Text, Image } from "react-native";
import TypeBadge from "./TypeBadge";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { theme } from "../style/theme";

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
      <View style={[styles.top, { backgroundColor: typeColor }]}>
        <Image style={styles.image} source={{ uri: imageUrl }} />
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
