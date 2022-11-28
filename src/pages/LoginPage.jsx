import LoginForm from "../components/Login/LoginForm";
import ErrorAlert from "../components/UI/ErrorAlert";
import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useLoading } from "../hooks/useLoading";
import { auth, AuthContext, storage } from "../util/firebase-config";
import {
  createUserWithEmailAndPassword,
  signInAnonymously,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { createUsername, existingUsername } from "../util/api";
import { useContext } from "react";
import { getDownloadURL, ref } from "firebase/storage";
import { useErrorMessage } from "../hooks/useErrorMessage";
import "./LoginPage.css";
import Card from "../components/UI/Card";
import ResetPasswordForm from "../components/Login/ResetPasswordForm";

const LoginPage = () => {
  const authCtx = useContext(AuthContext);
  const getErrorMessage = useErrorMessage();
  const loadingState = useLoading();
  const [resetPassword, setResetPassword] = useState(false);

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

  if (authCtx.currentUser) return <Navigate to="/user" />;

  const signInAnonymouslyHandler = async () => {
    loadingState.setIsLoading(true);

    try {
      await signInAnonymously(auth);
      const imageRef = ref(storage, "images/profile/default.png");
      const url = await getDownloadURL(imageRef);
      await updateProfile(auth.currentUser, { photoURL: url });
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

  const loginFormHandler = async (props) => {
    loadingState.setIsLoading(true);
    loadingState.setMessage(null);
    try {
      const { email, password, isRegistering, username } = props;

      if (!isRegistering) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const usernameExists = await existingUsername(username);
        if (usernameExists) {
          throw new Error("USERNAME_EXISTS");
        }

        await createUserWithEmailAndPassword(auth, email, password);
        await createUsername(email, password, username);

        const imageRef = ref(storage, "images/profile/default.png");

        const url = await getDownloadURL(imageRef);

        await updateProfile(auth.currentUser, { photoURL: url });
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
    <Card header="Inicio" classes="text-white bg-primary mb-3 loginCard">
      {!resetPassword ? (
        <>
          <LoginForm
            isLoading={loadingState.isLoading}
            message={loadingState.message}
            onSubmit={loginFormHandler}
          />
          {!loadingState.isLoading && (
            <div className="group">
              <Link
                onClick={() => setResetPassword(true)}
                className="extra-actions"
              >
                ¿Olvidó su contraseña?
              </Link>
              <Link
                className="extra-actions"
                onClick={signInAnonymouslyHandler}
              >
                Ingresar como invitado
              </Link>
            </div>
          )}
        </>
      ) : (
        <ResetPasswordForm onCancel={() => setResetPassword(false)} />
      )}
    </Card>
  );
};

export default LoginPage;
