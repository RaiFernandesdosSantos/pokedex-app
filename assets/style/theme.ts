/**
 * theme.ts
 *
 * Tema central do app (cores, espaçamentos, etc), inspirado no Figma.
 *
 * Exporta o objeto theme para uso com Unistyles e componentes.
 */

// As cores que você encontrou no Figma, agora como um tema central.
const palette = {
  identityPrimary: '#dc0a2d',
  identitySecondary: '#28aafd',
  grayscaleDark: '#1d1d1d',
  grayscaleMedium: '#666666',
  grayscaleLight: '#e0e0e0',
  grayscaleBackground: '#efefef',
  grayscaleWhite: '#ffffff',
  pokemonTypeBug: '#a7b723',
  pokemonTypeDark: '#75574c',
  pokemonTypeDragon: '#7037ff',
  pokemonTypeElectric: '#f9cf30',
  pokemonTypeFairy: '#e69eac',
  pokemonTypeFighting: '#c12239',
  pokemonTypeFire: '#f57d31',
  pokemonTypeFlying: '#a891ec',
  pokemonTypeGhost: '#70559b',
  pokemonTypeGrass: '#74cb48',
  pokemonTypeGround: '#dec16b',
  pokemonTypeIce: '#9ad6df',
  pokemonTypeNormal: '#aaa67f',
  pokemonTypePoison: '#a43e9e',
  pokemonTypePsychic: '#fb5584',
  pokemonTypeRock: '#b69e31',
  pokemonTypeSteel: '#b7b9d0',
  pokemonTypeWater: '#6493eb',
};

// Definimos nosso tema
export const theme = {
  colors: palette,
  margins: {
    sm: 8,
    md: 16,
    lg: 24,
  },
  // Podemos adicionar fontes, etc. aqui no futuro
} as const;

// Tipagem para o tema (opcional, mas boa prática)
declare module 'react-native-unistyles' {
  export interface UnistylesThemes {
    light: typeof theme;
    // Adicione outros temas aqui se/quando criar (ex: dark)
  }
}