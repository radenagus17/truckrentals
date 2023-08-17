// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCUiVV_cDgzlG2TmwnuxeFhZQ6PV2VIiOE",
  authDomain: "sewa-truk.firebaseapp.com",
  projectId: "sewa-truk",
  storageBucket: "sewa-truk.appspot.com",
  messagingSenderId: "559913076623",
  appId: "1:559913076623:web:1372bb9fe3fc5d44ccedfa",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
