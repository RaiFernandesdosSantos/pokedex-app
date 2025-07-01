// _layout.tsx
// Layout raiz: providers, proteção de rotas, header global.

import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PokemonTeamProvider } from "@/context/PokemonTeamContext";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { View, ActivityIndicator } from "react-native";
import AuthRedirect from "@/assets/components/AuthRedirect"; // Vamos criar este componente
import { theme } from "@/assets/style/theme";

// Este componente lida apenas com a lógica de redirecionamento
const InitialLayout = () => {
  const { isInitialized } = useAuth();

  if (!isInitialized) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#d60a2c" />
      </View>
    );
  }

  // Stack simples, sem screenOptions complexos aqui
  return (
    <Stack>
      <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
      <Stack.Screen
        name="[pokemonId]"
        options={{ title: "Detalhes do Pokémon" }}
      />
      <Stack.Screen
        name="ginasio/[leaderId]"
        options={{ title: "Time do Líder" }}
      />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ headerShown: false }} />
    </Stack>
  );
};

export default function RootLayout() {
  return (
    <AuthProvider>
      <PokemonTeamProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <AuthRedirect>
            <Stack>
              <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
              <Stack.Screen
                name="[pokemonId]"
                options={{
                  title: "Detalhes do Pokémon",
                  headerStyle: {
                    backgroundColor: theme.colors.identityPrimary,
                  }, // vermelho
                  headerTintColor: "#fff",
                  headerTitleStyle: { fontWeight: "bold" },
                }}
              />
              <Stack.Screen
                name="ginasio/[leaderId]"
                options={{
                  title: "Time do Líder",
                  headerStyle: {
                    backgroundColor: theme.colors.identityPrimary,
                  }, // vermelho
                  headerTintColor: "#fff",
                  headerTitleStyle: { fontWeight: "bold" },
                }}
              />
              <Stack.Screen name="login" options={{ headerShown: false }} />
              <Stack.Screen name="register" options={{ headerShown: false }} />
            </Stack>
          </AuthRedirect>
        </GestureHandlerRootView>
      </PokemonTeamProvider>
    </AuthProvider>
  );
}
