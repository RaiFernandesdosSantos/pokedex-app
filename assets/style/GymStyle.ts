// GymStyle.ts
// Estilos da tela de líderes de ginásio.
// Define aparência de cards de líderes, lista de pokémons, fraquezas, etc.

import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  leaderCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  gymImage: {
    width: "100%",
    height: 180,
    borderRadius: 12,
    marginBottom: 12,
  },
  leaderName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#444",
    marginBottom: 4,
  },
  typeContainer: {
    flexDirection: "row",
    marginBottom: 12,
  },
  typeBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  typeText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 8,
    marginBottom: 4,
    color: "#555",
  },
  pokemonList: {
    paddingLeft: 8,
    marginBottom: 10,
  },
  pokemonName: {
    fontSize: 14,
    color: "#333",
    marginBottom: 2,
  },
  weakAlert: {
    marginTop: 10,
    color: "#d32f2f",
    fontWeight: "bold",
    fontSize: 14,
  },
  weaknessContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 12,
    marginBottom: 24,
  },

  weaknessItem: {
    backgroundColor: "#ffdddd",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
  },

  weaknessType: {
    fontWeight: "700",
    marginRight: 6,
    color: "#d9534f",
    textTransform: "uppercase",
  },

  weaknessCount: {
    fontWeight: "600",
    color: "#d9534f",
  },

  noWeaknessText: {
    fontStyle: "italic",
    color: "#666",
    fontSize: 14,
  },
});
