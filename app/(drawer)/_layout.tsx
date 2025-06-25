import { Drawer } from "expo-router/drawer";

export default function DrawerLayout() {
  return (
    <Drawer
      screenOptions={{
        drawerActiveTintColor: "red",
        // O cabeçalho agora será gerenciado pelo Stack principal
        headerShown: true,
      }}
    >
      <Drawer.Screen name="index" options={{ title: "Início" }} />
      <Drawer.Screen name="MeuTime" options={{ title: "Meu Time Pokémon" }} />
      <Drawer.Screen
        name="Ginasios"
        options={{ title: "Líderes de Ginásio" }}
      />
    </Drawer>
  );
}
