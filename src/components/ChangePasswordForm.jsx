import Input from "./Input";
import LoadingSpinner from "./LoadingSpinner";
import { useInput } from "../hooks/useInput";

const ChangePasswordForm = (props) => {
  const currentPassword = useInput((password) => password.trim().length === 0);
  const newPassword = useInput((password) => password.trim().length === 0);
  const confirmPassword = useInput((password) => password.trim().length === 0);

  const formIsValid =
    newPassword.isValid && confirmPassword.isValid && currentPassword.isValid;

  const submitHandler = (event) => {
    event.preventDefault();

    if (!formIsValid) {
      return;
    }

    props.onSubmit(
      newPassword.value,
      confirmPassword.value,
      currentPassword.value
    );
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
      {props.message && <div>{props.message}</div>}
      {props.isLoading ? (
        <LoadingSpinner />
      ) : (
        <button disabled={!formIsValid} className="btn btn-primary group">
          Cambiar contraseña
        </button>
      )}
    </form>
  );
};

export default ChangePasswordForm;
