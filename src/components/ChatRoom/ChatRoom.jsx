import ChatNavigation from "../UI/ChatNavigation";
import ChatMessage from "./ChatMessage";
import NewMessageForm from "./NewMessageForm";
import LoadingSpinner from "../UI/LoadingSpinner";
import ChatModal from "./ChatModal";
import { auth, db } from "../../util/firebase-config";
import { useCollectionData } from "react-firebase-hooks/firestore";
import {
  addDoc,
  collection,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { useState } from "react";
import "./ChatRoom.css";

const ChatRoom = ({ chat, username }) => {
  const [showModal, setShowModal] = useState(false);
  const messagesRef = collection(db, `chats/${chat.id}/messages`);
  const messagesQuery = query(messagesRef, orderBy("createdAt"));

  const [messages, loadingMessages] = useCollectionData(messagesQuery);

  const sendMessageHandler = async (message) => {
    try {
      await addDoc(messagesRef, {
        text: message,
        createdAt: serverTimestamp(),
        sender: {
          uid: auth.currentUser.uid,
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
        <ChatModal
          chat={chat}
          onClose={() => {
            setShowModal(false);
          }}
        />
      )}
      <ChatNavigation
        onClick={() => {
          setShowModal(true);
        }}
        chat={chat}
      />
      <div className="messages-list">
        {loadingMessages && <LoadingSpinner />}
        {messages?.map((message) => (
          <div
            className="message-div"
          >
            <ChatMessage key={message.createdAt} message={message} />
          </div>
        ))}
        <div className="message-form">
          <NewMessageForm onSendMessage={sendMessageHandler} />
        </div>
      </div>
    </>
  );
};

export default ChatRoom;
