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
  Alert,
} from "react-native";
import { usePokemonTeam } from "@/context/PokemonTeamContext";
import { TeamPokemon } from "@/context/PokemonTeamContext";
import styles from "../style/TeamMemberCardStyle";
import { theme } from "../style/theme";
import TypeBadge from "./TypeBadge";
import { fetchPokemonDetails } from "@/services/pokemonService";
import { fetchAllItems, PokemonItem } from "@/services/itemService";
import { kantoHMs } from "@/services/moveService";

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
  const { updateTeamMember, removeFromTeam } = usePokemonTeam();
  const [levelModalVisible, setLevelModalVisible] = useState(false);
  const [movesModalVisible, setMovesModalVisible] = useState(false);
  const [itemModalVisible, setItemModalVisible] = useState(false);
  const [newLevel, setNewLevel] = useState(pokemon.level.toString());
  const [selectedMoves, setSelectedMoves] = useState<string[]>(pokemon.moves);
  const [availableMoves, setAvailableMoves] = useState<
    { name: string; level: number }[]
  >([]);
  const [isLoadingMoves, setIsLoadingMoves] = useState(false);
  const [itemSearch, setItemSearch] = useState("");
  const [items, setItems] = useState<PokemonItem[]>([]);
  const [isLoadingItems, setIsLoadingItems] = useState(false);

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

  // Lógica para buscar golpes aprendíveis (incluindo HMs)
  const loadMoves = async () => {
    if (!isEditable) return;
    setIsLoadingMoves(true);
    setMovesModalVisible(true);
    try {
      // Golpes aprendíveis por level-up
      const details = await fetchPokemonDetails(pokemon.id);
      // Busca completa dos golpes para checar HMs
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${pokemon.id}`
      );
      const fullData = await response.json();
      // HMs compatíveis
      const learnableHMs = kantoHMs
        .filter((hm) =>
          fullData.moves.some(
            (apiMove: any) =>
              apiMove.move.name === hm.moveName &&
              apiMove.version_group_details.some(
                (d: any) => d.move_learn_method.name === "machine"
              )
          )
        )
        .map((hm) => ({ name: hm.moveName, level: 0 }));
      // Junta golpes de level-up e HMs, remove duplicatas e ordena
      const finalMoveList = [...details.learnableMoves, ...learnableHMs];
      const uniqueMoves = Array.from(
        new Map(finalMoveList.map((item) => [item.name, item])).values()
      ).sort((a, b) => a.level - b.level);
      setAvailableMoves(uniqueMoves);
    } catch (error) {
      console.error("Erro ao carregar lista de golpes completa:", error);
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
    // Validação: algum golpe selecionado requer nível maior que o atual?
    const invalidMoves = selectedMoves
      .map((moveName) => availableMoves.find((m) => m.name === moveName))
      .filter((move) => move && move.level > pokemon.level);
    if (invalidMoves.length > 0) {
      const moveNames = invalidMoves
        .filter((m): m is { name: string; level: number } => !!m)
        .map((m) => `${m.name} (Lv. ${m.level})`)
        .join(", ");
      Alert.alert(
        "Golpe acima do nível",
        `Os golpes selecionados requerem nível maior que o atual: ${moveNames}. Deseja salvar mesmo assim?`,
        [
          {
            text: "Cancelar",
            style: "cancel",
          },
          {
            text: "Salvar mesmo assim",
            style: "destructive",
            onPress: () => {
              updateTeamMember(pokemon.id, { moves: selectedMoves });
              setMovesModalVisible(false);
            },
          },
        ]
      );
      return;
    }
    updateTeamMember(pokemon.id, { moves: selectedMoves });
    setMovesModalVisible(false);
  };

  // Carregar itens ao abrir modal
  const loadItems = async () => {
    setIsLoadingItems(true);
    setItemModalVisible(true);
    try {
      const allItems = await fetchAllItems();
      setItems(allItems);
    } catch (e) {
      alert("Erro ao buscar itens.");
    } finally {
      setIsLoadingItems(false);
    }
  };

  const handleSelectItem = (itemName: string) => {
    updateTeamMember(pokemon.id, { heldItem: itemName });
    setItemModalVisible(false);
  };

  return (
    <View style={[styles.cardContainer, { backgroundColor }]}>
      {/* COLUNA 1: IMAGEM E INFO BÁSICA */}
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
        <View style={styles.typesContainer_vertical}>
          {pokemon.types.map((type) => (
            <TypeBadge key={type} typeName={type} />
          ))}
        </View>
      </View>
      {/* DIVISÓRIA SUTIL */}
      <View style={styles.divider} />
      {/* COLUNA 2: DETALHES ESTRATÉGICOS */}
      <View style={styles.rightColumn}>
        <View style={styles.detailRow}>
          <Text style={styles.detailTitle}>Habilidade</Text>
          <Text style={styles.detailValue}>{pokemon.ability}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.detailRow}>
          <Text style={styles.detailTitle}>Item</Text>
          <TouchableOpacity onPress={isEditable ? loadItems : undefined}>
            <Text style={styles.detailValue}>
              {pokemon.heldItem || "Nenhum"}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.divider} />
        <TouchableOpacity onPress={loadMoves} disabled={!isEditable}>
          <View style={styles.movesContainer}>
            <Text style={styles.detailTitle}>Golpes</Text>
            {pokemon.moves.length > 0 ? (
              pokemon.moves
                .filter((move) => typeof move === "string" && move)
                .map((move, index) => (
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
        <View style={{ marginTop: 10 }}>
          <Text style={styles.detailTitle}>Stats (Nível {pokemon.level})</Text>
          {Object.entries(calculatedStats).map(([name, value]) => (
            <Text key={name} style={styles.detailValue}>
              {name.replace("-", " ")}: {value}
            </Text>
          ))}
        </View>
        {isEditable && (
          <TouchableOpacity
            onPress={() => removeFromTeam(pokemon.id)}
            style={{
              marginTop: 16,
              backgroundColor: theme.colors.identityPrimary,
              borderRadius: 8,
              paddingVertical: 8,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
              Remover
            </Text>
          </TouchableOpacity>
        )}
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
      {/* Modal de Itens */}
      <Modal visible={itemModalVisible} animationType="slide" transparent>
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
              Selecionar Item
            </Text>
            <TextInput
              placeholder="Buscar item..."
              value={itemSearch}
              onChangeText={setItemSearch}
              style={{
                borderWidth: 1,
                borderColor: "#555",
                color: "#fff",
                padding: 8,
                borderRadius: 8,
                marginBottom: 12,
              }}
            />
            {isLoadingItems ? (
              <ActivityIndicator color={theme.colors.identityPrimary} />
            ) : (
              <FlatList
                data={items.filter((item) =>
                  item.name.toLowerCase().includes(itemSearch.toLowerCase())
                )}
                keyExtractor={(item) => item.name}
                style={{ maxHeight: 220 }}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => handleSelectItem(item.name)}>
                    <Text
                      style={{
                        color: "#fff",
                        fontSize: 16,
                        paddingVertical: 6,
                        borderBottomWidth: 1,
                        borderBottomColor: "#333",
                      }}
                    >
                      {item.name.replace(/-/g, " ")}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            )}
            <TouchableOpacity onPress={() => setItemModalVisible(false)}>
              <Text style={{ color: "#fff", fontSize: 16, marginTop: 10 }}>
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
