import { signInWithEmailAndPassword } from "firebase/auth";
import { useEffect } from "react";
import { useInput } from "../hooks/useInput";
import { useLoading } from "../hooks/useLoading";
import { changePassword } from "../util/api";
import { auth } from "../util/firebase-config";
import { getErrorMessage } from "../util/getErrorMessage";
import ErrorAlert from "./ErrorAlert";
import Input from "./Input";
import LoadingSpinner from "./LoadingSpinner";
import SuccessAlert from "./SuccessAlert";

const ChangePassword = () => {
  const loadingState = useLoading();
  const currentPassword = useInput((password) => password.trim().length === 0);
  const newPassword = useInput((password) => password.trim().length === 0);
  const confirmPassword = useInput((password) => password.trim().length === 0);

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

  const formIsValid =
    newPassword.isValid && confirmPassword.isValid && currentPassword.isValid;

  const submitHandler = async (event) => {
    event.preventDefault();

    loadingState.setMessage(null);
    loadingState.setIsLoading(true);
    try {
      if (newPassword.value !== confirmPassword.value) {
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
        currentPassword.value
      );
      await changePassword(
        auth.currentUser,
        newPassword.value,
        currentPassword.value
      );
      loadingState.setMessage(
        <SuccessAlert
          onClose={() => loadingState.setMessage(null)}
          message="Contraseña cambiada exitosamente."
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
        id="newpassword"
        label="Nueva contraseña:"
        attributes={{
          className: "form-control " + newPassword.inputClasses,
          type: "text",
          value: newPassword.value,
          onChange: newPassword.changeHandler,
        }}
      />
      {newPassword.hasError && <p>Debes llenar este campo</p>}
      <Input
        fieldsetClass="col-sm-4"
        id="confirmpassword"
        label="Confirmar contraseña:"
        attributes={{
          className: "form-control " + confirmPassword.inputClasses,
          type: "text",
          value: confirmPassword.value,
          onChange: confirmPassword.changeHandler,
        }}
      />
      {confirmPassword.hasError && <p>Debes llenar este campo</p>}
      {loadingState.message && <div>{loadingState.message}</div>}
      {loadingState.isLoading ? (
        <LoadingSpinner />
      ) : (
        <button disabled={!formIsValid} className="btn btn-primary group">
          Cambiar contraseña
        </button>
      )}
    </form>
  );
};

export default ChangePassword;
