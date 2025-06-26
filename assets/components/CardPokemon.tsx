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
import TypeBadge from "./TypeBadge";

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
  return (
    <View style={styles.card}>
      <Image style={styles.image} source={{ uri: imageUrl }} />
      <View style={styles.infoContainer}>
        <Text style={styles.number}>#{number}</Text>
        <View style={styles.details}>
          <Text style={styles.name}>{name}</Text>
          <View style={styles.typesContainer}>
            {types.map((type) => (
              <TypeBadge key={type} typeName={type} />
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
});
