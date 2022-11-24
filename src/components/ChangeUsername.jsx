import { useInput } from "../hooks/useInput";
import { changeUsername } from "../util/api";
import Input from "./Input";
import { auth } from "../util/firebase-config";
import { useLoading } from "../hooks/useLoading";
import SuccessAlert from "./SuccessAlert";
import ErrorAlert from "./ErrorAlert";
import { useEffect } from "react";
import LoadingSpinner from "./LoadingSpinner";
import { getErrorMessage } from "../util/getErrorMessage";

const ChangeUsername = () => {
  const loadingState = useLoading();
  const newUsername = useInput((username) => username.trim().length === 0);
  const password = useInput((password) => password.trim().length === 0);

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

  const formIsValid = newUsername.isValid && password.isValid;

  const submitHandler = async (event) => {
    event.preventDefault();

    loadingState.setMessage(null);
    loadingState.setIsLoading(true);
    try {
      await changeUsername(
        auth.currentUser.email,
        newUsername.value,
        password.value
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
    <form onSubmit={submitHandler}>
      <Input
        fieldsetClass="col-sm-4"
        id="newusername"
        label="Nuevo nombre de usuario:"
        attributes={{
          className: "form-control " + newUsername.inputClasses,
          type: "text",
          value: newUsername.value,
          onChange: newUsername.changeHandler,
        }}
      />
      {newUsername.hasError && <p>Debes llenar este campo</p>}
      <Input
        fieldsetClass="col-sm-4"
        id="password"
        label="Introduce tu contraseña:"
        attributes={{
          className: "form-control " + password.inputClasses,
          type: "text",
          value: password.value,
          onChange: password.changeHandler,
        }}
      />
      {password.hasError && <p>Debes llenar este campo</p>}
      {loadingState.message && <div>{loadingState.message}</div>}
      {loadingState.isLoading ? (
        <LoadingSpinner />
      ) : (
        <button disabled={!formIsValid} className="btn btn-primary group">
          Cambiar nombre de usuario
        </button>
      )}
    </form>
  );
};

export default ChangeUsername;
