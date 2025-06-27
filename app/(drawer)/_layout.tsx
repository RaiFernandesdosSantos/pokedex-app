import { Drawer } from "expo-router/drawer";
import { DrawerToggleButton } from "@react-navigation/drawer";
import { useAuth } from "@/context/AuthContext";

export default function DrawerLayout() {
  const { logout } = useAuth();

  return (
    <Drawer
      screenOptions={{
        drawerPosition: "right",
        // Pede ao Stack para mostrar um botão de menu à direita
        headerRight: () => <DrawerToggleButton tintColor="#fff" />,
      }}
    >
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
      {/* O logout agora é uma ação, não uma tela. Vamos colocá-lo no `perfil.tsx` */}
    </Drawer>
  );
}
