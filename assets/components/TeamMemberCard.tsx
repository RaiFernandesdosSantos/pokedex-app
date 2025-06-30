import React, { useState, useContext } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  FlatList,
} from "react-native";
import { usePokemonTeam } from "../../context/PokemonTeamContext";
import { TeamPokemon } from "../../context/PokemonTeamContext";
// import { getPokemonMoves } from "../../services/pokemonService"; // To be implemented

type TeamMemberCardProps = {
  pokemon: TeamPokemon;
};

const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ pokemon }) => {
  const { updateTeamMember } = usePokemonTeam();
  const [levelModalVisible, setLevelModalVisible] = useState(false);
  const [movesModalVisible, setMovesModalVisible] = useState(false);
  const [newLevel, setNewLevel] = useState(pokemon.level.toString());
  const [availableMoves, setAvailableMoves] = useState<string[]>([]);
  const [selectedMoves, setSelectedMoves] = useState<string[]>(pokemon.moves);

  const handleLevelSave = () => {
    const levelNum = parseInt(newLevel, 10);
    if (!isNaN(levelNum)) {
      updateTeamMember(pokemon.id, { ...pokemon, level: levelNum });
      setLevelModalVisible(false);
    }
  };

  const loadMoves = async () => {
    // Placeholder for loading moves, to be implemented
    setAvailableMoves([]); // Temporary empty list
    setMovesModalVisible(true);
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
    updateTeamMember(pokemon.id, { ...pokemon, moves: selectedMoves });
    setMovesModalVisible(false);
  };

  return (
    <View style={{ flexDirection: "row", padding: 10, borderBottomWidth: 1 }}>
      {/* Left Section */}
      <View style={{ flex: 1 }}>
        <Image
          source={{ uri: pokemon.imageUrl }}
          style={{ width: 80, height: 80 }}
        />
        <Text>{pokemon.name}</Text>
        <TouchableOpacity onPress={() => setLevelModalVisible(true)}>
          <Text>Nível: {pokemon.level}</Text>
        </TouchableOpacity>
        <Text>Item: {pokemon.heldItem || "None"}</Text>
        <Text>Habilidade: {pokemon.ability}</Text>
      </View>

      {/* Right Section - Moves and Stats */}
      <View style={{ flex: 1 }}>
        {pokemon.moves.map((move, index) => (
          <TouchableOpacity key={index} onPress={loadMoves}>
            <Text>{move}</Text>
          </TouchableOpacity>
        ))}
        {pokemon.calculatedStats && (
          <View style={{ marginTop: 10 }}>
            <Text>Stats:</Text>
            {Object.entries(pokemon.calculatedStats).map(([stat, value]) => (
              <Text key={stat}>
                {stat}: {value}
              </Text>
            ))}
          </View>
        )}
      </View>

      {/* Level Modal */}
      <Modal visible={levelModalVisible} animationType="slide">
        <View style={{ padding: 20 }}>
          <Text>Editar Nível</Text>
          <TextInput
            value={newLevel}
            onChangeText={setNewLevel}
            keyboardType="numeric"
            style={{ borderWidth: 1, padding: 8 }}
          />
          <TouchableOpacity onPress={handleLevelSave}>
            <Text>Salvar</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setLevelModalVisible(false)}>
            <Text>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Moves Modal */}
      <Modal visible={movesModalVisible} animationType="slide">
        <View style={{ padding: 20 }}>
          <Text>Selecionar Golpes (Máx. 4)</Text>
          <FlatList
            data={availableMoves}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => toggleMove(item)}>
                <Text
                  style={{
                    fontWeight: selectedMoves.includes(item)
                      ? "bold"
                      : "normal",
                  }}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity onPress={saveMoves}>
            <Text>Salvar</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setMovesModalVisible(false)}>
            <Text>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default TeamMemberCard;
