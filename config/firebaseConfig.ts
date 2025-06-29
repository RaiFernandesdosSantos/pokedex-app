/**
 * firebaseConfig.ts
 *
 * Configuração e inicialização do Firebase para o app.
 *
 * Exporta instâncias de auth e db para uso global.
 *
 * Atenção: nunca exponha suas chaves em repositórios públicos.
 */

import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCa9RiSyqvBPvLBoeKFboDzB7rQrwy7hVw", // do google-services.json
  authDomain: "pokedex-app-77b46.firebaseapp.com",
  projectId: "pokedex-app-77b46",
  storageBucket: "pokedex-app-77b46.firebasestorage.app",
  messagingSenderId: "503439687847",
  appId: "1:503439687847:android:60c320c4506ca8ab5c5b82"
  // Não precisa de measurementId para Android
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };