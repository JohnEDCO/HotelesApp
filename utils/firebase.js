import firebase from 'firebase/app'
import 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyCA0nvmZZR7Y8kBr-2T2KaOKzKRnkWUaQI",
    authDomain: "hotelesbd.firebaseapp.com",
    projectId: "hotelesbd",
    storageBucket: "hotelesbd.appspot.com",
    messagingSenderId: "832486843081",
    appId: "1:832486843081:web:bfc89a109894e01dcb2318"
  };
  // Initialize Firebase
  export const firebaseApp = firebase.initializeApp(firebaseConfig);