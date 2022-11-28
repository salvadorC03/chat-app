import { deleteDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../../util/firebase-config";
import "./ChatItem.css";

const ChatItem = ({ chat, isOwner }) => {
  const navigate = useNavigate();

  return (
    <li
      className="toast show"
      id="chat-item"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div className="toast-header">
        <strong className="me-auto">Chat</strong>
      </div>
      <div class="toast-body chat-item-body">
        <table className="table table-hover">
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Nombre</th>
              <th scope="col">Contraseña</th>
              <th scope="col">Visibilidad</th>
            </tr>
          </thead>
          <tbody>
            <tr className="table-active">
              <th scope="row">{chat.id}</th>
              <td>{chat.name}</td>
              <td>
                {chat.hasPassword
                  ? isOwner
                    ? chat.password
                    : "Este chat tiene contraseña"
                  : "Sin contraseña"}
              </td>
              <td>
                {chat.isPublic
                  ? "Este chat es público"
                  : "Este chat es privado"}
              </td>
              <td>
                <button
                  className="btn btn-dark"
                  onClick={() => {
                    navigate("/chat/" + chat.id);
                  }}
                >
                  Unirse al chat
                </button>
              </td>
              {isOwner && (
                <td>
                  <button
                    className="btn btn-dark"
                    onClick={async () => {
                      await deleteDoc(doc(db, "chats", chat.id));
                    }}
                  >
                    Borrar chat
                  </button>
                </td>
              )}
            </tr>
          </tbody>
        </table>
      </div>
    </li>
  );
};

export default ChatItem;
