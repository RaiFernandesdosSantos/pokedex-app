/**
 * pokemonService.ts
 *
 * Serviço para buscar dados de Pokémon da PokéAPI.
 *
 * Propósito:
 *   - Fornece funções para buscar todos os Pokémon e detalhes individuais.
 *
 * Integração:
 *   - Importe e use fetchAllPokemons e fetchPokemonDetails nas telas que precisam de dados de Pokémon.
 *
 * Exemplo de uso:
 *   const pokemons = await fetchAllPokemons(151);
 *   const details = await fetchPokemonDetails(25);
 *
 * Pontos de atenção:
 *   - As funções são assíncronas e podem lançar erros de rede.
 *   - O fetchAllPokemons faz múltiplas requisições (uma para cada Pokémon).
 *   - Considere tratar loading e erros na UI.
 *
 * Sugestão:
 *   - Implemente cache ou paginação para melhorar performance.
 */

import { db } from "@/config/firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";

export type Pokemon = {
  id: number;
  number: number;
  name: string;
  types: string[];
  imageUrl: string;
};

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

export type PokemonDetailsData = {
  id: number;
  name: string;
  types: string[];
  imageUrl: string;
  abilities: string[];
  stats: { name: string; base_stat: number }[];
  pokedexDescription?: string;
  evolutionChainUrl?: string;
};

export async function fetchPokemonDetails(
  pokemonId: number
): Promise<PokemonDetailsData> {
  // 1. Tenta buscar do nosso cache no Firestore PRIMEIRO
  const pokemonDocRef = doc(db, "pokedex", pokemonId.toString());
  const docSnap = await getDoc(pokemonDocRef);

  if (docSnap.exists()) {
    console.log("Pokémon encontrado no cache do Firestore!");
    return docSnap.data() as PokemonDetailsData;
  }

  // 2. Se NÃO estiver no cache, busca na PokeAPI
  console.log("Pokémon não encontrado no cache. Buscando na PokeAPI...");
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
  const data = await response.json();

  // Chamada extra para species
  const speciesResponse = await fetch(
    `https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`
  );
  const speciesData = await speciesResponse.json();

  const flavorTextEntry = speciesData.flavor_text_entries.find(
    (entry: any) => entry.language.name === "en"
  );

  const standardizedData: PokemonDetailsData = {
    id: data.id,
    name: data.name,
    imageUrl: data.sprites.other["official-artwork"].front_default,
    types: data.types.map((t: any) => t.type.name),
    abilities: data.abilities.map((a: any) => a.ability.name),
    stats: data.stats.map((s: any) => ({
      name: s.stat.name,
      base_stat: s.base_stat,
    })),
    pokedexDescription:
      flavorTextEntry?.flavor_text.replace(/\s+/g, " ") ||
      "No description available.",
    evolutionChainUrl: speciesData.evolution_chain.url,
  };

  // 4. Salva no cache do Firestore
  await setDoc(pokemonDocRef, standardizedData);

  return standardizedData;
}
