//import "@/assets/style/unistyles";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PokemonTeamProvider } from "@/context/PokemonTeamContext";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { View, ActivityIndicator } from "react-native";
import AuthRedirect from "@/assets/components/AuthRedirect"; // Vamos criar este componente

// Este componente lida apenas com a lógica de redirecionamento
const InitialLayout = () => {
  const { isInitialized } = useAuth();

  if (!isInitialized) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#f4511e" />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#f4511e" },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "bold" },
      }}
    >
      <Stack.Screen
        name="(drawer)"
        options={{
          headerShown: false, // O Drawer terá seu próprio header customizado pelo Stack
        }}
      />
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
