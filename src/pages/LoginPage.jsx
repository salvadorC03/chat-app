import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import { useLoading } from "../hooks/useLoading";
import ErrorAlert from "../components/ErrorAlert";
import { auth, AuthContext, storage } from "../util/firebase-config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { createUsername, existingUsername } from "../util/api";
import { useContext } from "react";
import { getDownloadURL, ref } from "firebase/storage";
import SuccessAlert from "../components/SuccessAlert";
import { getErrorMessage } from "../util/getErrorMessage";

const LoginPage = () => {
  const authCtx = useContext(AuthContext);
  const loadingState = useLoading();

  useEffect(() => {
    if (!loadingState.message) {
      return;
    }

    const timeout = setTimeout(() => {
      loadingState.setMessage(null);
    }, 5000);

    return () => {
      clearTimeout(timeout);
    };
  }, [loadingState.message]);

  if (authCtx.currentUser) {
    return <Navigate to="/user" />;
  }

  const loginFormHandler = async (props) => {
    loadingState.setIsLoading(true);
    loadingState.setMessage(null);
    try {
      let userCredential;
      const { email, password, isRegistering, username } = props;

      if (!isRegistering) {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      } else {
        const usernameExists = await existingUsername(username);
        if (usernameExists) {
          throw new Error("USERNAME_EXISTS");
        }

        userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await createUsername(email, password, username);

        const imageRef = ref(storage, "images/profile/default.png");

        const url = await getDownloadURL(imageRef);

        await updateProfile(auth.currentUser, { photoURL: url });
        
        loadingState.setMessage(
          <SuccessAlert
            onClose={() => loadingState.setMessage(null)}
            message="Usuario registrado exitosamente."
          />
        );
      }
    } catch (error) {
      loadingState.setMessage(
        <ErrorAlert
          onClose={() => loadingState.setMessage(null)}
          message={getErrorMessage(error.message)}
        />
      );
    }
    loadingState.setIsLoading(false);
  };

  return (
    <LoginForm
      isLoading={loadingState.isLoading}
      message={loadingState.message}
      onSubmit={loginFormHandler}
    />
  );
};

export default LoginPage;
