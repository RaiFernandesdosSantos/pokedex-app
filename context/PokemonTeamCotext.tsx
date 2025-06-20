import React, { createContext, useContext, useState, ReactNode } from "react";

export type TeamPokemon = {
  id: number;
  name: string;
  imageUrl: string;
  types: string[];
};

type PokemonTeamContextType = {
  team: TeamPokemon[];
  addToTeam: (pokemon: TeamPokemon) => void;
  removeFromTeam: (id: number) => void;
};

const PokemonTeamContext = createContext<PokemonTeamContextType | undefined>(
  undefined
);

export const PokemonTeamProvider = ({ children }: { children: ReactNode }) => {
  const [team, setTeam] = useState<TeamPokemon[]>([]);

  const addToTeam = (pokemon: TeamPokemon) => {
    if (team.find((p) => p.id === pokemon.id)) return; // já está no time
    if (team.length >= 6) return; // limite
    setTeam((prev) => [...prev, pokemon]);
  };

  const removeFromTeam = (id: number) => {
    setTeam((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <PokemonTeamContext.Provider value={{ team, addToTeam, removeFromTeam }}>
      {children}
    </PokemonTeamContext.Provider>
  );
};

export const usePokemonTeam = () => {
  const context = useContext(PokemonTeamContext);
  if (!context)
    throw new Error(
      "usePokemonTeam deve ser usado dentro do PokemonTeamProvider"
    );
  return context;
};
