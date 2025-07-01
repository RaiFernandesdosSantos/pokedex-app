import { StyleSheet } from 'react-native';
import { theme } from './theme';

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 12,
    marginVertical: 8,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  leftColumn: {
    flex: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  rightColumn: {
    flex: 0.5,
    justifyContent: 'space-between',
  },
  image: {
    width: 90,
    height: 90,
    marginBottom: 8,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.grayscaleWhite,
    textTransform: 'capitalize',
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  level: {
    fontSize: 14,
    color: theme.colors.grayscaleWhite,
    fontWeight: '600',
    backgroundColor: 'rgba(0,0,0,0.25)',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 12,
    marginTop: 6,
    overflow: 'hidden', // Garante que o fundo arredondado funcione bem no Android
  },
  typesContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  typesContainer_vertical: {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 8,
    minHeight: 30,
  },
  detailRow: {
    marginBottom: 8,
  },
  detailTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'rgba(255,255,255,0.8)',
    textTransform: 'uppercase',
  },
  detailValue: {
    fontSize: 15,
    color: theme.colors.grayscaleWhite,
    textTransform: 'capitalize',
    fontWeight: '500',
  },
  movesContainer: {
    marginTop: 4,
  },
  moveSlot: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginBottom: 5,
  },
  moveText: {
    color: theme.colors.grayscaleWhite,
    textTransform: 'capitalize',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginVertical: 6,
  },
});

export default styles;