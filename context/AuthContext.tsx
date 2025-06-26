/**
 * AuthContext.tsx
 *
 * Contexto global de autenticação do usuário usando Firebase Auth.
 *
 * Propósito:
 *   - Fornece o usuário autenticado e funções de login, cadastro e logout para todo o app.
 *   - Permite que qualquer componente acesse o estado de autenticação e realize ações de autenticação.
 *
 * Integração:
 *   - Envolva o app com <AuthProvider> no _layout.tsx.
 *   - Use o hook useAuth() para acessar user, login, register, logout e isInitialized.
 *
 * Exemplo de uso:
 *   const { user, login, logout } = useAuth();
 *   if (!user) login(email, senha);
 *
 * Pontos de atenção:
 *   - Sempre use isInitialized para saber se o estado de auth já foi resolvido.
 *   - Não use useAuth fora do AuthProvider.
 *
 * Sugestão:
 *   - Documente as funções login/register/logout para facilitar manutenção.
 */

import React, { createContext, useContext, useState, useEffect } from "react";
import { auth } from "@/config/firebaseConfig";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";

// Define o tipo do contexto
export type AuthContextType = {
  user: User | null;
  isInitialized: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Observa mudanças de autenticação
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      // Quando o primeiro retorno de chamada acontece, sabemos que o estado foi inicializado
      setIsInitialized(true);
    });
    return unsubscribe;
  }, []);

  // Função de login
  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  // Função de cadastro
  const register = async (email: string, password: string) => {
    await createUserWithEmailAndPassword(auth, email, password);
  };

  // Função de logout
  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider
      value={{ user, isInitialized, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return ctx;
};
