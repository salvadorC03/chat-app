import NewChatForm from "../components/UserPage/NewChatForm.jsx";
import Modal from "../components/UI/Modal.jsx";
import ErrorAlert from "../components/UI/ErrorAlert.jsx";
import Card from "../components/UI/Card.jsx";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../util/firebase-config.jsx";
import { useNavigate } from "react-router-dom";
import { useLoading } from "../hooks/useLoading.js";

const NewChatPage = () => {
  const navigate = useNavigate();
  const loadingState = useLoading();

  const createNewChatHandler = async (
    name,
    isPublic,
    hasPassword,
    password
  ) => {
    loadingState.setIsLoading(true);
    try {
      const collectionRef = collection(db, "chats");
      const data = await addDoc(collectionRef, {
        owner: auth.currentUser.uid,
        name: name,
        isPublic,
        hasPassword,
        password: password,
      });
      await updateDoc(doc(db, "chats", data.id), { id: data.id });
      loadingState.setMessage(
        <Modal header="Mensaje">
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
        </Modal>
      );
    } catch (error) {
      loadingState.setMessage(<ErrorAlert message={error.message} />);
    }
    loadingState.setIsLoading(false);
  };

  return (
    <NewChatForm
      isLoading={loadingState.isLoading}
      message={loadingState.message}
      onSubmit={createNewChatHandler}
    />
  );
};

export default NewChatPage;
