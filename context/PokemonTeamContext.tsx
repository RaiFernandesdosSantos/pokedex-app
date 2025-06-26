/**
 * PokemonTeamContext.tsx
 *
 * Contexto global para gerenciamento do time de Pokémon do usuário.
 *
 * Propósito:
 *   - Permite adicionar, remover e sincronizar o time do usuário autenticado com o Firestore.
 *   - Garante persistência do time entre dispositivos e sessões.
 *
 * Integração:
 *   - Envolva o app com <PokemonTeamProvider> (geralmente junto do AuthProvider).
 *   - Use o hook usePokemonTeam() para acessar o time, adicionar/remover Pokémon e saber se está carregando.
 *
 * Exemplo de uso:
 *   const { team, addToTeam, removeFromTeam, isLoadingTeam } = usePokemonTeam();
 *   addToTeam(pokemon);
 *   removeFromTeam(pokemonId);
 *
 * Pontos de atenção:
 *   - Só permite manipulação do time se o usuário estiver autenticado.
 *   - O time é limitado a 6 Pokémon.
 *   - O estado local é atualizado antes do Firestore para melhor UX, mas pode haver atraso de sincronização.
 *
 * Sugestão:
 *   - Adicione tratamento de erros para operações com o Firestore.
 *   - Considere mostrar feedback visual ao salvar/remover.
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

export type TeamPokemon = {
  id: number;
  name: string;
  imageUrl: string;
  types: string[];
};

type PokemonTeamContextType = {
  team: TeamPokemon[];
  isLoadingTeam: boolean;
  addToTeam: (pokemon: TeamPokemon) => void;
  removeFromTeam: (pokemonId: number) => void;
};

const PokemonTeamContext = createContext<PokemonTeamContextType | undefined>(
  undefined
);

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

  const addToTeam = async (pokemon: TeamPokemon) => {
    if (!user) return;
    if (team.find((p) => p.id === pokemon.id)) return;
    if (team.length >= 6) {
      alert("Seu time já está cheio!");
      return;
    }
    const userDocRef = doc(db, "users", user.uid);
    setTeam((prev) => [...prev, pokemon]);
    await setDoc(userDocRef, { team: arrayUnion(pokemon) }, { merge: true });
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
      value={{ team, isLoadingTeam, addToTeam, removeFromTeam }}
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
