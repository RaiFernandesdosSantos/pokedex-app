import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { getTypeColor } from "../style/DetalhesStyle";

type TypeBadgeProps = {
  typeName: string;
};

export default function TypeBadge({ typeName }: TypeBadgeProps) {
  return (
    <View style={[styles.badge, { backgroundColor: getTypeColor(typeName) }]}>
      <Text style={styles.text}>{typeName}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
    margin: 5,
    minWidth: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
  },
});
