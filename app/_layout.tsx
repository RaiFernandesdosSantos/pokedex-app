import "@/assets/style/unistyles";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PokemonTeamProvider } from "@/context/PokemonTeamContext";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { View, ActivityIndicator } from "react-native";
import AuthRedirect from "@/assets/components/AuthRedirect";

/**
 * _layout.tsx (Root Layout)
 *
 * Responsável por:
 *   - Inicializar provedores globais (Auth, Team, Unistyles, GestureHandler).
 *   - Proteger rotas: redireciona usuários autenticados/deslogados para as telas corretas.
 *   - Definir a navegação principal do app (Stack), incluindo o grupo (drawer) e telas públicas.
 *   - Exibir um indicador de loading enquanto o estado de autenticação é resolvido.
 *
 * Observações:
 *   - O Stack controla o cabeçalho global, exceto para o grupo (drawer), onde o header é ocultado.
 *   - O AuthRedirect garante que apenas usuários autenticados acessem rotas privadas.
 */

const InitialLayout = () => {
  const { isInitialized } = useAuth();

  if (!isInitialized) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#f4511e" />
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
            <InitialLayout />
          </AuthRedirect>
        </GestureHandlerRootView>
      </PokemonTeamProvider>
    </AuthProvider>
  );
}
