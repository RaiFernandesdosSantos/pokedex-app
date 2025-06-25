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
