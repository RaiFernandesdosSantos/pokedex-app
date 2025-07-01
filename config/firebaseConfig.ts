// firebaseConfig.ts
// Configuração e exportação do Firebase (auth, db).
//
// Atenção: nunca exponha suas chaves em repositórios públicos.

import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence, getAuth } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";
import { Platform } from "react-native";

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

let auth;
if (Platform.OS !== "web") {
  // React Native: usa AsyncStorage e initializeAuth
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} else {
  // Web: usa getAuth normal
  auth = getAuth(app);
}

const db = getFirestore(app);

export { app, auth, db };