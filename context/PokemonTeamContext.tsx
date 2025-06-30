/**
 * PokemonTeamContext.tsx
 *
 * Contexto global para gerenciamento do time de Pokémon do usuário (Firestore).
 *
 * - Permite adicionar, remover e editar membros do time.
 * - Sincroniza o time com o Firestore para persistência entre dispositivos.
 * - Limita o time a 6 Pokémon.
 * - Fornece função para calcular stats baseado no nível.
 *
 * Use o hook usePokemonTeam() para acessar o time e as funções.
 */

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useAuth } from "./AuthContext";
import { db } from "@/config/firebaseConfig";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { PokemonDetailsData } from "@/services/pokemonService";

export type TeamPokemon = {
  id: number;
  name: string;
  imageUrl: string;
  types: string[];
  level: number; // Novo campo
  ability: string; // Novo campo
  heldItem?: string; // Novo campo (opcional)
  moves: string[]; // Novo campo (até 4 golpes)
  baseStats?: { [key: string]: number }; // Novo campo para stats base
  calculatedStats?: { [key: string]: number }; // Novo campo para stats calculados
};

// Função para calcular stats baseado no nível
function calculateStat(base: number, level: number, statName: string): number {
  if (statName.toLowerCase() === "hp") {
    return Math.floor((2 * base * level) / 100) + level + 10;
  }
  return Math.floor((2 * base * level) / 100) + 5;
}

type PokemonTeamContextType = {
  team: TeamPokemon[];
  isLoadingTeam: boolean;
  addToTeam: (pokemon: PokemonDetailsData) => Promise<void>;
  removeFromTeam: (pokemonId: number) => void;
  updateTeamMember: (
    pokemonId: number,
    updates: Partial<TeamPokemon>
  ) => Promise<void>; // Novo método
};

export const PokemonTeamContext = createContext<
  PokemonTeamContextType | undefined
>(undefined);

export const PokemonTeamProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [team, setTeam] = useState<TeamPokemon[]>([]);
  const [isLoadingTeam, setIsLoadingTeam] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      if (user) {
        setIsLoadingTeam(true);
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists() && userDoc.data().team) {
          setTeam(userDoc.data().team);
        } else {
          setTeam([]);
        }
        setIsLoadingTeam(false);
      } else {
        setTeam([]);
        setIsLoadingTeam(false);
      }
    };
    fetchTeam();
  }, [user]);

  const addToTeam = async (pokemon: PokemonDetailsData) => {
    if (!user) return;
    if (team.find((p) => p.id === pokemon.id)) return;
    if (team.length >= 6) {
      alert("Seu time já está cheio!");
      return;
    }

    // Cria o objeto limpo e padronizado com campos estratégicos
    const baseStats = pokemon.stats
      ? pokemon.stats.reduce((acc, stat) => {
          acc[stat.name] = stat.base_stat;
          return acc;
        }, {} as { [key: string]: number })
      : {};
    const calculatedStats = Object.keys(baseStats).reduce((acc, statName) => {
      acc[statName] = calculateStat(baseStats[statName], 5, statName);
      return acc;
    }, {} as { [key: string]: number });

    const pokemonToAdd: TeamPokemon = {
      id: pokemon.id,
      name: pokemon.name,
      imageUrl: pokemon.imageUrl,
      types: pokemon.types,
      level: 5, // Valor padrão
      ability: pokemon.abilities[0] || "", // Primeira habilidade
      heldItem: undefined, // Nenhum item por padrão
      moves: [],
      baseStats,
      calculatedStats,
    };

    const userDocRef = doc(db, "users", user.uid);
    setTeam((prev) => [...prev, pokemonToAdd]);
    await setDoc(
      userDocRef,
      { team: arrayUnion(pokemonToAdd) },
      { merge: true }
    );
  };

  // Função para atualizar membro do time
  const updateTeamMember = async (
    pokemonId: number,
    updates: Partial<TeamPokemon>
  ) => {
    if (!user) return;
    const userDocRef = doc(db, "users", user.uid);
    const member = team.find((p) => p.id === pokemonId);
    if (!member) return;
    let updatedMember = { ...member, ...updates };
    // Recalcula stats se o nível mudou
    if (updates.level && member.baseStats) {
      const newLevel = updates.level;
      const newCalculatedStats = Object.keys(member.baseStats).reduce(
        (acc, statName) => {
          acc[statName] = calculateStat(
            member.baseStats![statName],
            newLevel,
            statName
          );
          return acc;
        },
        {} as { [key: string]: number }
      );
      updatedMember = { ...updatedMember, calculatedStats: newCalculatedStats };
    }
    setTeam((prev) =>
      prev.map((p) => (p.id === pokemonId ? updatedMember : p))
    );
    // Remove o antigo e adiciona o novo no Firestore
    await updateDoc(userDocRef, {
      team: arrayRemove(member),
    });
    await updateDoc(userDocRef, {
      team: arrayUnion(updatedMember),
    });
  };

  const removeFromTeam = async (pokemonId: number) => {
    if (!user) return;
    const userDocRef = doc(db, "users", user.uid);
    const pokemonToRemove = team.find((p) => p.id === pokemonId);
    if (pokemonToRemove) {
      setTeam((prev) => prev.filter((p) => p.id !== pokemonId));
      await updateDoc(userDocRef, { team: arrayRemove(pokemonToRemove) });
    }
  };

  return (
    <PokemonTeamContext.Provider
      value={{
        team,
        isLoadingTeam,
        addToTeam,
        removeFromTeam,
        updateTeamMember,
      }}
    >
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
