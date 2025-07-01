// assets/style/unistyles.ts
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