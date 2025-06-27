import { Drawer } from "expo-router/drawer";

export default function DrawerLayout() {
  return (
    <Drawer screenOptions={{ headerShown: false }}>
      {/* Definimos as telas e os títulos que o Stack pai irá usar */}
      <Drawer.Screen
        name="index"
        options={{
          title: "Pokédex Kanto",
          drawerLabel: "Início",
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
      {/* A tela de logout será removida daqui, pois o logout é uma ação, não uma tela.
          Vamos colocar o botão "Sair" diretamente no menu. */}
    </Drawer>
  );
}
