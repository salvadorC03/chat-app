import ChatItem from "../components/UI/ChatItem";
import Modal from "../components/UI/Modal";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import { collection, query, where } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { auth, db } from "../util/firebase-config";
import { useNavigate } from "react-router-dom";
import { useLoading } from "../hooks/useLoading";
import "./HomePage.css";

function HomePage() {
  const navigate = useNavigate();
  const chatsRef = collection(db, "chats");
  const chatsQuery = query(chatsRef, where("isPublic", "==", true));
  const [chats, loading] = useCollectionData(chatsQuery);
  const { message, setMessage } = useLoading();

  return (
    <main>
      <h2>Página principal</h2>
      <h5 className="group-text">Unirse a un chat:</h5>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <ul>
          {chats?.map((chat) => (
            <ChatItem
              isOwner={false}
              key={chat.id}
              chat={chat}
              onJoin={() => {
                if (!auth.currentUser) {
                  setMessage(
                    <Modal header="Error">
                      <h3>No has iniciado sesión.</h3>
                      <div className="group">
                        <p>
                          Para poder unirte a un chat primero debes iniciar sesión.
                        </p>
                      </div>
                      <button
                        onClick={() => setMessage(null)}
                        className="btn btn-primary group"
                      >
                        Aceptar
                      </button>
                    </Modal>
                  );
                  return;
                }
                navigate("/chat/" + chat.id);
              }}
            />
          ))}
        </ul>
      )}
      {!loading && chats?.length === 0 && (
        <p className="group-text">No se han encontrado chats.</p>
      )}
      {message && <div>{message}</div>}
    </main>
  );
}

export default HomePage;
