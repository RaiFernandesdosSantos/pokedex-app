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
};

export async function fetchPokemonDetails(
  pokemonId: number
): Promise<PokemonDetailsData> {
  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${pokemonId}`
    );
    const data = await response.json();

    const types = data.types.map((item: any) => item.type.name);
    const abilities = data.abilities.map((item: any) => item.ability.name);
    const stats = data.stats.map((item: any) => ({
      name: item.stat.name,
      base_stat: item.base_stat,
    }));

    const pokemonDetails: PokemonDetailsData = {
      id: data.id,
      name: data.name,
      types,
      imageUrl:
        data.sprites.other["official-artwork"].front_default ||
        data.sprites.front_default,
      abilities,
      stats,
    };

    return pokemonDetails;
  } catch (error) {
    console.error("Erro ao buscar detalhes do Pokémon:", error);
    throw error;
  }
}
