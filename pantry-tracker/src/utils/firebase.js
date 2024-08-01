import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDOu-4Uv6NBDKpeIMlh6KZ03FQ1gcBnUm4",
  authDomain: "wowpantry.firebaseapp.com",
  projectId: "wowpantry",
  storageBucket: "wowpantry.appspot.com",
  messagingSenderId: "223141110008",
  appId: "1:223141110008:web:b9498fda0a7fd715ed9b0d",
  measurementId: "G-Q6BXLWLZ88"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };