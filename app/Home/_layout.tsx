import { Stack } from "expo-router";

export default function HomeLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="[pokemonId]"
        options={{ title: "Detalhes", headerBackTitle: "Voltar" }}
      />
    </Stack>
  );
}
