import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyCP2EwTTR7V8VIAfFWPMqOjkFkFS5-mOnM',
  authDomain: 'an-ura.firebaseapp.com',
  projectId: 'an-ura',
  storageBucket: 'an-ura.firebasestorage.app',
  messagingSenderId: '244968902652',
  appId: '1:244968902652:web:05d04c7996e937728eac79',
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export default app;
