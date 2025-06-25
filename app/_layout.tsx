import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PokemonTeamProvider } from "@/context/PokemonTeamContext";

export default function RootLayout() {
  return (
    // Os providers ficam aqui para envolver todo o app
    <PokemonTeamProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: "#f4511e", // Cor de exemplo para o header
            },
            headerTintColor: "#fff", // Cor do texto e botão de voltar
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        >
          {/* Esta tela aponta para o nosso grupo (drawer) e usa o título definido lá */}
          <Stack.Screen name="(drawer)" options={{ headerShown: false }} />

          {/* Esta é a tela de detalhes, que aparecerá sobre o Drawer */}
          <Stack.Screen
            name="[pokemonId]"
            options={{ title: "Detalhes do Pokémon" }}
          />
        </Stack>
      </GestureHandlerRootView>
    </PokemonTeamProvider>
  );
}
