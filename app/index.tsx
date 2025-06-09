// App.tsx
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./inicial";
import PokemonDetails from "./detalhes";

export type RootStackParamList = {
  Home: undefined;
  PokemonDetails: { pokemonId: number };
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: "Pokédex" }}
      />
      <Stack.Screen
        name="PokemonDetails"
        component={PokemonDetails}
        options={{ title: "Detalhes do Pokémon" }}
      />
    </Stack.Navigator>
  );
}
