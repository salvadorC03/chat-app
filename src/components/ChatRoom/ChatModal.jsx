import Modal from "../UI/Modal";
import Avatar from "@mui/material/Avatar";
import LoadingSpinner from "../UI/LoadingSpinner";
import SuccessAlert from "../UI/SuccessAlert";
import ErrorAlert from "../UI/ErrorAlert";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../util/firebase-config";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
} from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useEffect } from "react";
import { useLoading } from "../../hooks/useLoading";
import { useErrorMessage } from "../../hooks/useErrorMessage";
import { findUser } from "../../util/api";
import "./ChatModal.css";

const ChatModal = ({ chat, onClose, addActiveUser }) => {
  const navigate = useNavigate();
  const activeUsersRef = collection(db, `chats/${chat.id}/activeUsers`);
  const [activeUsers, loadingActiveUsers] = useCollectionData(activeUsersRef);
  const loadingState = useLoading();
  const getErrorMessage = useErrorMessage();

  const saveChatHandler = async () => {
    loadingState.setIsLoading(true);

    try {
      const user = await findUser(auth.currentUser.email);
      const savedChatsRef = collection(db, `users/${user?.id}/savedChats`);
      const data = await getDocs(savedChatsRef);

      const chatDocs = data.docs.map((doc) => ({ ...doc.data() }));
      const existingChat = chatDocs.filter(
        (existingChat) => existingChat.id === chat.id
      );

      if (existingChat.length > 0) {
        throw new Error("Este chat ya existe.");
      }

      await addDoc(savedChatsRef, {
        id: chat.id,
        name: chat.name,
        hasPassword: chat.hasPassword,
      });
      loadingState.setMessage(
        <SuccessAlert
          message="Chat guardado exitosamente."
          onClose={() => loadingState.setMessage(null)}
        />
      );
    } catch (error) {
      loadingState.setMessage(
        <ErrorAlert
          message={getErrorMessage(error.message)}
          onClose={() => setErrorMessage(null)}
        />
      );
    }
    loadingState.setIsLoading(false);
  };

  const cleanupActiveUsers = () => {
    activeUsers?.forEach(async (user) => {
      const lastActiveTime = user.lastActive?.toDate().getTime();
      const currentTime = new Date().getTime();
      const elapsedTime = (currentTime - lastActiveTime) / 1000;

      if (elapsedTime > 325) {
        if (user.uid === auth.currentUser.uid) {
          await addActiveUser();
          return;
        }
        await deleteDoc(doc(db, `chats/${chat.id}/activeUsers`, user.id));
      }
    });
  };

  useEffect(() => {
    const timeout = setTimeout(() => loadingState.setMessage(null), 3000);

    return () => clearTimeout(timeout);
  }, [loadingState.message]);

  useEffect(() => {
    cleanupActiveUsers();
  }, [activeUsers]);

  return (
    <Modal header="Menú" onClose={onClose}>
      <h2>
        <i>{chat.name}</i>
      </h2>
      <div className="modal-info">
        <span>
          <b>ID:</b> {chat.id}
        </span>
        <span>
          {chat.owner == auth.currentUser.uid ? (
            <b>
              <i>Eres dueño/a de este chat.</i>
            </b>
          ) : !auth.currentUser.isAnonymous && loadingState.isLoading ? (
            <LoadingSpinner />
          ) : (
            <>
              <button
                onClick={saveChatHandler}
                className="btn btn-sm btn-primary save-chat group-sm"
              >
                Guardar chat
              </button>
              {loadingState.message && <div>{loadingState.message}</div>}
            </>
          )}
        </span>
        {loadingActiveUsers ? (
          <LoadingSpinner />
        ) : (
          <>
            <details className="group">
              <summary>Usuarios activos: {<b>{activeUsers.length}</b>}</summary>
              <ul className="details-list group-sm">
                {activeUsers.map((user) => (
                  <li key={user.uid}>
                    <Avatar
                      alt="Foto de perfil"
                      src={user.photoURL}
                      sx={{ width: 60, height: 60 }}
                    />
                    <p>{user.username}</p>
                  </li>
                ))}
              </ul>
            </details>
          </>
        )}
      </div>
      <div className="group-actions">
        <button
          className="btn btn-primary"
          onClick={async () => {
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
