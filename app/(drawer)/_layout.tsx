// (drawer)/_layout.tsx
// Layout do Drawer: define rotas privadas do menu lateral.
// Não controla cabeçalho, cor ou botão do Drawer (isso é feito pelo Stack em _layout.tsx).
// Apenas lista as rotas privadas do app.
//
// Observações:
//   - O headerShown, headerStyle, headerTintColor etc. podem ser removidos daqui para evitar conflito.
//   - O DrawerToggleButton deve ser controlado pelo Stack.

// app/(drawer)/_layout.tsx
import { Drawer } from "expo-router/drawer";
import { DrawerToggleButton } from "@react-navigation/drawer";

export default function DrawerLayout() {
  return (
    <Drawer
      screenOptions={{
        drawerPosition: "right",
        headerShown: true,
        headerStyle: { backgroundColor: "#d60a2c" },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "bold" },
        headerRight: () => <DrawerToggleButton tintColor="#fff" />,
      }}
    >
      <Drawer.Screen
        name="index"
        options={{
          title: "Pokédex Kanto",
          drawerLabel: "Pokédex",
        }}
      />
      <Drawer.Screen
        name="perfil"
        options={{
          title: "Perfil do Treinador",
          drawerLabel: "Perfil e Time",
        }}
      />
      <Drawer.Screen
        name="Ginasios"
        options={{
          title: "Líderes de Ginásio",
          drawerLabel: "Líderes de Ginásio",
        }}
      />
      {/* Removemos a tela de Logout daqui, pois ela é uma ação no Perfil */}
    </Drawer>
  );
}
