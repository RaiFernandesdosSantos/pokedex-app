//script que pretendo rodar só uma vez para popular o Firestore com os dados iniciais da Pokédex e dos líderes de ginásio
// ele busca os dados da PokéAPI e salva no Firestore
// continua necessário ter o Firebase configurado e as dependencies
const { initializeApp } = require("firebase/app");
const { getFirestore, doc, setDoc } = require("firebase/firestore");
const fetch = require("node-fetch");

const firebaseConfig = {
  apiKey: "AIzaSyCa9RiSyqvBPvLBoeKFboDzB7rQrwy7hVw",
  authDomain: "pokedex-app-77b46.firebaseapp.com",
  projectId: "pokedex-app-77b46",
  storageBucket: "pokedex-app-77b46.firebasestorage.app",
  messagingSenderId: "503439687847",
  appId: "1:503439687847:android:60c320c4506ca8ab5c5b82",
};

const kantoGymLeaders = [
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
    order: 1,
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
    order: 2,
  },
  {
    id: "lt-surge",
    name: "Lt. Surge",
    city: "Vermilion City",
    type: "electric",
    imageUrl:
      "https://img.pokemondb.net/sprites/trainers/red-blue/lt-surge.png",
    team: [
      { id: 100, level: 21 },
      { id: 25, level: 18 },
      { id: 26, level: 24 },
    ],
    order: 3,
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
    order: 4,
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
    order: 5,
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
    order: 6,
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
    order: 7,
  },
  {
    id: "giovanni",
    name: "Giovanni",
    city: "Viridian City",
    type: "ground",
    imageUrl:
      "https://img.pokemondb.net/sprites/trainers/red-blue/giovanni.png",
    team: [
      { id: 111, level: 45 },
      { id: 31, level: 42 },
      { id: 112, level: 50 },
      { id: 34, level: 45 },
      { id: 50, level: 44 },
    ],
    order: 8,
  },
];

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function parseEvolutionChain(chainUrl) {
  const evolutionChain = [];
  try {
    const response = await fetch(chainUrl);
    const data = await response.json();
    let currentStage = data.chain;
    while (currentStage) {
      const idMatch = currentStage.species.url.match(/\/(\d+)\/$/);
      if (idMatch) {
        const id = parseInt(idMatch[1]);
        evolutionChain.push({
          name: currentStage.species.name,
          id: id,
          imageUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
        });
      }
      currentStage = currentStage.evolves_to[0];
    }
  } catch (error) {
    console.error("Erro na cadeia de evolução:", error);
  }
  return evolutionChain;
}

async function fetchAndSeedPokemon(pokemonId) {
  // Lógica de fetch e padronização (copiada e adaptada do seu pokemonService.ts)
  const [pokemonResponse, speciesResponse] = await Promise.all([
    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`),
    fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`),
  ]);

  if (!pokemonResponse.ok || !speciesResponse.ok)
    throw new Error(`Falha no fetch para Pokémon #${pokemonId}`);

  const pokemonData = await pokemonResponse.json();
  const speciesData = await speciesResponse.json();
  const evolutionChain = await parseEvolutionChain(
    speciesData.evolution_chain.url
  );
  const flavorTextEntry = speciesData.flavor_text_entries.find(
    (entry) => entry.language.name === "en"
  );

  const standardizedData = {
    id: pokemonData.id,
    name: pokemonData.name,
    imageUrl:
      pokemonData.sprites.other["official-artwork"].front_default ||
      pokemonData.sprites.front_default,
    types: pokemonData.types.map((t) => t.type.name),
    abilities: pokemonData.abilities.map((a) => a.ability.name),
    stats: pokemonData.stats.map((s) => ({
      name: s.stat.name,
      base_stat: s.base_stat,
    })),
    pokedexDescription:
      flavorTextEntry?.flavor_text.replace(/\s+/g, " ") ||
      "No description available.",
    evolutionChain,
    rarity: speciesData.is_legendary
      ? "legendary"
      : speciesData.is_mythical
      ? "mythical"
      : "common",
    // Não precisamos de mais nada para o cache principal
  };

  const pokemonDocRef = doc(db, "pokedex", pokemonId.toString());
  await setDoc(pokemonDocRef, standardizedData);
  console.log(`✅ Pokémon #${pokemonId} (${standardizedData.name}) salvo!`);
}

async function seedGymLeaders() {
  console.log("\n🚀 Salvando dados dos Líderes de Ginásio...");
  for (const leader of kantoGymLeaders) {
    const leaderDocRef = doc(db, "gymLeaders", leader.id);
    await setDoc(leaderDocRef, leader);
    console.log(`✅ Líder ${leader.name} salvo!`);
  }
}

async function runSeed() {
  console.log("Iniciando o pré-carregamento do cache...");
  await seedGymLeaders(); //  líderes primeiro

  console.log("\n🚀 Iniciando o pré-carregamento da Pokédex (1-151)...");
  for (let i = 1; i <= 151; i++) {
    try {
      await new Promise((resolve) => setTimeout(resolve, 150)); // para não sobrecarregar a API
      await fetchAndSeedPokemon(i);
    } catch (error) {
      console.error(`❌ Falha ao processar Pokémon #${i}:`, error.message);
    }
  }
  console.log("\n🎉 Processo de seeding concluído!");
  process.exit(0);
}

runSeed();
