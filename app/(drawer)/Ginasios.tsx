import { ScrollView, View, Text, Image } from "react-native";
import { kantoGymLeaders } from "../../services/gymService";
import { usePokemonTeam } from "../../context/PokemonTeamContext";
import { getTeamWeaknesses } from "../../services/typeService";
import { styles } from "../../assets/style/GymStyle";
import { useEffect, useState } from "react";

export default function GymScreen() {
  const { team } = usePokemonTeam();
  const [weaknesses, setWeaknesses] = useState<Record<string, number>>({});

  useEffect(() => {
    async function fetchWeaknesses() {
      const result = await getTeamWeaknesses(team);
      setWeaknesses(result);
    }

    if (team.length > 0) {
      fetchWeaknesses();
    }
  }, [team]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Líderes de Ginásio (Kanto)</Text>

      {kantoGymLeaders.map((gym) => (
        <View key={gym.name} style={styles.leaderCard}>
          <Image source={{ uri: gym.imageUrl }} style={styles.gymImage} />

          <Text style={styles.leaderName}>
            {gym.name} - {gym.city}
          </Text>

          <View style={styles.typeContainer}>
            <View style={styles.typeBadge}>
              <Text style={styles.typeText}>{gym.type}</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Pokémons:</Text>
          <View style={styles.pokemonList}>
            {gym.team.map((poke) => (
              <Text key={poke} style={styles.pokemonName}>
                • {poke}
              </Text>
            ))}
          </View>

          <Text style={[styles.title, { marginTop: 24 }]}>
            Fraquezas do seu time
          </Text>
          <View style={styles.weaknessContainer}>
            {Object.entries(weaknesses).length === 0 ? (
              <Text style={styles.noWeaknessText}>
                Seu time não tem fraquezas.
              </Text>
            ) : (
              Object.entries(weaknesses).map(([type, count]) => (
                <View key={type} style={styles.weaknessItem}>
                  <Text style={styles.weaknessType}>{type.toUpperCase()}</Text>
                  <Text style={styles.weaknessCount}>{count}</Text>
                </View>
              ))
            )}
          </View>
        </View>
      ))}
    </ScrollView>
  );
}
