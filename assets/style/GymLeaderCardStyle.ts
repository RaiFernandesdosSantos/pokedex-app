// GymLeaderCardStyle.ts
// Estilos dedicados para o componente GymLeaderCard.
// Define aparência do card de líder de ginásio, imagem, texto e elementos internos.

import { StyleSheet } from 'react-native';
import { theme } from './theme';

const styles = StyleSheet.create({
  card: {
    width: 150, // Largura fixa para o cálculo da grade
    backgroundColor: theme.colors.grayscaleWhite,
    borderRadius: 12,
    padding: 10,
    margin: 8,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  leaderImage: {
    width: 80,
    height: 80,
    resizeMode: 'contain', // Impede que a imagem dê "zoom"
    marginBottom: 8,
  },
  infoContainer: {
    alignItems: 'center',
  },
  leaderName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.grayscaleDark,
  },
  cityName: {
    fontSize: 12,
    color: theme.colors.grayscaleMedium,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 6,
    color: theme.colors.grayscaleDark,
    alignSelf: 'flex-start',
  },
  pokemonImage: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  advantageContainer: {
    width: '100%',
  },
  advantagePokemon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: theme.colors.pokemonTypeGrass,
  },
  noAdvantageText: {
    fontSize: 12,
    color: theme.colors.identityPrimary,
    fontStyle: 'italic',
  }
});

export default styles;
