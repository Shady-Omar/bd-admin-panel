// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAvvr2s2TpWf4B9hbPnq-aCji681cgRfNA",
  authDomain: "bdnash-clone.firebaseapp.com",
  projectId: "bdnash-clone",
  storageBucket: "bdnash-clone.appspot.com",
  messagingSenderId: "419830674099",
  appId: "1:419830674099:web:f24b398e64b826db35f6c6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const algoliasearch = require("algoliasearch");
// Initialize Cloud Firestore and get a reference to the service
const client = algoliasearch("TN5O68KSD4", "f76ef113b914bcd667803678a532c821");
const algoliaIndex = client.initIndex("companies");
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage, algoliaIndex };