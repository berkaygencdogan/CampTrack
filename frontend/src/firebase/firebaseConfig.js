import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCBjU1wmQkbsMbfJIu-SspHBvUscdMGNAg",
  authDomain: "camp-track-68495.firebaseapp.com",
  projectId: "camp-track-68495",
  storageBucket: "camp-track-68495.firebasestorage.app",
  messagingSenderId: "227117183372",
  appId: "1:227117183372:web:87999145a8675cbeb9e6a9",
  measurementId: "G-BW5X5WS75F",
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);
export const storage = getStorage(app);
