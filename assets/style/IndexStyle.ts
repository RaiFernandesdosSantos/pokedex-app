/**
 * IndexStyle.ts
 *
 * Estilos para a tela de listagem de pokémons (Home/index.tsx).
 *
 * Define grid, cards, loading, e input de busca.
 */

import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  gridContainer: {
    padding: 10,
  },
  cardContainer: {
    flex: 1,
    margin: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  searchInput: {
    margin: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#eee",
    borderRadius: 10,
    fontSize: 16,
  },
});
