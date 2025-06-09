import { StyleSheet } from "react-native";

export const getTypeColor = (type: string) => {
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
  return typeColors[type] || "#000";
};

export const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 250,
    height: 250,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textTransform: "capitalize",
    marginBottom: 20,
  },
  section: {
    width: "100%",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  typesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  typeBox: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    marginRight: 10,
    marginBottom: 10,
  },
  typeText: {
    color: "#fff",
    fontWeight: "bold",
    textTransform: "capitalize",
  },
  textItem: {
    fontSize: 16,
    textTransform: "capitalize",
    marginBottom: 5,
  },
  statContainer: {
    marginBottom: 5,
  },
});
