// theme.ts
// Tema central do app (cores, espaçamentos).

export const colors = {
  identityPrimary: "#d60a2c",
  identitySecondary: "#28aafd",
  grayscaleDark: "#1d1d1d",
  grayscaleMedium: "#666666",
  grayscaleLight: "#e0e0e0",
  grayscaleBackground: "#efefef",
  grayscaleWhite: "#ffffff",
  pokemonTypeBug: "#a7b723",
  pokemonTypeDark: "#75574c",
  pokemonTypeDragon: "#7037ff",
  pokemonTypeElectric: "#f9cf30",
  pokemonTypeFairy: "#e69eac",
  pokemonTypeFighting: "#c12239",
  pokemonTypeFire: "#f57d31",
  pokemonTypeFlying: "#a891ec",
  pokemonTypeGhost: "#70559b",
  pokemonTypeGrass: "#74cb48",
  pokemonTypeGround: "#dec16b",
  pokemonTypeIce: "#9ad6df",
  pokemonTypeNormal: "#aaa67f",
  pokemonTypePoison: "#a43e9e",
  pokemonTypePsychic: "#fb5584",
  pokemonTypeRock: "#b69e31",
  pokemonTypeSteel: "#b7b9d0",
  pokemonTypeWater: "#6493eb",
};

export const spacing = {
  sm: 8,
  md: 16,
  lg: 24,
};

// Export opcional de tema completo (caso queira)
export const theme = {
  colors,
  primary: colors.identityPrimary, // Adiciona alias para compatibilidade
};
