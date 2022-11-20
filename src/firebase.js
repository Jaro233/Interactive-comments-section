import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
    apiKey: "AIzaSyCL5KVRUrUEFW5RugnmY2-I3m-ahCsrfns",
    authDomain: "interactive-comment-sect-d6616.firebaseapp.com",
    projectId: "interactive-comment-sect-d6616",
    storageBucket: "interactive-comment-sect-d6616.appspot.com",
    messagingSenderId: "692741193604",
    appId: "1:692741193604:web:14a72f3ee4a8002183a7d1",
    measurementId: "G-QKL0JE6CVT"
  };

  const app = initializeApp(firebaseConfig)
  const db = getFirestore(app)
  
  export {db}