// gymService.ts
// Dados dos líderes de ginásio de Kanto.
//
// - Exporta lista kantoGymLeaders com nome, cidade, tipo, imagem e time de cada líder.
// - Usado na tela de líderes de ginásio para exibir informações e desafios.

export interface GymLeader {
  id: string;
  name: string;
  city: string;
  type: string;
  imageUrl: string;
  // A estrutura do time agora inclui o nível
  team: { id: number; level: number }[];
}

export const kantoGymLeaders: GymLeader[] = [
  {
    id: "brock",
    name: "Brock",
    city: "Pewter City",
    type: "rock",
    imageUrl: "https://img.pokemondb.net/sprites/trainers/red-blue/brock.png",
    team: [
      { id: 74, level: 12 },
      { id: 95, level: 14 },
    ],
  },
  {
    id: "misty",
    name: "Misty",
    city: "Cerulean City",
    type: "water",
    imageUrl: "https://img.pokemondb.net/sprites/trainers/red-blue/misty.png",
    team: [
      { id: 120, level: 18 },
      { id: 121, level: 21 },
    ],
  },
  {
    id: "lt-surge",
    name: "Lt. Surge",
    city: "Vermilion City",
    type: "electric",
    imageUrl: "https://img.pokemondb.net/sprites/trainers/red-blue/lt-surge.png",
    team: [
      { id: 100, level: 21 },
      { id: 25, level: 18 },
      { id: 26, level: 24 },
    ],
  },
  {
    id: "erika",
    name: "Erika",
    city: "Celadon City",
    type: "grass",
    imageUrl: "https://img.pokemondb.net/sprites/trainers/red-blue/erika.png",
    team: [
      { id: 71, level: 29 },
      { id: 114, level: 24 },
      { id: 45, level: 29 },
    ],
  },
  {
    id: "koga",
    name: "Koga",
    city: "Fuchsia City",
    type: "poison",
    imageUrl: "https://img.pokemondb.net/sprites/trainers/red-blue/koga.png",
    team: [
      { id: 109, level: 37 },
      { id: 89, level: 39 },
      { id: 109, level: 37 },
      { id: 110, level: 43 },
    ],
  },
  {
    id: "sabrina",
    name: "Sabrina",
    city: "Saffron City",
    type: "psychic",
    imageUrl: "https://img.pokemondb.net/sprites/trainers/red-blue/sabrina.png",
    team: [
      { id: 64, level: 38 },
      { id: 122, level: 37 },
      { id: 49, level: 38 },
      { id: 65, level: 43 },
    ],
  },
  {
    id: "blaine",
    name: "Blaine",
    city: "Cinnabar Island",
    type: "fire",
    imageUrl: "https://img.pokemondb.net/sprites/trainers/red-blue/blaine.png",
    team: [
      { id: 58, level: 42 },
      { id: 78, level: 40 },
      { id: 77, level: 42 },
      { id: 59, level: 47 },
    ],
  },
  {
    id: "giovanni",
    name: "Giovanni",
    city: "Viridian City",
    type: "ground",
    imageUrl: "https://img.pokemondb.net/sprites/trainers/red-blue/giovanni.png",
    team: [
      { id: 111, level: 45 },
      { id: 31, level: 42 },
      { id: 112, level: 50 },
      { id: 34, level: 45 },
      { id: 31, level: 44 },
    ],
  },
];
