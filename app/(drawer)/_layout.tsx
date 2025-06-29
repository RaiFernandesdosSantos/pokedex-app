/**
 * (drawer)/_layout.tsx
 *
 * Responsável por:
 *   - Definir as telas do menu Drawer (Início, Perfil, Ginásios).
 *   - NÃO controla cabeçalho, cor ou botão do Drawer (isso é feito pelo Stack em _layout.tsx).
 *   - Apenas lista as rotas privadas do app.
 *
 * Observações:
 *   - O headerShown, headerStyle, headerTintColor etc. podem ser removidos daqui para evitar conflito.
 *   - O DrawerToggleButton deve ser controlado pelo Stack.
 */

import { Drawer } from "expo-router/drawer";

export default function DrawerLayout() {
  return (
    <Drawer
      screenOptions={{
        drawerPosition: "right",
      }}
    >
      <Drawer.Screen
        name="index"
        options={{
          title: "Pokédex Kanto",
          drawerLabel: "Pokédex Kanto",
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
    </Drawer>
  );
}
