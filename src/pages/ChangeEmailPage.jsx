import ChangeEmailForm from "../components/ChangeEmailForm";
import SuccessAlert from "../components/SuccessAlert";
import ErrorAlert from "../components/ErrorAlert";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../util/firebase-config";
import { useErrorMessage } from "../hooks/useErrorMessage";
import { useLoading } from "../hooks/useLoading";
import { changeEmail } from "../util/api";
import { useEffect } from "react";

const ChangeEmailPage = () => {
  const loadingState = useLoading();
  const getErrorMessage = useErrorMessage();

  useEffect(() => {
    if (!loadingState.message) {
      return;
    }

    const timeout = setTimeout(() => {
      loadingState.setMessage(null);
    }, [3000]);

    return () => {
      clearTimeout(timeout);
    };
  }, [loadingState.message]);

  const changeEmailHandler = async (newEmail, currentPassword) => {
    loadingState.setMessage(null);
    loadingState.setIsLoading(true);
    try {
      await signInWithEmailAndPassword(
        auth,
        auth.currentUser.email,
        currentPassword
      );
      await changeEmail(auth.currentUser, newEmail, currentPassword);
      loadingState.setMessage(
        <SuccessAlert
          onClose={() => loadingState.setMessage(null)}
          message="Correo electrónico cambiado exitosamente."
        />
      );
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
    <ChangeEmailForm
      isLoading={loadingState.isLoading}
      message={loadingState.message}
      onSubmit={changeEmailHandler}
    />
  );
};

export default ChangeEmailPage;
