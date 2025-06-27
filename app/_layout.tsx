/**
 * _layout.tsx (raiz do app)
 *
 * Layout raiz responsável por envolver todo o app com providers e proteger rotas.
 *
 * Propósito:
 *   - Centraliza a lógica de autenticação e redirecionamento.
 *   - Garante que apenas usuários autenticados acessem rotas privadas.
 *   - Declara todas as rotas do app (Stack).
 *
 * Integração:
 *   - Não precisa ser importado manualmente, o expo-router usa automaticamente.
 *   - Providers (AuthProvider, PokemonTeamProvider) devem envolver o app aqui.
 *
 * Exemplo de uso:
 *   // Não é necessário importar, apenas adicione providers e lógica de roteamento.
 *
 * Pontos de atenção:
 *   - O redirecionamento depende do estado de isInitialized do AuthContext.
 *   - Rotas públicas: login, register. Rotas privadas: todo o resto.
 *   - Não declare rotas condicionalmente, sempre use o Stack completo.
 *
 * Sugestão:
 *   - Mantenha a lógica de autenticação centralizada aqui para evitar bugs de navegação.
 */
import "@/assets/style/unistyles"; // Ativa o tema
import { Stack, useRouter, useSegments } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PokemonTeamProvider } from "@/context/PokemonTeamContext";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { DrawerToggleButton } from "@react-navigation/drawer";

const InitialLayout = () => {
  const { user, isInitialized } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isInitialized) return;
    const inAuthGroup = segments[0] === "login" || segments[0] === "register";

    if (user && inAuthGroup) {
      router.replace("/(drawer)");
    } else if (!user && !inAuthGroup) {
      router.replace("/login");
    }
  }, [user, isInitialized, segments]);

  if (!isInitialized) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#f4511e" />
      </View>
    );
  }

  // A MÁGICA ACONTECE AQUI!
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#f4511e" },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "bold" },
        // Adiciona o botão do drawer à direita em TODAS as telas do Stack
        headerRight: () => <DrawerToggleButton tintColor="#fff" />,
      }}
    >
      {/* O Stack agora mostra seu próprio header para as telas do drawer */}
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
          <InitialLayout />
        </GestureHandlerRootView>
      </PokemonTeamProvider>
    </AuthProvider>
  );
}
