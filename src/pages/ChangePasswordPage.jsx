import ChangePasswordForm from "../components/UserPage/ChangePasswordForm";
import ErrorAlert from "../components/UI/ErrorAlert";
import SuccessAlert from "../components/UI/SuccessAlert";
import { useEffect } from "react";
import { useLoading } from "../hooks/useLoading";
import { auth } from "../util/firebase-config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { changePassword } from "../util/api";
import { useErrorMessage } from "../hooks/useErrorMessage";

const ChangePasswordPage = () => {
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

  const changePasswordHandler = async (
    newPassword,
    confirmPassword,
    currentPassword,
    reset
  ) => {
    loadingState.setMessage(null);
    loadingState.setIsLoading(true);

    try {
      if (newPassword !== confirmPassword) {
        loadingState.setMessage(
          <ErrorAlert
            onClose={() => loadingState.setMessage(null)}
            message="Las contraseñas deben coincidir."
          />
        );
        loadingState.setIsLoading(false);
        return;
      }

      await signInWithEmailAndPassword(
        auth,
        auth.currentUser.email,
        currentPassword
      );
      await changePassword(auth.currentUser, newPassword, currentPassword);
      loadingState.setMessage(
        <SuccessAlert
          onClose={() => loadingState.setMessage(null)}
          message="Contraseña cambiada exitosamente."
        />
      );
      reset();
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
    <ChangePasswordForm
      isLoading={loadingState.isLoading}
      message={loadingState.message}
      onSubmit={changePasswordHandler}
    />
  );
};

export default ChangePasswordPage;
