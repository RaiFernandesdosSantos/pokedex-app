import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { usePokemonTeam } from "@/context/PokemonTeamContext";
import { TeamPokemon } from "@/context/PokemonTeamContext";
import styles from "../style/TeamMemberCardStyle";
import { theme } from "../style/theme";
import TypeBadge from "./TypeBadge";
import { fetchPokemonDetails } from "@/services/pokemonService";

type TeamMemberCardProps = {
  pokemon: TeamPokemon;
  isEditable?: boolean;
};

// Função para calcular stats baseado no nível
function calculateStat(base: number, level: number, statName: string): number {
  if (statName.toLowerCase() === "hp") {
    return Math.floor((2 * base * level) / 100) + level + 10;
  }
  return Math.floor((2 * base * level) / 100) + 5;
}

const TeamMemberCard: React.FC<TeamMemberCardProps> = ({
  pokemon,
  isEditable = true,
}) => {
  const { updateTeamMember } = usePokemonTeam();
  const [levelModalVisible, setLevelModalVisible] = useState(false);
  const [movesModalVisible, setMovesModalVisible] = useState(false);
  const [newLevel, setNewLevel] = useState(pokemon.level.toString());
  const [selectedMoves, setSelectedMoves] = useState<string[]>(pokemon.moves);
  const [availableMoves, setAvailableMoves] = useState<
    { name: string; level: number }[]
  >([]);
  const [isLoadingMoves, setIsLoadingMoves] = useState(false);

  // Cor de fundo baseada no tipo primário
  const primaryType =
    pokemon.types && pokemon.types.length > 0 ? pokemon.types[0] : "Normal";
  const colorKey = `pokemonType${primaryType
    .charAt(0)
    .toUpperCase()}${primaryType.slice(1)}`;
  const backgroundColor =
    (theme.colors as Record<string, string>)[colorKey] ||
    theme.colors.grayscaleLight;

  // Stats calculados com useMemo
  const calculatedStats = useMemo(() => {
    if (!pokemon.stats) return {};
    const stats: { [key: string]: number } = {};
    pokemon.stats.forEach((stat) => {
      stats[stat.name] = calculateStat(
        stat.base_stat,
        pokemon.level,
        stat.name
      );
    });
    return stats;
  }, [pokemon.level, pokemon.stats]);

  const handleLevelSave = () => {
    const levelNum = parseInt(newLevel, 10);
    if (!isNaN(levelNum)) {
      updateTeamMember(pokemon.id, { level: levelNum });
      setLevelModalVisible(false);
    }
  };

  // Lógica para buscar golpes aprendíveis
  const loadMoves = async () => {
    if (!isEditable) return;
    setIsLoadingMoves(true);
    setMovesModalVisible(true);
    try {
      const details = await fetchPokemonDetails(pokemon.id);
      setAvailableMoves(details.learnableMoves);
    } catch (error) {
      console.error("Erro ao carregar lista de golpes:", error);
      alert("Não foi possível carregar os golpes.");
    } finally {
      setIsLoadingMoves(false);
    }
  };

  const toggleMove = (move: string) => {
    setSelectedMoves((prev) =>
      prev.includes(move)
        ? prev.filter((m) => m !== move)
        : prev.length < 4
        ? [...prev, move]
        : prev
    );
  };

  const saveMoves = () => {
    updateTeamMember(pokemon.id, { moves: selectedMoves });
    setMovesModalVisible(false);
  };

  return (
    <View style={[styles.cardContainer, { backgroundColor }]}>
      {" "}
      {/* <-- cor dinâmica */}
      {/* Coluna Esquerda: Informações Principais */}
      <View style={styles.leftColumn}>
        <Image source={{ uri: pokemon.imageUrl }} style={styles.image} />
        <Text style={styles.name}>{pokemon.name}</Text>
        {isEditable && (
          <TouchableOpacity onPress={() => setLevelModalVisible(true)}>
            <Text style={styles.level}>Nível: {pokemon.level}</Text>
          </TouchableOpacity>
        )}
        {!isEditable && (
          <Text style={styles.level}>Nível: {pokemon.level}</Text>
        )}
        <View style={styles.typesContainer}>
          {pokemon.types.map((type) => (
            <TypeBadge key={type} typeName={type} />
          ))}
        </View>
      </View>
      {/* Coluna Direita: Habilidade, Item, Golpes, Stats Calculados */}
      <View style={styles.rightColumn}>
        <View style={styles.detailRow}>
          <Text style={styles.detailTitle}>Habilidade</Text>
          <Text style={styles.detailValue}>{pokemon.ability}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.detailRow}>
          <Text style={styles.detailTitle}>Item</Text>
          <Text style={styles.detailValue}>{pokemon.heldItem || "Nenhum"}</Text>
        </View>
        <View style={styles.divider} />
        {/* Seção de Golpes como botão */}
        <TouchableOpacity onPress={loadMoves} disabled={!isEditable}>
          <View style={styles.movesContainer}>
            <Text style={styles.detailTitle}>Golpes</Text>
            {pokemon.moves.length > 0 ? (
              pokemon.moves.map((move, index) => (
                <View key={index} style={styles.moveSlot}>
                  <Text style={styles.moveText}>{move}</Text>
                </View>
              ))
            ) : (
              <View style={styles.moveSlot}>
                <Text
                  style={[
                    styles.moveText,
                    { fontStyle: "italic", opacity: 0.7 },
                  ]}
                >
                  Adicionar golpe...
                </Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
        {/* Stats Calculados */}
        <View style={{ marginTop: 10 }}>
          <Text style={styles.detailTitle}>Stats (Nível {pokemon.level})</Text>
          {Object.entries(calculatedStats).map(([name, value]) => (
            <Text key={name} style={styles.detailValue}>
              {name.replace("-", " ")}: {value}
            </Text>
          ))}
        </View>
      </View>
      {/* Modal de Nível */}
      <Modal visible={levelModalVisible} animationType="slide" transparent>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
            position: "absolute",
            width: "100%",
            height: "100%",
          }}
        >
          <View
            style={{
              backgroundColor: "#222",
              padding: 24,
              borderRadius: 16,
              width: 300,
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontSize: 18,
                fontWeight: "bold",
                marginBottom: 12,
              }}
            >
              Editar Nível
            </Text>
            <TextInput
              value={newLevel}
              onChangeText={setNewLevel}
              keyboardType="numeric"
              style={{
                borderWidth: 1,
                borderColor: "#555",
                color: "#fff",
                padding: 8,
                borderRadius: 8,
                marginBottom: 16,
              }}
            />
            <TouchableOpacity
              onPress={handleLevelSave}
              style={{ marginBottom: 8 }}
            >
              <Text
                style={{
                  color: theme.colors.identityPrimary,
                  fontWeight: "bold",
                  fontSize: 16,
                }}
              >
                Salvar
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setLevelModalVisible(false)}>
              <Text style={{ color: "#fff", fontSize: 16 }}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* Modal de Golpes */}
      <Modal visible={movesModalVisible} animationType="slide" transparent>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
            position: "absolute",
            width: "100%",
            height: "100%",
          }}
        >
          <View
            style={{
              backgroundColor: "#222",
              padding: 24,
              borderRadius: 16,
              width: 320,
              maxHeight: 400,
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontSize: 18,
                fontWeight: "bold",
                marginBottom: 12,
              }}
            >
              Selecionar Golpes (Máx. 4)
            </Text>
            {isLoadingMoves ? (
              <ActivityIndicator color={theme.colors.identityPrimary} />
            ) : (
              <FlatList
                data={availableMoves}
                keyExtractor={(item) => item.name}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => toggleMove(item.name)}>
                    <Text
                      style={[
                        styles.moveText,
                        selectedMoves.includes(item.name) && {
                          color: theme.colors.identityPrimary,
                          fontWeight: "bold",
                        },
                        { fontSize: 16, marginBottom: 6 },
                      ]}
                    >
                      {item.name}{" "}
                      <Text style={{ color: "#aaa", fontSize: 12 }}>
                        Lv. {item.level}
                      </Text>
                    </Text>
                  </TouchableOpacity>
                )}
              />
            )}
            <TouchableOpacity onPress={saveMoves} style={{ marginTop: 12 }}>
              <Text
                style={[
                  styles.moveText,
                  {
                    color: theme.colors.identityPrimary,
                    fontWeight: "bold",
                    fontSize: 16,
                  },
                ]}
              >
                Salvar
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setMovesModalVisible(false)}>
              <Text style={[styles.moveText, { color: "#fff", fontSize: 16 }]}>
                Cancelar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default TeamMemberCard;
