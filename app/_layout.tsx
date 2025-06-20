import Drawer from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PokemonTeamProvider } from "@/context/PokemonTeamCotext";

export default function RootLayout() {
  return (
    <PokemonTeamProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Drawer
          screenOptions={{
            drawerActiveTintColor: "red",
          }}
        >
          <Drawer.Screen name="Home" options={{ title: "Início" }} />
          <Drawer.Screen
            name="MeuTime"
            options={{ title: "Meu Time Pokémon" }}
          />
          <Drawer.Screen
            name="Ginasios"
            options={{ title: "Lideres de Ginasio" }}
          />
        </Drawer>
      </GestureHandlerRootView>
    </PokemonTeamProvider>
  );
}
