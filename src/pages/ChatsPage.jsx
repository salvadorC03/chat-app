import LoadingSpinner from "../components/UI/LoadingSpinner";
import ChatItem from "../components/UI/ChatItem";
import ErrorAlert from "../components/UI/ErrorAlert";
import Modal from "../components/UI/Modal";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { auth, db } from "../util/firebase-config";
import { deleteDoc, doc } from "firebase/firestore";
import { useLoading } from "../hooks/useLoading";
import { useErrorMessage } from "../hooks/useErrorMessage";
import "./ChatsPage.css";
import { useEffect, useState } from "react";
import { findUser } from "../util/api";

const ChatsPage = () => {
  const getErrorMessage = useErrorMessage();
  const loadingState = useLoading();
  const [hasError, setHasError] = useState();
  const navigate = useNavigate();
  const chatsRef = collection(db, "chats");
  const chatsQuery = query(
    chatsRef,
    where("owner", "==", auth.currentUser.uid)
  );
  const [chats, loading, error] = useCollectionData(chatsQuery);
  const [user, setUser] = useState();
  const savedChatsRef = collection(db, `users/${user?.id}/savedChats`);
  const [savedChats, loadingSavedChats] = useCollectionData(savedChatsRef);

  useEffect(() => {
    const fetchUser = async () => {
      loadingState.setIsLoading(true);
      try {
        const user = await findUser(auth.currentUser.email);
        setUser(user);
      } catch (error) {
        setHasError(true);
        loadingState.setMessage(
          <ErrorAlert
            message={getErrorMessage(error.message)}
            onClose={() => loadingState.setMessage(null)}
          />
        );
      }
      loadingState.setIsLoading(false);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (!hasError) {
      return;
    }

    const timeout = setTimeout(() => {
      loadingState.setMessage(null);
      setHasError(false);
    }, 3000);

    return () => clearTimeout(timeout);
  }, [hasError]);

  const deleteChatHandler = async (chatId) => {
    loadingState.setMessage(
      <Modal header="Mensaje">
        <LoadingSpinner />
      </Modal>
    );
    try {
      await deleteDoc(doc(db, "chats", chatId));
      loadingState.setMessage(null);
    } catch (error) {
      setHasError(true);
      loadingState.setMessage(
        <ErrorAlert
          message={getErrorMessage(error.message)}
          onClose={() => loadingState.setMessage(null)}
        />
      );
    }
  };

  const deleteSavedChatHandler = async (chatId) => {
    loadingState.setMessage(
      <Modal header="Mensaje">
        <LoadingSpinner />
      </Modal>
    );
    try {
      const data = await getDocs(savedChatsRef);
      const chatDocs = data.docs.map((doc) => ({
        ...doc.data(),
        docId: doc.id,
      }));
      const chat = chatDocs.filter((chat) => chat.id === chatId);
      await deleteDoc(doc(db, `users/${user?.id}/savedChats`, chat[0].docId));
      loadingState.setMessage(null);
    } catch (error) {
      setHasError(true);
      loadingState.setMessage(
        <ErrorAlert
          message={getErrorMessage(error.message)}
          onClose={() => loadingState.setMessage(null)}
        />
      );
    }
  };

  return (
    <div>
      <h4>Aquí se muestran los chats.</h4>
      {loading && <LoadingSpinner />}
      {!loadingSavedChats && (
        <details className="group">
          <summary>Chats guardados</summary>
          {savedChats.length === 0 && (
            <p className="no-chats-found-text">No hay chats guardados.</p>
          )}
          {savedChats.length > 0 && (
            <ul className="saved-chats-list">
              {savedChats?.map((chat) => (
                <div key={chat.id} className="small-chat-item">
                  <ChatItem
                    chat={chat}
                    isDeletable={true}
                    onJoin={() => {
                      navigate("/chat/" + chat.id);
                    }}
                    onDelete={() => {
                      loadingState.setMessage(
                        <Modal header="Mensaje">
                          <h3>Borrar chat</h3>
                          <p>¿Estás seguro que deseas borrar este chat?</p>
                          <button
                            className="btn btn-primary"
                            onClick={deleteSavedChatHandler.bind(null, chat.id)}
                          >
                            Aceptar
                          </button>
                          <button
                            className="btn btn-primary group-button"
                            onClick={() => loadingState.setMessage(null)}
                          >
                            Cancelar
                          </button>
                        </Modal>
                      );
                    }}
                  />
                </div>
              ))}
            </ul>
          )}
        </details>
      )}
      {!loading && error && <ErrorAlert message="Error al cargar los chats." />}
      {!loading && !error && chats?.length === 0 && (
        <p className="group">No hay chats disponibles.</p>
      )}
      {!loading && chats?.length > 0 && (
        <ul>
          {chats?.map((chat) => (
            <ChatItem
              isOwner={true}
              key={chat.id}
              chat={chat}
              isDeletable={true}
              onJoin={() => {
                navigate("/chat/" + chat.id);
              }}
              onDelete={() => {
                loadingState.setMessage(
                  <Modal header="Mensaje">
                    <h3>Borrar chat</h3>
                    <p>¿Estás seguro que deseas borrar este chat?</p>
                    <button
                      className="btn btn-primary"
                      onClick={deleteChatHandler.bind(null, chat.id)}
                    >
                      Aceptar
                    </button>
                    <button
                      className="btn btn-primary group-button"
                      onClick={() => loadingState.setMessage(null)}
                    >
                      Cancelar
                    </button>
                  </Modal>
                );
              }}
            />
          ))}
        </ul>
      )}
      {loadingState.message && <div>{loadingState.message}</div>}
    </div>
  );
};

export default ChatsPage;
