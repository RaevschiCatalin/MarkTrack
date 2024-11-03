// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyB4kS2kf73NLBEMqpoIolrrQeVx2d_cXYI",
    authDomain: "marktrack-655e8.firebaseapp.com",
    projectId: "marktrack-655e8",
    storageBucket: "marktrack-655e8.firebasestorage.app",
    messagingSenderId: "224157786132",
    appId: "1:224157786132:web:358348b7dad4a280d28701",
    measurementId: "G-5GD536J2WK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth();