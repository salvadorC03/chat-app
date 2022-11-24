import { auth, db } from "../util/firebase-config";
import { useCollectionData } from "react-firebase-hooks/firestore";
import {
  addDoc,
  collection,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import ChatNavigation from "../components/ChatNavigation";
import ChatMessage from "../components/ChatMessage";
import NewMessageForm from "./NewMessageForm";
import LoadingSpinner from "./LoadingSpinner";
import Modal from "./Modal";
import { useState } from "react";
import Card from "./Card";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";

const ChatRoom = ({ chat, chatId, username }) => {
  const [showModal, setShowModal] = useState(false);
  const messagesRef = collection(db, `chats/${chatId}/messages`);
  const messagesQuery = query(messagesRef, orderBy("createdAt"));
  const navigate = useNavigate();
  //const activeUsersQuery = collection(db, `chats/${params.chatId}/activeUsers`);

  const [messages, loadingMessages, errorMessages] =
    useCollectionData(messagesQuery);
  //const [users, loadingUsers, errorUsers] = useCollectionData(activeUsersQuery);

  const sendMessageHandler = async (message) => {
    try {
      await addDoc(messagesRef, {
        text: message,
        createdAt: serverTimestamp(),
        sender: {
          email: auth.currentUser.email,
          username: username,
          photoURL: auth.currentUser.photoURL,
        },
      });
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <>
      {showModal && (
        <Modal
          onClose={() => {
            setShowModal(false);
          }}
        >
          <Card
            header="Inicio"
            attributes={{
              className: "card border-secondary mb-3 ",
            }}
            headerAttributes={{ className: "card-header" }}
            bodyAttributes={{ className: "card-body" }}
          >
            <button
              className="btn btn-primary"
              onClick={() => {
                navigate("/user/profile");
              }}
            >
              Salir del chat
            </button>
            <button
              className="btn btn-primary"
              onClick={() => {
                setShowModal(false);
              }}
            >
              Cerrar menu
            </button>
          </Card>
        </Modal>
      )}
      <ChatNavigation
        onClick={() => {
          setShowModal(true);
        }}
        chat={chat}
      />
      <div style={{ padding: "2%", maxHeight: "35rem", overflow: "auto" }}>
        {loadingMessages && <LoadingSpinner />}
        {showModal && <Modal />}
        {messages?.map((message) => (
          <div
            style={{
              width: "95%",
            }}
          >
            <ChatMessage key={message.createdAt} message={message} />
          </div>
        ))}
        <div style={{ position: "fixed", top: "75%", width: "95%" }}>
          <NewMessageForm onSendMessage={sendMessageHandler} />
        </div>
      </div>
    </>
  );
};

export default ChatRoom;
