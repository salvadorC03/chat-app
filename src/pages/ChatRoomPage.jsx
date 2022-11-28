import ChatRoom from "../components/ChatRoom/ChatRoom";
import ChatPasswordForm from "../components/ChatRoom/ChatPasswordForm";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import ErrorAlert from "../components/UI/ErrorAlert";
import Modal from "../components/UI/Modal";
import { collection, getDocs } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams, Navigate } from "react-router-dom";
import { useLoading } from "../hooks/useLoading";
import { findUser } from "../util/api";
import { auth, AuthContext, db } from "../util/firebase-config";

const ChatRoomPage = () => {
  const authCtx = useContext(AuthContext);
  const params = useParams();
  const loadingState = useLoading();
  const [chat, setChat] = useState(null);
  const [passwordEntered, setPasswordEntered] = useState(true);
  const [user, setUser] = useState(null);
  const [chatFound, setChatFound] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authCtx.currentUser) {
      return;
    }

    const fetchChat = async () => {
      try {
        loadingState.setIsLoading(true);
        const collectionRef = collection(db, "chats");

        const chatData = await getDocs(collectionRef);
        const chats = chatData.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        const storedChat = chats.filter((chat) => chat.id === params.chatId);

        if (storedChat.length === 0) {
          setChatFound(false);
          loadingState.setIsLoading(false);
          return;
        }

        setChatFound(true);
        setChat({ ...storedChat[0] });
        if (!authCtx.currentUser.isAnonymous) {
          const user = await findUser(auth.currentUser.email);
          setUser(user);
        } else {
          const user = { username: "Usuario-Invitado" };
          setUser(user);
        }
      } catch (error) {
        loadingState.setMessage(<ErrorAlert message={error.message} />);
      }
      loadingState.setIsLoading(false);
    };

    fetchChat();
  }, []);

  useEffect(() => {
    if (!authCtx.currentUser) {
      return;
    }

    if (chat?.hasPassword) {
      setPasswordEntered(false);
    }
  }, [chat]);

  useEffect(() => {
    if (!authCtx.currentUser) {
      return;
    }

    if (chat?.owner === auth.currentUser?.uid) {
      setPasswordEntered(true);
    }
  }, [chat, auth.currentUser.uid]);

  useEffect(() => {
    if (!loadingState.message) {
      return;
    }

    const timeout = setTimeout(() => {
      loadingState.setMessage(null);
    }, [3000]);

    return () => {
      clearTimeout(timeout);
    };
  }, [loadingState.message]);

  if (!authCtx.currentUser) return <Navigate to="/login" />;

  const submitPasswordHandler = (enteredPassword) => {
    loadingState.setIsLoading(true);

    setTimeout(() => {
      if (enteredPassword === chat.password) {
        setPasswordEntered(true);
      } else {
        loadingState.setMessage(
          <ErrorAlert
            message="La contraseña introducida no es válida."
            onClose={() => {
              loadingState.setMessage(null);
            }}
          />
        );
      }
      loadingState.setIsLoading(false);
    }, 1000);
  };

  return (
    <>
      {!chatFound ? (
        <Modal header="Error">
          <h3>Chat no encontrado</h3>
          <button
            className="btn btn-primary group"
            onClick={() => {
              navigate("/home");
            }}
          >
            Regresar
          </button>
        </Modal>
      ) : (
        !loadingState.isLoading &&
        chat &&
        user &&
        passwordEntered && <ChatRoom chat={chat} username={user.username} />
      )}
      {!loadingState.isLoading && !passwordEntered && (
        <ChatPasswordForm
          message={loadingState.message}
          onSubmit={submitPasswordHandler}
        />
      )}
      {loadingState.isLoading && <LoadingSpinner className="centered" />}
    </>
  );
};

export default ChatRoomPage;
