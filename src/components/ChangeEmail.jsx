import { signInWithEmailAndPassword } from "firebase/auth";
import { useEffect } from "react";
import { useInput } from "../hooks/useInput";
import { useLoading } from "../hooks/useLoading";
import { changeEmail } from "../util/api";
import { auth } from "../util/firebase-config";
import { getErrorMessage } from "../util/getErrorMessage";
import ErrorAlert from "./ErrorAlert";
import Input from "./Input";
import LoadingSpinner from "./LoadingSpinner";
import SuccessAlert from "./SuccessAlert";

const ChangeEmail = () => {
  const loadingState = useLoading();
  const currentPassword = useInput((password) => password.trim().length === 0);
  const newEmail = useInput((email) => email.trim().length === 0);

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

  const formIsValid = currentPassword.isValid && newEmail.isValid;

  const submitHandler = async (event) => {
    event.preventDefault();

    loadingState.setMessage(null);
    loadingState.setIsLoading(true);
    try {
      await signInWithEmailAndPassword(
        auth,
        auth.currentUser.email,
        currentPassword.value
      );
      await changeEmail(
        auth.currentUser,
        newEmail.value,
        currentPassword.value
      );
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
    <form onSubmit={submitHandler}>
      <Input
        fieldsetClass="col-sm-4"
        id="currentpassword"
        label="Introduce tu contraseña actual:"
        attributes={{
          className: "form-control " + currentPassword.inputClasses,
          type: "text",
          value: currentPassword.value,
          onChange: currentPassword.changeHandler,
        }}
      />
      {currentPassword.hasError && <p>Debes llenar este campo</p>}
      <Input
        fieldsetClass="col-sm-4"
        id="newemail"
        label="Nuevo correo electrónico:"
        attributes={{
          className: "form-control " + newEmail.inputClasses,
          type: "text",
          value: newEmail.value,
          onChange: newEmail.changeHandler,
        }}
      />
      {newEmail.hasError && <p>Debes llenar este campo</p>}
      {loadingState.message && <div>{loadingState.message}</div>}
      {loadingState.isLoading ? (
        <LoadingSpinner />
      ) : (
        <button disabled={!formIsValid} className="btn btn-primary group">
          Cambiar correo electrónico
        </button>
      )}
    </form>
  );
};

export default ChangeEmail;
