import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAjYUsAsp_EnOBzHMhnBbbVsuG_txUxfiY",
  authDomain: "ud-smp-checkinrealtime.firebaseapp.com",
  projectId: "ud-smp-checkinrealtime",
  storageBucket: "ud-smp-checkinrealtime.appspot.com",
  messagingSenderId: "563904695185",
  appId: "1:563904695185:web:20e859921ddcf0a4b26830",
  measurementId: "G-4SRS10M4BD"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = initializeFirestore(app, { experimentalForceLongPolling: true });

// Initialize Cloud Storage and get a reference to the service
const storage = getStorage(app);

export { db, auth, storage };
