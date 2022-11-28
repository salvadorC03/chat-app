import ChangeUsernameForm from "../components/UserPage/ChangeUsernameForm";
import SuccessAlert from "../components/UI/SuccessAlert";
import ErrorAlert from "../components/UI/ErrorAlert";
import { auth } from "../util/firebase-config";
import { useEffect } from "react";
import { changeUsername } from "../util/api";
import { useLoading } from "../hooks/useLoading";
import { useErrorMessage } from "../hooks/useErrorMessage";

const ChangeUsernamePage = (props) => {
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
  
  const changeUsernameHandler = async (newUsername, currentPassword, reset) => {
    loadingState.setMessage(null);
    loadingState.setIsLoading(true);
    try {
      await changeUsername(
        auth.currentUser.email,
        newUsername,
        currentPassword
      );
      loadingState.setMessage(
        <SuccessAlert
          onClose={() => loadingState.setMessage(null)}
          message="Nombre de usuario cambiado exitosamente."
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
    <ChangeUsernameForm
      isLoading={loadingState.isLoading}
      message={loadingState.message}
      onSubmit={changeUsernameHandler}
    />
  );
};

export default ChangeUsernamePage;
