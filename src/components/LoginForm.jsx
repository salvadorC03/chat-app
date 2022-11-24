import { useInput } from "../hooks/useInput";
import { Fragment, useState } from "react";
import Input from "./Input";
import LoadingSpinner from "./LoadingSpinner";
import Card from "./Card";

const LoginForm = (props) => {
  const email = useInput((email) => email.trim().length === 0 || !email.includes("@"));
  const password = useInput((password) => password.trim().length < 6);
  const username = useInput((username) => username.trim().length === 0);

  const [isRegistering, setIsRegistering] = useState(false);

  let formIsValid;

  if (!isRegistering) formIsValid = email.isValid && password.isValid;
  else formIsValid = email.isValid && password.isValid && username.isValid;

  const changeModeHandler = () => {
    setIsRegistering((prevState) => !prevState);
  };

  const submitHandler = (event) => {
    event.preventDefault();
    props.onSubmit({ email: email.value, password: password.value, isRegistering, username: username.value });
  };

  return (
    <Card
      header="Inicio"
      attributes={{
        className: "card text-white bg-primary mb-3",
        style: { maxWidth: "30rem" },
      }}
      headerAttributes={{ className: "card-header" }}
      bodyAttributes={{ className: "card-body" }}
    >
      <h2 className="card-title">
        {!isRegistering ? "Iniciar Sesión:" : "Crear nueva cuenta:"}
      </h2>
      <form onSubmit={submitHandler}>
        <Input
          fieldsetClass="col-sm-10"
          id="email"
          label="Correo Electrónico"
          attributes={{
            className: "form-control " + email.inputClasses,
            type: "text",
            value: email.value,
            onChange: email.changeHandler,
          }}
        />
        {email.hasError && "Por favor introduce una dirección e-mail válida"}
        <Input
          fieldsetClass="col-sm-10"
          id="password"
          label="Contraseña:"
          attributes={{
            className: "form-control " + password.inputClasses,
            type: "password",
            value: password.value,
            onChange: password.changeHandler,
          }}
        />
        {password.hasError && "Por favor introduce una contraseña válida (mínimo 6 caracteres)"}
        {isRegistering && (
          <Fragment>
            <Input
              fieldsetClass="col-sm-10"
              id="username"
              label="Nombre de usuario:"
              attributes={{
                className: "form-control " + username.inputClasses,
                type: "text",
                value: username.value,
                onChange: username.changeHandler,
              }}
            />
            {username.hasError &&
              "Por favor introduce un nombre de usuario válido"}
          </Fragment>
        )}
        {!props.isLoading && props.message && <div>{props.message}</div>}
        {!props.isLoading && (
          <button
            className="btn btn-success btn-lg group col-sm-12"
            style={{ marginTop: "2rem" }}
            type="submit"
            disabled={!formIsValid}
          >
            {!isRegistering ? "Iniciar Sesión" : "Crear nueva cuenta"}
          </button>
        )}
      </form>
      {props.isLoading ? (
        <div className="centered">
          <LoadingSpinner />
        </div>
      ) : (
        <button
          className="btn btn-secondary group col-sm-12"
          onClick={changeModeHandler}
        >
          {!isRegistering
            ? "Registrarse por primera vez"
            : "Usar una cuenta existente"}
        </button>
      )}
    </Card>
  );
};

export default LoginForm;
