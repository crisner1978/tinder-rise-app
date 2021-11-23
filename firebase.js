import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyC8vlOFTaHxEcoPx7xaZI1pWlbdm2KJ4yI",
  authDomain: "tinder-rise-app.firebaseapp.com",
  projectId: "tinder-rise-app",
  storageBucket: "tinder-rise-app.appspot.com",
  messagingSenderId: "870254078129",
  appId: "1:870254078129:web:d8e656c96fee5bef8ada90"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app)

export { auth, db }