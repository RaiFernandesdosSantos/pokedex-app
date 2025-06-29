/**
 * unistyles.ts
 *
 * Inicializa e registra o tema global do app usando react-native-unistyles.
 *
 * Permite uso de tokens de tema em todos os componentes.
 */

import { UnistylesRegistry } from 'react-native-unistyles';
import { theme } from './theme';

// Registra nosso tema no app
UnistylesRegistry.addThemes({
  light: theme,
  // Poderíamos adicionar um tema 'dark' aqui no futuro
}).addConfig({
  // Define o tema inicial
  initialTheme: 'light',
});