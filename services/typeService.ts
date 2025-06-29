/**
 * typeService.ts
 *
 * Serviço para cálculo de fraquezas de tipos de Pokémon e times.
 *
 * - getPokemonTypeWeaknesses: retorna fraquezas de um Pokémon.
 * - getTeamWeaknesses: retorna fraquezas agregadas do time inteiro.
 * - Usa PokéAPI para buscar relações de dano entre tipos.
 *
 * Integração:
 *   - Importe e use getTeamWeaknesses para mostrar fraquezas do time.
 *
 * Exemplo de uso:
 *   const weaknesses = await getTeamWeaknesses(team);
 *
 * Pontos de atenção:
 *   - As funções são assíncronas e fazem múltiplas requisições.
 *   - Pode haver lentidão se o time for grande ou a internet lenta.
 *
 * Sugestão:
 *   - Implemente cache local para tipos já consultados.
 */

import { fetchPokemonDetails } from "./pokemonService";
import { TeamPokemon } from "../context/PokemonTeamContext";

export async function getPokemonTypeWeaknesses(
  types: string[]
): Promise<string[]> {
  const weaknesses = new Set<string>();

  for (const type of types) {
    const res = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
    const data = await res.json();

    data.damage_relations.double_damage_from.forEach((weakType: any) =>
      weaknesses.add(weakType.name)
    );
  }

  return Array.from(weaknesses);
}

export async function getTeamWeaknesses(team: TeamPokemon[]) {
  const allWeaknesses: string[] = [];

  for (const teamMember of team) {
    const weaknesses = await getPokemonTypeWeaknesses(teamMember.types);
    allWeaknesses.push(...weaknesses);
  }

  const count: Record<string, number> = {};
  allWeaknesses.forEach((type) => {
    count[type] = (count[type] || 0) + 1;
  });

  return count;
}
