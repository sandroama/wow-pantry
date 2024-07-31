import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth, connectAuthEmulator } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyDOu-4Uv6NBDKpeIMlh6KZ03FQ1gcBnUm4",
    authDomain: "wowpantry.firebaseapp.com",
    projectId: "wowpantry",
    storageBucket: "wowpantry.appspot.com",
    messagingSenderId: "223141110008",
    appId: "1:223141110008:web:b9498fda0a7fd715ed9b0d",
    measurementId: "G-Q6BXLWLZ88"
  };

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);
const auth = getAuth(app);

if (process.env.NODE_ENV === 'development') {
  connectFirestoreEmulator(db, 'localhost', 8080);
  connectAuthEmulator(auth, 'http://localhost:9099');
}

export { db, auth };