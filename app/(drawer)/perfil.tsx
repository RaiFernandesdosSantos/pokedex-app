import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useAuth } from "@/context/AuthContext";
import { usePokemonTeam, TeamPokemon } from "@/context/PokemonTeamContext";
import CardPokemon from "@/assets/components/CardPokemon";

export default function PerfilScreen() {
  const { user, logout } = useAuth();
  const { team, isLoadingTeam, removeFromTeam } = usePokemonTeam();

  if (!user) {
    return null;
  }

  const renderTeamMember = ({ item }: { item: TeamPokemon }) => (
    <View style={styles.cardWrapper}>
      <CardPokemon
        number={item.id}
        name={item.name}
        types={item.types}
        imageUrl={item.imageUrl}
      />
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => removeFromTeam(item.id)}
      >
        <Text style={styles.removeButtonText}>Remover</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Perfil do Treinador</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutButtonText}>Sair</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.email}>Email: {user.email}</Text>
      <Text style={styles.sectionTitle}>Meu Time</Text>
      {isLoadingTeam ? (
        <ActivityIndicator size="large" color="#f4511e" />
      ) : (
        <FlatList
          data={team}
          renderItem={renderTeamMember}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.teamContainer}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              Seu time está vazio. Adicione Pokémon!
            </Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "rgb(228, 227, 231)",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "rgb(41, 39, 39)",
  },
  logoutButton: {
    backgroundColor: "rgb(206, 52, 58)",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  logoutButtonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  email: {
    fontSize: 16,
    color: "gray",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "rgb(41, 39, 39)",
    marginBottom: 10,
  },
  teamContainer: {
    alignItems: "center",
  },
  cardWrapper: {
    margin: 8,
    alignItems: "center",
  },
  removeButton: {
    marginTop: -15,
    backgroundColor: "#333",
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 15,
    zIndex: 1,
  },
  removeButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
  },
  emptyText: {
    marginTop: 50,
    fontSize: 16,
    color: "gray",
    textAlign: "center",
  },
});
