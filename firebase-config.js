// firebase-config.js (module)
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// << REPLACE THESE VALUES with your project's config from Firebase Console >>
const firebaseConfig = {
  apiKey: "AIzaSyBuUyloe8rsk8j_2XvrPdq66O4LDpRpO7w",
  authDomain: "shrug-app-cd8fd.firebaseapp.com",
  projectId: "shrug-app-cd8fd",
  storageBucket: "shrug-app-cd8fd.firebasestorage.app",
  messagingSenderId: "440005731888",
  appId: "1:440005731888:web:d09ec966092390feb42ff5"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
