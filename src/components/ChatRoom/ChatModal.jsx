import Modal from "../UI/Modal";
import Card from "../UI/Card";
import { useNavigate } from "react-router-dom";
import "./ChatModal.css";
import { auth } from "../../util/firebase-config";

const ChatModal = ({ chat, onClose }) => {
  const navigate = useNavigate();

  return (
    <Modal header="Menú" onClose={onClose}>
      <h2>
        <i>{chat.name}</i>
      </h2>
      <div className="modal-info">
        <span>
          <b>ID:</b> {chat.id}
        </span>
        {chat.owner == auth.currentUser.uid && (
          <span>
            <b><i>Eres dueño/a de este chat.</i></b>
          </span>
        )}
      </div>
      <div className="group-actions">
        <button
          className="btn btn-primary"
          onClick={() => {
            navigate("/user/profile");
          }}
        >
          Salir del chat
        </button>
        <button className="btn btn-primary group-button" onClick={onClose}>
          Cerrar menú
        </button>
      </div>
    </Modal>
  );
};

export default ChatModal;
