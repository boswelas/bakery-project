import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyDVuLdnIBld1wjMQ19mRR_KsvjSzNmvXAs",
    authDomain: "bakery-project-91594.firebaseapp.com",
    projectId: "bakery-project-91594",
    storageBucket: "bakery-project-91594.appspot.com",
    messagingSenderId: "777612975666",
    appId: "1:777612975666:web:69e8885a0b86731a5fe62b",
    measurementId: "G-7JFK0T6KKC"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage(app);

