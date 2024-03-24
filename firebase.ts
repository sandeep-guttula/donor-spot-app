// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBY8F3n6vRbBvDcy9LeHkEp7J-8kBzLYlY",
  authDomain: "donor-spot-b3922.firebaseapp.com",
  projectId: "donor-spot-b3922",
  storageBucket: "donor-spot-b3922.appspot.com",
  messagingSenderId: "672601575967",
  appId: "1:672601575967:web:2e5c84ce9ccd4191e7fb2a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export { auth,app };