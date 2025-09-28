
import { initializeApp } from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';


const firebaseConfig = {
  apiKey: "AIzaSyBy7XO-gPSkOl5vm39QxXl8ONMPKbv80Tg",
  authDomain: "todo-c879d.firebaseapp.com",
  projectId: "todo-c879d",
  storageBucket: "todo-c879d.firebasestorage.app",
  messagingSenderId: "841941925371",
  appId: "1:841941925371:web:1ff894c3af1b65244e9f5e",
  measurementId: "G-2GM6KB1BGN"
};

// Initialize Firebase (only once)
const app = initializeApp(firebaseConfig);

export { auth, firestore, storage };
export default app;
