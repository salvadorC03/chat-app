import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { Fragment, useState } from "react";
import Input from "../components/Input.jsx";
import { useInput } from "../hooks/useInput.js";
import { findUser } from "../util/api.js";
import { auth, db } from "../util/firebase-config.jsx";
import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal.jsx";
import { useLoading } from "../hooks/useLoading.jsx";
import ErrorAlert from "../components/ErrorAlert.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import Card from "../components/Card.jsx";

const NewChatPage = () => {
  const navigate = useNavigate();
  const name = useInput((name) => name.trim().length === 0);
  const password = useInput((password) => password.trim().length < 6);
  const [isPublic, setIsPublic] = useState(false);
  const [hasPassword, setHasPassword] = useState(false);
  const loadingState = useLoading();

  let formIsValid;

  if (hasPassword) {
    formIsValid = name.isValid && password.isValid;
  } else {
    formIsValid = name.isValid;
  }

  const submitHandler = async (event) => {
    event.preventDefault();

    loadingState.setIsLoading(true);
    try {
      const user = await findUser(auth.currentUser.email);
      const collectionRef = collection(db, "chats");
      const data = await addDoc(collectionRef, {
        owner: user.email,
        name: name.value,
        isPublic,
        hasPassword,
        password: password.value,
      });
      await updateDoc(doc(db, "chats", data.id), { id: data.id });
      loadingState.setMessage(
        <Modal>
          <Card
            header="Inicio"
            attributes={{
              className: "card border-secondary mb-3 ",
            }}
            headerAttributes={{ className: "card-header" }}
            bodyAttributes={{ className: "card-body" }}
          >
            <h3>Chat creado exitosamente</h3>
            <button
              className="btn btn-primary group"
              onClick={() => {
                loadingState.setMessage(null);
                navigate("/chat/" + data.id);
              }}
            >
              Aceptar
            </button>
          </Card>
        </Modal>
      );
    } catch (error) {
      loadingState.setMessage(<ErrorAlert message={error.message} />);
    }
    loadingState.setIsLoading(false);
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
        <Fragment>
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
        </Fragment>
      )}
      {loadingState.isLoading ? (
        <LoadingSpinner />
      ) : (
        <button disabled={!formIsValid} className="btn btn-primary group">
          Crear nuevo chat
        </button>
      )}
      {loadingState.message && <div>{loadingState.message}</div>}
    </form>
  );
};

export default NewChatPage;
