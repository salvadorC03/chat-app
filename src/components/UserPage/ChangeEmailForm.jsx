import Input from "../UI/Input";
import LoadingSpinner from "../UI/LoadingSpinner";
import { useInput } from "../../hooks/useInput";
import { useNavigate } from "react-router-dom";

const ChangeEmailForm = (props) => {
  const navigate = useNavigate();
  const currentPassword = useInput((password) => password.trim().length === 0);
  const newEmail = useInput((email) => email.trim().length === 0);

  const formIsValid = currentPassword.isValid && newEmail.isValid;

  const reset = () => {
    currentPassword.reset();
    newEmail.reset();
  };

  const submitHandler = (event) => {
    event.preventDefault();

    if (!formIsValid) {
      return;
    }

    props.onSubmit(newEmail.value, currentPassword.value, reset);
  };

  return (
    <>
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
        {props.message && <div>{props.message}</div>}
        {props.isLoading ? (
          <LoadingSpinner />
        ) : (
          <button disabled={!formIsValid} className="btn btn-primary group">
            Cambiar correo electrónico
          </button>
        )}
      </form>
      <button
        className="btn btn-primary group"
        onClick={() => {
          navigate("/user/profile");
        }}
      >
        Regresar
      </button>
    </>
  );
};

export default ChangeEmailForm;
