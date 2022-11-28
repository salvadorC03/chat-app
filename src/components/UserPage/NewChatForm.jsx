import LoadingSpinner from "../UI/LoadingSpinner.jsx";
import Input from "../../components/UI/Input.jsx";
import { useState } from "react";
import { useInput } from "../../hooks/useInput.js";

const NewChatForm = (props) => {
  const name = useInput((name) => name.trim().length === 0);
  const password = useInput((password) => password.trim().length < 6);
  const [isPublic, setIsPublic] = useState(false);
  const [hasPassword, setHasPassword] = useState(false);

  let formIsValid;

  if (hasPassword) {
    formIsValid = name.isValid && password.isValid;
  } else {
    formIsValid = name.isValid;
  }

  const submitHandler = (event) => {
    event.preventDefault();

    if (!formIsValid) {
      return;
    }

    props.onSubmit(name.value, isPublic, hasPassword, password.value);
  };

  return (
    <form onSubmit={submitHandler}>
      <Input
        fieldsetClass="col-sm-4"
        id="name"
        label="Nombre del chat"
        attributes={{
          className: "form-control " + name.inputClasses,
          type: "text",
          value: name.value,
          onChange: name.changeHandler,
        }}
      />
      {name.hasError && <p>Introduce un nombre de chat válido</p>}
      <div class="form-check form-switch group">
        <Input
          fieldsetClass="col-sm-4"
          id="isPublic"
          label="¿Hacer público este chat?"
          attributes={{
            className: "form-check-input",
            type: "checkbox",
            onChange: () => {
              setIsPublic((prevState) => !prevState);
            },
          }}
        />
      </div>
      <div class="form-check form-switch">
        <Input
          fieldsetClass="col-sm-4"
          id="hasPassword"
          label="¿Usar contraseña para unirse al chat?"
          attributes={{
            className: "form-check-input",
            type: "checkbox",
            onChange: () => {
              setHasPassword((prevState) => !prevState);
            },
          }}
        />
      </div>
      {hasPassword && (
        <>
          <Input
            fieldsetClass="col-sm-4"
            id="password"
            label="Introducir contraseña:"
            attributes={{
              className: "form-control " + password.inputClasses,
              type: "text",
              value: password.value,
              onChange: password.changeHandler,
            }}
          />
          {password.hasError && (
            <p>Introduce una contraseña válida (mayor a 6 caracteres)</p>
          )}
        </>
      )}
      {props.isLoading ? (
        <LoadingSpinner />
      ) : (
        <button disabled={!formIsValid} className="btn btn-primary group">
          Crear nuevo chat
        </button>
      )}
      {props.message && <div>{props.message}</div>}
    </form>
  );
};

export default NewChatForm;
