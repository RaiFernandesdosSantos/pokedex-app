import { StyleSheet } from "react-native";
import { theme } from "./theme";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },
  label: {
    width: 70,
    color: theme.colors.grayscaleDark,
    fontWeight: "bold",
    fontSize: 13,
  },
  barBackground: {
    flex: 1,
    height: 10,
    backgroundColor: theme.colors.grayscaleLight,
    borderRadius: 6,
    marginHorizontal: 8,
    overflow: "hidden",
  },
  barFill: {
    height: 10,
    borderRadius: 6,
  },
  value: {
    width: 32,
    textAlign: "right",
    color: theme.colors.grayscaleDark,
    fontWeight: "bold",
  },
});

export default styles;
