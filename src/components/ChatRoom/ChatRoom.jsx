import ChatNavigation from "../UI/ChatNavigation";
import ChatMessage from "./ChatMessage";
import NewMessageForm from "./NewMessageForm";
import LoadingSpinner from "../UI/LoadingSpinner";
import ChatModal from "./ChatModal";
import ErrorAlert from "../UI/ErrorAlert";
import { useErrorMessage } from "../../hooks/useErrorMessage";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { auth, db, storage } from "../../util/firebase-config";
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
import ImageModal from "./ImageModal";

const ChatRoom = ({ chat, username }) => {
  const { message, setMessage } = useLoading();

  const [showImageModal, setShowImageModal] = useState(false);
  const [imageModalSrc, setImageModalSrc] = useState("");
  
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

  const openImageHandler = (src) => {
    setImageModalSrc(src);
    setShowImageModal(true);
  };

  const closeImageHandler = () => {
    setShowImageModal(false);
    setImageModalSrc("");
  };

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

  const sendRecordHandler = async (URL) => {
    try {
      const data = await fetch(URL);
      const blob = await data.blob();

      const file = new File([blob], "file.wav", {type: "audio/x-wav"});

      const recordRef = ref(
        storage,
        `chats/${chat.id}/recordings/${auth.currentUser.uid}${file.lastModified}.wav`
      );
      await uploadBytes(recordRef, file);
      const recordURL = await getDownloadURL(recordRef);

      await addDoc(messagesRef, {
        type: "RECORD",
        src: recordURL,
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

  const sendPictureHandler = async (event) => {
    try {
      const file = event.target.files[0];

      if (!file) {
        return;
      }

      if (!file.type.includes("image")) {
        throw new Error("El archivo seleccionado no es válido");
      }

      const imageRef = ref(
        storage,
        `chats/${chat.id}/pictures/${auth.currentUser.uid}${file.lastModified}`
      );
      await uploadBytes(imageRef, file);
      const photoURL = await getDownloadURL(imageRef);

      await addDoc(messagesRef, {
        type: "PICTURE",
        src: photoURL,
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
      loadingState.setMessage(
        <ErrorAlert
          onClose={() => {
            loadingState.setMessage(null);
          }}
          message={getErrorMessage(error.message)}
        />
      );
    }
  };

  return (
    <>
    {showImageModal && <ImageModal src={imageModalSrc} onClose={closeImageHandler} />}
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
          <div key={message.createdAt} className="message-div">
            <ChatMessage message={message} onOpenImage={openImageHandler} />
            <div ref={messagesListRef}></div>
          </div>
        ))}
        {message && <div>{message}</div>}
        <div className="message-form">
          <NewMessageForm onSendMessage={sendMessageHandler} onSendRecord={sendRecordHandler} onSendPicture={sendPictureHandler} />
        </div>
      </div>
    </>
  );
};

export default ChatRoom;
