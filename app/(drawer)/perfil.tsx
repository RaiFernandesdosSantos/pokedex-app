import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Modal,
  TextInput,
  Button,
} from "react-native";
import { useAuth } from "@/context/AuthContext";
import { usePokemonTeam, TeamPokemon } from "@/context/PokemonTeamContext";
import TeamMemberCard from "@/assets/components/TeamMemberCard";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@/assets/style/theme";

export default function PerfilScreen() {
  const { user, logout, updateProfileName } = useAuth();
  const { team, isLoadingTeam, removeFromTeam } = usePokemonTeam();
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState(user?.displayName || "");

  useEffect(() => {
    if (user && !user.displayName) {
      setModalVisible(true);
    }
  }, [user]);

  if (!user) {
    return null;
  }

  const handleSave = async () => {
    if (name.trim()) {
      await updateProfileName(name.trim());
      setModalVisible(false);
    } else {
      alert("Por favor, insira um nome válido.");
    }
  };

  return (
    <View style={styles.container}>
      <Modal visible={modalVisible} transparent animationType="slide">
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#0008",
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              padding: 24,
              borderRadius: 12,
              width: 300,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                marginBottom: 12,
              }}
            >
              Escolha seu nome de treinador
            </Text>
            <TextInput
              placeholder="Nome de treinador"
              value={name}
              onChangeText={setName}
              style={{
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 8,
                padding: 8,
                marginBottom: 16,
              }}
            />
            <Button title="Salvar" onPress={handleSave} />
          </View>
        </View>
      </Modal>
      <View style={styles.header}>
        <View style={styles.trainerNameRow}>
          <Text style={styles.displayName}>
            Treinador: {user.displayName || "Não definido"}
          </Text>
          <TouchableOpacity
            style={styles.editNameButton}
            onPress={() => setModalVisible(true)}
          >
            <Ionicons name="pencil" size={20} color={theme.colors.grayscaleDark} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutButtonText}>Sair</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.email}>Email: {user.email}</Text>
      <Text style={styles.sectionTitle}>Meu Time</Text>
      {isLoadingTeam ? (
        <ActivityIndicator size="large" color={theme.colors.identityPrimary} />
      ) : (
        <FlatList
          data={team}
          renderItem={({ item }) => (
            <View style={styles.cardWrapper}>
              <TeamMemberCard pokemon={item} />
            </View>
          )}
          keyExtractor={(item) => item.id.toString()}
          numColumns={1}
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
  displayName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#c2343a",
    textAlign: "left",
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
    width: "100%",
    paddingHorizontal: 8,
    marginBottom: 10,
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
  trainerNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  editNameButton: {
    marginLeft: 6,
    padding: 2,
  },
});
