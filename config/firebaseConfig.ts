/**
 * firebaseConfig.ts
 *
 * Configuração e inicialização do Firebase para o app.
 *
 * Propósito:
 *   - Centraliza a configuração do Firebase (Auth e Firestore).
 *   - Evita múltiplas inicializações do app em ambiente de desenvolvimento.
 *
 * Integração:
 *   - Importe { auth, db } deste arquivo para usar autenticação e banco de dados.
 *
 * Exemplo de uso:
 *   import { auth, db } from '@/config/firebaseConfig';
 *
 * Pontos de atenção:
 *   - Nunca exponha suas chaves em repositórios públicos.
 *   - O app é inicializado apenas uma vez, mesmo com HMR.
 */

import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDAMvsLpTBBiPb1VuULQ2I2T6Uw7-F6lSE", // Mantenha sua chave aqui
  authDomain: "pokedex-app-77b46.firebaseapp.com",
  projectId: "pokedex-app-77b46",
  storageBucket: "pokedex-app-77b46.firebasestorage.app",
  messagingSenderId: "503439687847",
  appId: "1:503439687847:web:fbf9543bccc3296c5c5b82",
  measurementId: "G-1Q4Y647D6C"
};

// Verificamos se o app já foi inicializado para evitar erros de HMR (Hot Module Replacement)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };