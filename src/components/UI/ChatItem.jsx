import "./ChatItem.css";

const ChatItem = ({ chat, isOwner, onJoin, onDelete, isDeletable }) => {
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
      <div className="toast-body chat-item-body">
        <table className="table table-hover">
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Nombre</th>
              <th scope="col">Contraseña</th>
              {isOwner && <th scope="col">Visibilidad</th>}
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
              {isOwner && (
                <td>
                  {chat.isPublic
                    ? "Este chat es público"
                    : "Este chat es privado"}
                </td>
              )}
              <td>
                <button
                  className="btn btn-dark"
                  onClick={onJoin}
                >
                  Unirse al chat
                </button>
              </td>
              {isDeletable && (
                <td>
                  <button
                    className="btn btn-dark"
                    onClick={onDelete}
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
