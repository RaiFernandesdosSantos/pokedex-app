// pokemonService.ts
// Serviço para dados de Pokémon e detalhes (PokéAPI + Firestore).
// - fetchAllPokemons: lista básica de pokémons.
// - fetchPokemonDetails: detalhes completos (cadeia evolutiva, fraquezas, descrição, locais de encontro, raridade, golpes aprendíveis).
// - Firestore usado como cache para acelerar buscas.
// Tipos exportados:
//   - Pokemon: dados básicos
//   - PokemonDetailsData: dados completos

import { db } from "@/config/firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";

// --- TIPOS DE DADOS ATUALIZADOS ---

export type Pokemon = {
  id: number;
  number: number;
  name: string;
  types: string[];
  imageUrl: string;
};

export type PokemonDetailsData = {
  id: number;
  name: string;
  types: string[];
  imageUrl: string;
  abilities: string[];
  stats: { name: string; base_stat: number }[];
  pokedexDescription: string;
  evolutionChain: {
    id: number;
    name: string;
    imageUrl: string;
  }[];
  damageRelations: {
    weaknesses: string[];
    resistances: string[];
    immunities: string[];
  };
  kantoLocations?: {
    version: string;
    locations: string[];
  }[];
  rarity: 'common' | 'legendary' | 'mythical'; // Novo campo
  learnableMoves: { name: string; level: number }[]; // <-- ADICIONADO
};

// --- FUNÇÕES DO SERVIÇO ---

/**
 * Função auxiliar para buscar e processar a cadeia de evolução.
 */
async function parseEvolutionChain(chainUrl: string) {
  const evolutionChain = [];
  try {
    const response = await fetch(chainUrl);
    const data = await response.json();
    let currentStage = data.chain;

    while (currentStage) {
      const idMatch = currentStage.species.url.match(/\/(\d+)\/$/);
      const id = idMatch ? parseInt(idMatch[1]) : 0;
      evolutionChain.push({
        name: currentStage.species.name,
        id: id,
        imageUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
      });
      currentStage = currentStage.evolves_to[0];
    }
  } catch (error) {
    console.error("Erro ao processar a cadeia de evolução:", error);
  }
  return evolutionChain;
}

/**
 * Função principal para buscar detalhes, agora com cache e dados enriquecidos.
 */
export async function fetchPokemonDetails(
  pokemonId: number
): Promise<PokemonDetailsData> {
  const pokemonDocRef = doc(db, "pokedex", pokemonId.toString());
  const docSnap = await getDoc(pokemonDocRef);

  // Se o documento existe E já tem evolutionChain e kantoLocations, então está completo
  if (docSnap.exists() && docSnap.data().evolutionChain && docSnap.data().kantoLocations && docSnap.data().learnableMoves) {
    console.log("Pokémon COMPLETO encontrado no cache do Firestore!");
    return docSnap.data() as PokemonDetailsData;
  }

  // Se não existe ou está incompleto, busca e atualiza
  console.log("Pokémon não encontrado ou incompleto no cache. Buscando/Atualizando...");

  // Chamadas paralelas para otimizar o tempo de busca
  const [pokemonResponse, speciesResponse, encountersResponse] = await Promise.all([
    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`),
    fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`),
    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}/encounters`),
  ]);

  const pokemonData = await pokemonResponse.json();
  const speciesData = await speciesResponse.json();
  const encountersData = await encountersResponse.json();

  // --- Processamento dos Dados ---

  const types = pokemonData.types.map((t: any) => t.type.name);

  // Buscar relações de dano para cada tipo
  const typeDetailsPromises = types.map((typeName: string) =>
    fetch(`https://pokeapi.co/api/v2/type/${typeName}`).then((res) => res.json())
  );
  const typeDetails = await Promise.all(typeDetailsPromises);

  // Consolidar fraquezas, resistências e imunidades
  const weaknesses = new Set<string>();
  const resistances = new Set<string>();
  const immunities = new Set<string>();

  typeDetails.forEach(typeDetail => {
    typeDetail.damage_relations.double_damage_from.forEach((t: any) => weaknesses.add(t.name));
    typeDetail.damage_relations.half_damage_from.forEach((t: any) => resistances.add(t.name));
    typeDetail.damage_relations.no_damage_from.forEach((t: any) => immunities.add(t.name));
  });

  // Processar a cadeia de evolução
  const evolutionChain = await parseEvolutionChain(speciesData.evolution_chain.url);

  // Pegar uma descrição em inglês
  const flavorTextEntry = speciesData.flavor_text_entries.find(
    (entry: any) => entry.language.name === "en"
  );

  // NOVA LÓGICA para filtrar locais de Kanto
  const kantoGames = ["red", "blue", "yellow"];
  const kantoLocations: { version: string; locations: string[] }[] = [];

  kantoGames.forEach(game => {
    const locationsForGame = encountersData
      .filter((encounter: any) => encounter.version_details.some((vd: any) => vd.version.name === game))
      .map((encounter: any) => encounter.location_area.name.replace(/-/g, ' '));
    if (locationsForGame.length > 0) {
      kantoLocations.push({
        version: game,
        locations: [...new Set(locationsForGame as string[])]
      });
    }
  });

  // LÓGICA PARA PROCESSAR E FILTRAR OS GOLPES
  const learnableMoves = pokemonData.moves
    .map((moveData: any) => {
      // Encontra detalhes de como o golpe é aprendido em Red/Blue/Yellow
      const kantoLearnDetail = moveData.version_group_details.find(
        (detail: any) => 
          (detail.version_group.name === 'red-blue' || detail.version_group.name === 'yellow') && 
          detail.move_learn_method.name === 'level-up'
      );
      if (kantoLearnDetail) {
        return {
          name: moveData.move.name.replace(/-/g, ' '),
          level: kantoLearnDetail.level_learned_at,
        };
      }
      return null;
    })
    .filter((move: any): move is { name: string; level: number } => move !== null)
    .sort((a: { name: string; level: number }, b: { name: string; level: number }) => a.level - b.level);

  const standardizedData: PokemonDetailsData = {
    id: pokemonData.id,
    name: pokemonData.name,
    // Lógica de fallback para garantir sempre uma imagem
    imageUrl: 
      pokemonData.sprites.other["official-artwork"].front_default ||
      pokemonData.sprites.other.dream_world.front_default ||
      pokemonData.sprites.front_default,
    types,
    abilities: pokemonData.abilities.map((a: any) => a.ability.name),
    stats: pokemonData.stats.map((s: any) => ({
      name: s.stat.name,
      base_stat: s.base_stat,
    })),
    pokedexDescription:
      flavorTextEntry?.flavor_text.replace(/\s+/g, " ") || "No description available.",
    evolutionChain,
    damageRelations: {
      weaknesses: Array.from(weaknesses),
      resistances: Array.from(resistances),
      immunities: Array.from(immunities),
    },
    kantoLocations: kantoLocations, // Sempre salva como array (pode ser vazio)
    rarity: speciesData.is_legendary ? 'legendary' : speciesData.is_mythical ? 'mythical' : 'common',
    learnableMoves, // <-- ADICIONADO
  };

  await setDoc(pokemonDocRef, standardizedData);

  return standardizedData;
}

// A função fetchAllPokemons pode continuar a mesma por enquanto.
export async function fetchAllPokemons(
  limit: number = 151
): Promise<Pokemon[]> {
  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon?limit=${limit}`
    );
    const data = await response.json();

    const pokemons: Pokemon[] = await Promise.all(
      data.results.map(async (pokemon: { name: string; url: string }) => {
        const idMatch = pokemon.url.match(/\/(\d+)\/$/);
        const id = idMatch ? parseInt(idMatch[1]) : 0;

        const detailResponse = await fetch(pokemon.url);
        const detailData = await detailResponse.json();
        const types: string[] = detailData.types.map(
          (t: { type: { name: string } }) => t.type.name
        );

        return {
          id,
          number: id,
          name: pokemon.name,
          types,
          imageUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
        };
      })
    );
    return pokemons;
  } catch (error) {
    console.error("Erro ao buscar pokémons:", error);
    return [];
  }
}
