/**
 * CardStyle.ts
 *
 * Estilos para o componente CardPokemon.
 *
 * Define aparência de cards, imagem, nome, tipos, etc.
 */

import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
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
