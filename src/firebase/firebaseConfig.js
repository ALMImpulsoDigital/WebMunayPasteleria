// src/firebase/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// 🔹 ACA pegás la config de tu proyecto Firebase
// de la consola (Configuración de la app web)
const firebaseConfig = {
  apiKey: "AIzaSyCkzPyvPvFTuyXvbQW8WJ8CoDZXvecMq24",
  authDomain: "pasteleria-munay.firebaseapp.com",
  projectId: "pasteleria-munay",
  storageBucket: "pasteleria-munay.firebasestorage.app",
  messagingSenderId: "1015915959664",
  appId: "1:1015915959664:web:5580ef9c181c3325fd6bb5"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar la instancia de Firestore
export const db = getFirestore(app);
export const auth = getAuth(app);
