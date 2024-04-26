// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, query, where, Timestamp } from "firebase/firestore";
import { getStorage, ref, uploadBytesResumable, getDownloadURL, uploadBytes } from "firebase/storage";
import { initializeAuth, getReactNativePersistence, getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyASO_rs87dDhdl4oEOzKB2U6PcvtKuJOao",
  authDomain: "ecg-database-reactnative.firebaseapp.com",
  projectId: "ecg-database-reactnative",
  storageBucket: "ecg-database-reactnative.appspot.com",
  messagingSenderId: "167237085486",
  appId: "1:167237085486:web:de0c70b59c98cbe4ac72bf"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const Auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, auth, db, storage, collection, addDoc, getDocs, doc, updateDoc, query, where, ref, uploadBytesResumable, getDownloadURL, Timestamp, uploadBytes, signInWithEmailAndPassword, createUserWithEmailAndPassword }