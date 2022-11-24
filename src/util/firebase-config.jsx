// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { createContext, useState } from "react";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBsTfayW3KRO7JBgtfnNsomg2dtfxDakOg",
  authDomain: "chat-app-792d2.firebaseapp.com",
  databaseURL: "https://chat-app-792d2-default-rtdb.firebaseio.com",
  projectId: "chat-app-792d2",
  storageBucket: "chat-app-792d2.appspot.com",
  messagingSenderId: "476456255189",
  appId: "1:476456255189:web:d75c453a6f9bd0ed14ac5c",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export const AuthContext = createContext({ currentUser: null });

export const AuthContextProvider = (props) => {
  const [currentUser, setCurrentUser] = useState(auth.currentUser);

  onAuthStateChanged(auth, (currentUser) => {
    setCurrentUser(currentUser);
  });

  const contextValue = { currentUser: currentUser };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};
