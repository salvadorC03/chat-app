import Input from "../UI/Input";
import { useNavigate } from "react-router-dom";
import { useInput } from "../../hooks/useInput";
import "./ChatPasswordForm.css"

const ChatPasswordForm = (props) => {
  const navigate = useNavigate();
  const password = useInput((password) => password.trim().length === 0);

  const submitPasswordHandler = (event) => {
    event.preventDefault();

    if (!password.isValid) {
      return;
    }

    props.onSubmit(password.value);
  };

  return (
    <div className="adj-left">
      <Input
        fieldsetClass="password-input group"
        id="password"
        label="Introducir contraseña:"
        attributes={{
          className: "form-control " + password.inputClasses,
          type: "text",
          value: password.value,
          onChange: password.changeHandler,
        }}
      />
      {password.hasError && <p>Debes llenar este campo.</p>}
      {props.message && <div className="password-alert">{props.message}</div>}
      <div>
        <button
        onClick={submitPasswordHandler}
        className="btn btn-primary group-right group"
        disabled={!password.isValid}
      >
        Aceptar
      </button>
      <button
        className="btn btn-primary group"
        onClick={() => {
          navigate("/home");
        }}
      >
        Regresar
      </button>
      </div>
    </div>
  );
};

export default ChatPasswordForm;
