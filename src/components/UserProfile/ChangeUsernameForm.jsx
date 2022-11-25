import Input from "./Input";
import LoadingSpinner from "./LoadingSpinner";
import { useInput } from "../hooks/useInput";

const ChangeUsernameForm = (props) => {
  const newUsername = useInput((username) => username.trim().length === 0);
  const currentPassword = useInput((password) => password.trim().length === 0);

  const formIsValid = newUsername.isValid && password.isValid;

  const submitHandler = async (event) => {
    event.preventDefault();

    if (!formIsValid) {
      return;
    }

    props.onSubmit(newUsername.value, currentPassword.value);
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
          className: "form-control " + currentPassword.inputClasses,
          type: "text",
          value: currentPassword.value,
          onChange: currentPassword.changeHandler,
        }}
      />
      {currentPassword.hasError && <p>Debes llenar este campo</p>}
      {props.message && <div>{props.message}</div>}
      {props.isLoading ? (
        <LoadingSpinner />
      ) : (
        <button disabled={!formIsValid} className="btn btn-primary group">
          Cambiar nombre de usuario
        </button>
      )}
    </form>
  );
};

export default ChangeUsernameForm;
