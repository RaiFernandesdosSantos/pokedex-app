import React, { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  View,
  Text,
  Image,
  ScrollView,
  Button,
  StyleSheet,
  FlatList,
} from "react-native";
import EvolutionStage from "@/assets/components/EvolutionStage";
import TypeBadge from "@/assets/components/TypeBadge";
import StatBar from "@/assets/components/StatBar";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { usePokemonTeam } from "../context/PokemonTeamContext";
import {
  fetchPokemonDetails,
  PokemonDetailsData,
} from "@/services/pokemonService";
import { getTypeColor, styles } from "@/assets/style/DetalhesStyle";
import { theme } from "@/assets/style/theme";
import PokeballBg from "@/assets/icons/PokeballBg";

export default function PokemonDetails() {
  const { pokemonId } = useLocalSearchParams<{ pokemonId: string }>();
  const [pokemon, setPokemon] = useState<PokemonDetailsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [debugMessage, setDebugMessage] = useState<string>("Initializing...");
  const { addToTeam } = usePokemonTeam();
  const navigation = useNavigation();
  const [showLocations, setShowLocations] = useState(false);

  useEffect(() => {
    async function loadPokemonDetails() {
      if (!pokemonId) {
        console.error("No pokemonId provided");
        setLoading(false);
        setDebugMessage("Error: No Pokémon ID provided.");
        return;
      }
      setDebugMessage("Loading Pokémon data for ID: " + pokemonId);
      try {
        console.log("Fetching data for Pokémon ID:", pokemonId);
        const data = await fetchPokemonDetails(Number(pokemonId));
        console.log("Data fetched successfully:", data);
        setPokemon(data);
        setDebugMessage(
          "Data loaded successfully for Pokémon ID: " + pokemonId
        );
      } catch (error) {
        console.error("Erro ao carregar os detalhes:", error);
        if (error instanceof Error) {
          console.error("Error message:", error.message);
          console.error("Error stack:", error.stack);
          setDebugMessage("Error loading data: " + error.message);
        } else {
          setDebugMessage("Unknown error loading data.");
        }
      } finally {
        setLoading(false);
      }
    }
    loadPokemonDetails();
  }, [pokemonId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Carregando...</Text>
        <Text style={localStyles.debugText}>{debugMessage}</Text>
      </View>
    );
  }

  if (!pokemon) {
    return (
      <View style={styles.errorContainer}>
        <Text>
          Erro ao carregar os dados do Pokémon. Por favor, tente novamente.
        </Text>
        <Text style={localStyles.debugText}>{debugMessage}</Text>
      </View>
    );
  }

  // Cor dinâmica do topo
  const primaryType = pokemon.types[0];
  const typeColor =
    (theme.colors as Record<string, string>)[
      `pokemonType${primaryType.charAt(0).toUpperCase() + primaryType.slice(1)}`
    ] || theme.colors.grayscaleBackground;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.colors.grayscaleBackground }}
    >
      {/* Topo colorido dinâmico */}
      <View
        style={{
          height: 220,
          backgroundColor: typeColor,
          borderBottomLeftRadius: 32,
          borderBottomRightRadius: 32,
          paddingHorizontal: 20,
          paddingTop: 40,
          alignItems: "center",
          justifyContent: "flex-end",
          position: "relative",
        }}
      >
        {/* SVG Pokeball de fundo */}
        <View
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 30,
            alignItems: "center",
            zIndex: 1,
          }}
        >
          <PokeballBg width={120} height={120} />
        </View>
        {/* Nome e número */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            width: "100%",
            justifyContent: "space-between",
            zIndex: 2,
          }}
        >
          <Text
            style={{
              color: theme.colors.grayscaleWhite,
              fontSize: 28,
              fontWeight: "bold",
              textTransform: "capitalize",
            }}
          >
            {pokemon.name}
          </Text>
          <Text
            style={{
              color: theme.colors.grayscaleWhite,
              fontSize: 16,
              fontWeight: "bold",
            }}
          >
            #{String(pokemon.id).padStart(3, "0")}
          </Text>
        </View>
        {/* Imagem sobreposta */}
        <View
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: -70,
            alignItems: "center",
            zIndex: 3,
          }}
        >
          <Image
            style={{
              width: 140,
              height: 140,
            }}
            source={{ uri: pokemon.imageUrl }}
          />
        </View>
      </View>

      {/* Card branco sobreposto */}
      <View
        style={{
          marginTop: 80,
          marginHorizontal: 16,
          backgroundColor: theme.colors.grayscaleWhite,
          borderRadius: 16,
          padding: 20,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.08,
          shadowRadius: 8,
          elevation: 2,
          zIndex: 1,
        }}
      >
        {/* Bloco de Mensagem Condicional */}
        {(pokemon.rarity !== "common" ||
          (pokemon.kantoLocations && pokemon.kantoLocations.length === 0)) && (
          <View style={localStylesExtended.infoMessageContainer}>
            {pokemon.rarity === "mythical" ? (
              <Text style={localStylesExtended.infoMessageText}>
                Este Pokémon é Mítico e só pode ser obtido por evento especial.
              </Text>
            ) : pokemon.rarity === "legendary" ? (
              <Text style={localStylesExtended.infoMessageText}>
                Este Pokémon é Lendário e só pode ser encontrado em um local
                único.
              </Text>
            ) : (
              <Text style={localStylesExtended.infoMessageText}>
                Este Pokémon não é encontrado na natureza em Kanto (obtido por
                evolução/troca).
              </Text>
            )}
          </View>
        )}
        {/* Tipos */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginBottom: 12,
          }}
        >
          {pokemon.types.map((type) => (
            <TypeBadge key={type} typeName={type} />
          ))}
        </View>
        {/* Botão Adicionar ao Time */}
        <View style={{ marginTop: 10, marginBottom: 10 }}>
          <Button
            title="Adicionar ao Time"
            onPress={() => {
              addToTeam(pokemon);
              navigation.goBack();
            }}
          />
        </View>
        {/* Habilidades */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Habilidades:</Text>
          {pokemon.abilities.map((ability) => (
            <Text key={ability} style={styles.textItem}>
              {ability}
            </Text>
          ))}
        </View>
        {/* Estatísticas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Estatísticas:</Text>
          {pokemon.stats.map((stat) => (
            <StatBar
              key={stat.name}
              statName={stat.name}
              value={stat.base_stat}
            />
          ))}
        </View>
        {/* Evoluções */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Evoluções:</Text>
          <FlatList
            horizontal
            data={pokemon.evolutionChain}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item, index }) => (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <EvolutionStage {...item} />
                {index < pokemon.evolutionChain.length - 1 && (
                  <Text style={{ fontSize: 24, marginHorizontal: 10 }}>→</Text>
                )}
              </View>
            )}
          />
        </View>
        {/* Fraquezas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fraquezas (Dano x2):</Text>
          <View style={localStylesExtended.typeGrid}>
            {pokemon.damageRelations.weaknesses.map((type) => (
              <TypeBadge key={type} typeName={type} />
            ))}
          </View>
        </View>
        {/* Resistências */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resistências (Dano x0.5):</Text>
          <View style={localStylesExtended.typeGrid}>
            {pokemon.damageRelations.resistances.map((type) => (
              <TypeBadge key={type} typeName={type} />
            ))}
          </View>
        </View>
        {/* Imunidades */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Imunidades (Dano x0):</Text>
          <View style={localStylesExtended.typeGrid}>
            {pokemon.damageRelations.immunities.map((type) => (
              <TypeBadge key={type} typeName={type} />
            ))}
          </View>
        </View>
        {/* Descrição da Pokédex */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Descrição da Pokédex:</Text>
          <View style={localStylesExtended.pokedexDescription}>
            <Text style={localStylesExtended.pokedexText}>
              {pokemon.pokedexDescription}
            </Text>
          </View>
        </View>
        {/* --- SEÇÃO DE LOCAIS DE ENCONTRO (NOVA LÓGICA) --- */}
        {pokemon.kantoLocations && pokemon.kantoLocations.length > 0 && (
          <View style={styles.section}>
            <View style={localStylesExtended.locationHeader}>
              <Text style={styles.sectionTitle}>Onde Encontrar em Kanto</Text>
              <TouchableOpacity
                onPress={() => setShowLocations(!showLocations)}
              >
                <Ionicons
                  name={showLocations ? "eye-off-outline" : "eye-outline"}
                  size={24}
                  color={theme.colors.identityPrimary}
                />
              </TouchableOpacity>
            </View>
            {showLocations &&
              pokemon.kantoLocations.map((gameData) => (
                <View
                  key={gameData.version}
                  style={localStylesExtended.locationGroup}
                >
                  <Text style={localStylesExtended.gameVersionText}>
                    {gameData.version.toUpperCase()}
                  </Text>
                  {gameData.locations.map((location) => (
                    <Text
                      key={location}
                      style={localStylesExtended.locationText}
                    >
                      - {location}
                    </Text>
                  ))}
                </View>
              ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const localStyles = StyleSheet.create({
  debugText: {
    color: "rgb(206, 52, 58)", // Red as per theme for visibility
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    padding: 5,
    borderRadius: 5,
  },
});

// Local styles for new UI elements
const localStylesExtended = StyleSheet.create({
  typeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  pokedexDescription: {
    backgroundColor: "#f0f0f0",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginTop: 5,
  },
  pokedexText: {
    fontFamily: "monospace",
    fontSize: 14,
    color: "#333",
  },
  infoMessageContainer: {
    padding: 10,
    backgroundColor: theme.colors.grayscaleLight,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: "center",
  },
  infoMessageText: {
    color: theme.colors.grayscaleDark,
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 14,
  },
  locationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  locationGroup: {
    marginBottom: 10,
  },
  gameVersionText: {
    fontSize: 16,
    fontWeight: "bold",
    textTransform: "capitalize",
    color: "#333",
  },
  locationText: {
    fontSize: 14,
    color: "#555",
    marginLeft: 10,
  },
});
