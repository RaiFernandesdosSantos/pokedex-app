import { StyleSheet } from "react-native";
import { theme } from "./theme";

const styles = StyleSheet.create({
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
    marginBottom: -32,
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
    marginTop: -32,
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
});

export default styles;
