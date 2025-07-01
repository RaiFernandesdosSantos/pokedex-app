import { StyleSheet } from 'react-native';
import { theme } from './theme';

const styles = StyleSheet.create({
  cardWrapper: {
    width: '100%',
    alignItems: 'center',
  },
  cardContainer: {
    borderRadius: 16,
    padding: 12,
    width: 320,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  mainContent: {
    flexDirection: 'row',
  },
  leftColumn: {
    flex: 0.5,
    alignItems: 'center',
    marginRight: 10,
  },
  rightColumn: {
    flex: 0.5,
    paddingLeft: 10,
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 8,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: theme.colors.grayscaleWhite,
    textTransform: 'capitalize',
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    marginBottom: 4,
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
    overflow: 'hidden',
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
    marginBottom: 10,
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
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: 5,
  },
  statsToggle: {
    marginTop: 10,
  },
  statsContainer: {
    marginTop: 8,
    width: '100%',
  },
  removeButtonContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: -15,
    zIndex: 10,
  },
  removeButton: {
    backgroundColor: theme.colors.identityPrimary,
    paddingHorizontal: 25,
    paddingVertical: 6,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    elevation: 4,
  },
  removeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  }
});

export default styles;