/**
 * _layout.tsx (Drawer)
 *
 * Layout do grupo de navegação Drawer.
 *
 * Propósito:
 *   - Define o menu lateral (Drawer) e suas opções.
 *   - Permite navegação entre as principais telas do app.
 *
 * Integração:
 *   - Não precisa ser importado manualmente, o expo-router usa automaticamente.
 *   - Personalize o conteúdo do Drawer via CustomDrawerContent.
 *
 * Exemplo de uso:
 *   // O Drawer já é exibido automaticamente nas rotas do grupo (drawer).
 *
 * Pontos de atenção:
 *   - O logout é feito via função do AuthContext.
 *   - As telas são gerenciadas pelo Drawer, não precisam ser listadas manualmente.
 *
 * Sugestão:
 *   - Adapte o Drawer para incluir/excluir opções conforme o usuário/logado.
 */

import { Drawer } from "expo-router/drawer";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { useAuth } from "@/context/AuthContext";

function CustomDrawerContent(props: any) {
  const { logout } = useAuth();
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItem
        label="Início"
        onPress={() => props.navigation.navigate("index")}
      />
      <DrawerItem
        label="Perfil e Time"
        onPress={() => props.navigation.navigate("perfil")}
      />
      <DrawerItem
        label="Líderes de Ginásio"
        onPress={() => props.navigation.navigate("Ginasios")}
      />
      <DrawerItem label="Sair" onPress={() => logout()} />
    </DrawerContentScrollView>
  );
}

export default function DrawerLayout() {
  return (
    <Drawer drawerContent={(props) => <CustomDrawerContent {...props} />}>
      {/* As telas agora são gerenciadas pelo CustomDrawerContent, não precisamos listá-las aqui */}
    </Drawer>
  );
}
