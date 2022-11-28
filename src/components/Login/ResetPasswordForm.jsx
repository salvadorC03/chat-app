import ErrorAlert from "../UI/ErrorAlert";
import SuccessAlert from "../UI/SuccessAlert";
import Input from "../UI/Input";
import LoadingSpinner from "../UI/LoadingSpinner";
import { useEffect } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { useErrorMessage } from "../../hooks/useErrorMessage";
import { useInput } from "../../hooks/useInput";
import { useLoading } from "../../hooks/useLoading";
import { auth } from "../../util/firebase-config";
import "./LoginForm.css";

const ResetPasswordForm = (props) => {
  const email = useInput((email) => email.trim().length === 0);
  const loadingState = useLoading();
  const getErrorMessage = useErrorMessage();
  useEffect(() => {
    if (!loadingState.message) {
      return;
    }

    const timeout = setTimeout(() => loadingState.setMessage(null), 6000);
    return () => clearTimeout(timeout);
  }, [loadingState.message]);

  const sendResetPasswordEmailHandler = async () => {
    if (!email.isValid) {
      return;
    }

    loadingState.setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, email.value);
      loadingState.setMessage(
        <SuccessAlert
          message="Se envió un correo de recuperación a la dirección proporcionada.
          Revisa tu bandeja de mensajes y, en caso de no encontrarlo, revisa la
          carpeta de spam/correos no deseados."
          onClose={() => loadingState.setMessage(null)}
        />
      );
    } catch (error) {
      loadingState.setMessage(
        <ErrorAlert
          message={getErrorMessage(error.message)}
          onClose={() => loadingState.setMessage(null)}
        />
      );
    }
    loadingState.setIsLoading(false);
  };

  return (
    <>
      <h3 className="card-title">Recuperar contraseña:</h3>
      <Input
        fieldsetClass="input group"
        id="email"
        label="Introduce tu correo electrónico:"
        attributes={{
          className: "form-control " + email.inputClasses,
          type: "text",
          value: email.value,
          onChange: email.changeHandler,
        }}
      />
      {email.hasError && <p>Debes llenar este campo</p>}
      {loadingState.message && <div>{loadingState.message}</div>}
      {loadingState.isLoading ? (
        <div className="centered">
          <LoadingSpinner />
        </div>
      ) : (
        <>
          <button
            disabled={!email.isValid}
            onClick={sendResetPasswordEmailHandler}
            className="btn button btn-lg btn-success submit"
          >
            Aceptar
          </button>
          <button
            onClick={props.onCancel}
            className="btn button btn-secondary group"
          >
            Regresar
          </button>
        </>
      )}
    </>
  );
};

export default ResetPasswordForm;
