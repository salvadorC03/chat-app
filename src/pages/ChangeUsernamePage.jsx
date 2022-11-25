import ChangeUsernameForm from "../components/ChangeUsernameForm";
import SuccessAlert from "./SuccessAlert";
import ErrorAlert from "./ErrorAlert";
import { auth } from "../util/firebase-config";
import { useEffect } from "react";
import { changeUsername } from "../util/api";
import { useLoading } from "../hooks/useLoading";
import { useErrorMessage } from "../util/getErrorMessage";

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

    const changeUsernameHandler = (newUsername, currentPassword) => {
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
        <ChangeUsernameForm isLoading={loadingState.isLoading} message={loadingState.message} onSubmit={changeUsernameHandler} />
    );
};

export default ChangeUsernamePage;
