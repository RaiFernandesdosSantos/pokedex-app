// PokemonTeamContext.tsx
// Contexto global do time de Pokémon (Firestore).
//
// - Permite adicionar, remover e editar membros do time.
// - Sincroniza o time com o Firestore para persistência entre dispositivos.
// - Limita o time a 6 Pokémon.
// - Fornece função para calcular stats baseado no nível.
//
// Use o hook usePokemonTeam() para acessar o time e as funções.

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useAuth } from "./AuthContext";
import { db } from "@/config/firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { PokemonDetailsData } from "@/services/pokemonService";

// Modelo de dados final para um Pokémon no time
export type TeamPokemon = {
  id: number;
  name: string;
  imageUrl: string;
  types: string[];
  level: number;
  ability: string;
  heldItem: string | null; // Usando null para representar "nenhum item"
  moves: string[];
  stats: { name: string; base_stat: number }[];
};

type PokemonTeamContextType = {
  team: TeamPokemon[];
  isLoadingTeam: boolean;
  addToTeam: (pokemon: PokemonDetailsData) => void;
  removeFromTeam: (pokemonId: number) => void;
  updateTeamMember: (pokemonId: number, updates: Partial<TeamPokemon>) => void;
};

const PokemonTeamContext = createContext<PokemonTeamContextType | undefined>(
  undefined
);

export const PokemonTeamProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [team, setTeam] = useState<TeamPokemon[]>([]);
  const [isLoadingTeam, setIsLoadingTeam] = useState(true);

  useEffect(() => {
    if (!user) {
      setTeam([]);
      setIsLoadingTeam(false);
      return;
    }
    const fetchTeam = async () => {
      setIsLoadingTeam(true);
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists() && userDoc.data().team) {
        setTeam(userDoc.data().team as TeamPokemon[]);
      } else {
        setTeam([]);
      }
      setIsLoadingTeam(false);
    };
    fetchTeam();
  }, [user]);

  const addToTeam = async (pokemon: PokemonDetailsData) => {
    if (!user || team.length >= 6 || team.find((p) => p.id === pokemon.id)) {
      if (team.length >= 6) alert("Seu time já está cheio!");
      return;
    }

    const pokemonToAdd: TeamPokemon = {
      id: pokemon.id,
      name: pokemon.name,
      imageUrl: pokemon.imageUrl,
      types: pokemon.types,
      stats: pokemon.stats, // Salva os stats base corretamente
      level: 10,
      ability: pokemon.abilities[0] || "unknown",
      heldItem: null, // null
      //  os 4 primeiros golpes da lista de golpes possiveis
      moves: pokemon.learnableMoves.slice(0, 4).map((m) => m.name),
    };

    const updatedTeam = [...team, pokemonToAdd];
    setTeam(updatedTeam);
    await setDoc(
      doc(db, "users", user.uid),
      { team: updatedTeam },
      { merge: true }
    );
    console.log("Pokemon Add ao time");
  };

  const removeFromTeam = async (pokemonId: number) => {
    if (!user) return;
    const updatedTeam = team.filter((p) => p.id !== pokemonId);
    setTeam(updatedTeam);
    await setDoc(
      doc(db, "users", user.uid),
      { team: updatedTeam },
      { merge: true }
    );
  };

  const updateTeamMember = async (
    pokemonId: number,
    updates: Partial<TeamPokemon>
  ) => {
    if (!user) return;
    const updatedTeam = team.map((p) =>
      p.id === pokemonId ? { ...p, ...updates } : p
    );
    setTeam(updatedTeam);
    await setDoc(
      doc(db, "users", user.uid),
      { team: updatedTeam },
      { merge: true }
    );
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
