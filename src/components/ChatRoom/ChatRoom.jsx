import ChatNavigation from "../UI/ChatNavigation";
import ChatMessage from "./ChatMessage";
import NewMessageForm from "./NewMessageForm";
import LoadingSpinner from "../UI/LoadingSpinner";
import ChatModal from "./ChatModal";
import ErrorAlert from "../UI/ErrorAlert";
import { useErrorMessage } from "../../hooks/useErrorMessage";
import { auth, db } from "../../util/firebase-config";
import { useCollectionData } from "react-firebase-hooks/firestore";
import {
  addDoc,
  updateDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { useBeforeunload } from "react-beforeunload";
import { useLoading } from "../../hooks/useLoading";
import "./ChatRoom.css";

const ChatRoom = ({ chat, username }) => {
  const { message, setMessage } = useLoading();
  const [showModal, setShowModal] = useState(false);
  const getErrorMessage = useErrorMessage();

  const messagesRef = collection(db, `chats/${chat.id}/messages`);
  const activeUsersRef = collection(db, `chats/${chat.id}/activeUsers`);
  const messagesQuery = query(messagesRef, orderBy("createdAt"));
  const messagesListRef = useRef();

  const [messages, loadingMessages] = useCollectionData(messagesQuery);

  const getUser = async () => {
    const data = await getDocs(activeUsersRef);
    const docs = data.docs.map((doc) => ({ ...doc.data() }));
    const user = docs.filter((doc) => doc.uid === auth.currentUser.uid);

    return user;
  };

  useBeforeunload(async (event) => {
    await cleanupActiveUser();
    event.preventDefault();
  });

  const cleanupActiveUser = async () => {
    const user = await getUser();
    await deleteDoc(doc(db, `chats/${chat.id}/activeUsers`, user[0].id));
  };

  const addActiveUser = async () => {
    try {
      const user = await getUser();

      if (user.length === 0) {
        const data = await addDoc(activeUsersRef, {
          username: username,
          photoURL: auth.currentUser.photoURL,
          uid: auth.currentUser.uid,
          lastActive: serverTimestamp(),
        });
        await updateDoc(doc(db, `chats/${chat.id}/activeUsers`, data.id), {
          id: data.id,
        });
      } else {
        await updateDoc(doc(db, `chats/${chat.id}/activeUsers`, user[0].id), {
          lastActive: serverTimestamp(),
        });
      }
    } catch (error) {}
  };

  useEffect(() => {
    addActiveUser();

    return async () => await cleanupActiveUser();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setMessage(null);
    }, 3000);

    return () => clearTimeout(timeout);
  }, [message]);

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
      await addActiveUser();
      messagesListRef.current.scrollIntoView({ behavior: "smooth" });
    } catch (error) {
      setMessage(<ErrorAlert setMessage={getErrorMessage(error.message)} />);
    }
  };

  return (
    <>
      {showModal && (
        <ChatModal
          chat={chat}
          addActiveUser={addActiveUser}
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
          <div className="message-div">
            <ChatMessage key={message.createdAt} message={message} />
            <div ref={messagesListRef}></div>
          </div>
        ))}
        {message && <div>{message}</div>}
        <div className="message-form">
          <NewMessageForm onSendMessage={sendMessageHandler} />
        </div>
      </div>
    </>
  );
};

export default ChatRoom;
