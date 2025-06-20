export interface GymLeader {
  name: string;
  city: string;
  type: string;
  imageUrl: string;
  team: number[];
}

export const kantoGymLeaders: GymLeader[] = [
  {
    name: "Brock",
    city: "Pewter City",
    type: "rock",
    imageUrl: "https://img.pokemondb.net/sprites/trainers/red-blue/brock.png",
    team: [74, 95], // Geodude, Onix
  },
  {
    name: "Misty",
    city: "Cerulean City",
    type: "water",
    imageUrl: "https://img.pokemondb.net/sprites/trainers/red-blue/misty.png",
    team: [120, 121], // Staryu, Starmie
  },
  {
    name: "Lt. Surge",
    city: "Vermilion City",
    type: "electric",
    imageUrl:
      "https://img.pokemondb.net/sprites/trainers/red-blue/lt-surge.png",
    team: [26], // Raichu
  },
  {
    name: "Erika",
    city: "Celadon City",
    type: "grass",
    imageUrl: "https://img.pokemondb.net/sprites/trainers/red-blue/erika.png",
    team: [114, 71, 45], // Tangela, Victreebel, Vileplume
  },
  {
    name: "Koga",
    city: "Fuchsia City",
    type: "poison",
    imageUrl: "https://img.pokemondb.net/sprites/trainers/red-blue/koga.png",
    team: [109, 109, 88, 89], // Koffing x2, Grimer, Weezing
  },
  {
    name: "Sabrina",
    city: "Saffron City",
    type: "psychic",
    imageUrl: "https://img.pokemondb.net/sprites/trainers/red-blue/sabrina.png",
    team: [64, 122, 49, 65], // Kadabra, Mr. Mime, Venomoth, Alakazam
  },
  {
    name: "Blaine",
    city: "Cinnabar Island",
    type: "fire",
    imageUrl: "https://img.pokemondb.net/sprites/trainers/red-blue/blaine.png",
    team: [58, 77, 126, 59], // Growlithe, Ponyta, Magmar, Arcanine
  },
  {
    name: "Giovanni",
    city: "Viridian City",
    type: "ground",
    imageUrl:
      "https://img.pokemondb.net/sprites/trainers/red-blue/giovanni.png",
    team: [111, 31, 112, 34, 31], // Rhyhorn, Nidoqueen, Rhydon, Nidoking, Dugtrio
  },
];
