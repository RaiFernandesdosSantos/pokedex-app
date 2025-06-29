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

import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyCa9RiSyqvBPvLBoeKFboDzB7rQrwy7hVw", // do google-services.json
  authDomain: "pokedex-app-77b46.firebaseapp.com",
  projectId: "pokedex-app-77b46",
  storageBucket: "pokedex-app-77b46.firebasestorage.app",
  messagingSenderId: "503439687847",
  appId: "1:503439687847:android:60c320c4506ca8ab5c5b82",
  // Não precisa de measurementId para Android
};

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

const db = getFirestore(app);

export { app, auth, db };
