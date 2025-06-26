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
import { View, Text, Image, StyleSheet } from "react-native";

type CardPokemonProps = {
  number: number;
  name: string;
  types: string[];
  imageUrl: string;
};

const typeColors: { [key: string]: string } = {
  fire: "#F08030",
  water: "#6890F0",
  grass: "#78C850",
  electric: "#F8D030",
  psychic: "#F85888",
  ice: "#98D8D8",
  dragon: "#7038F8",
  dark: "#705848",
  fairy: "#EE99AC",
  normal: "#A8A878",
  fighting: "#C03028",
  flying: "#A890F0",
  poison: "#A040A0",
  ground: "#E0C068",
  rock: "#B8A038",
  bug: "#A8B820",
  ghost: "#705898",
  steel: "#B8B8D0",
};

export default function CardPokemon({
  number,
  name,
  types,
  imageUrl,
}: CardPokemonProps) {
  return (
    <View style={styles.card}>
      <Image style={styles.image} source={{ uri: imageUrl }} />
      <View style={styles.infoContainer}>
        <Text style={styles.number}>#{number}</Text>
        <View style={styles.details}>
          <Text style={styles.name}>{name}</Text>
          <View style={styles.typesContainer}>
            {types.map((type) => (
              <View
                key={type}
                style={[
                  styles.typeBox,
                  { backgroundColor: typeColors[type] || "#000" },
                ]}
              >
                <Text style={styles.typeText}>{type}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#f2f2f2",
    borderRadius: 8,
    padding: 10,
    marginVertical: 8,
    alignItems: "center",
  },
  image: {
    width: 120,
    height: 120,
    marginBottom: 10,
  },
  infoContainer: {
    width: "100%",
    alignItems: "center",
  },
  number: {
    fontWeight: "bold",
    fontSize: 16,
  },
  details: {
    alignItems: "center",
  },
  name: {
    fontSize: 18,
    marginBottom: 5,
  },
  typesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  typeBox: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    margin: 2,
  },
  typeText: {
    color: "#fff",
    fontWeight: "bold",
    textTransform: "capitalize",
  },
});
