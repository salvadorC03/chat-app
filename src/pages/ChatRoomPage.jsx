import { collection, getDocs } from "firebase/firestore";
import { Fragment, useContext, useEffect, useState } from "react";
import { useNavigate, useParams, Navigate } from "react-router-dom";
import ChatRoom from "../components/ChatRoom";
import LoadingSpinner from "../components/LoadingSpinner";
import { useInput } from "../hooks/useInput";
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
  const password = useInput((password) => password.trim().length === 0);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authCtx.currentUser) {
      return;
    }

    const fetchChat = async () => {
      loadingState.setIsLoading(true);
      const collectionRef = collection(db, "chats");

      const chatData = await getDocs(collectionRef);
      const chats = chatData.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      const storedChat = chats.filter((chat) => chat.id === params.chatId);

      if (storedChat.length === 0) {
        setChatFound(false);
        loadingState.setIsLoading(false);
        return;
      }

      setChatFound(true);
      setChat({ ...storedChat[0] });
      const user = await findUser(auth.currentUser.email);
      setUser(user);
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

    if (chat?.owner === auth.currentUser?.email) {
      setPasswordEntered(true);
    }
  }, [chat, auth.currentUser]);

  if (!authCtx.currentUser) {
    return <Navigate to="/login" />;
  }

  const submitPasswordHandler = (event) => {
    event.preventDefault();

    if (password.value === chat.password) {
      setPasswordEntered(true);
    } else {
      alert("La contraseña introducida no es correcta");
    }
  };

  return (
    <Fragment>
      {!chatFound ? (
        <>
          <h1>Chat no encontrado</h1>
          <button
            className="btn btn-primary"
            onClick={() => {
              navigate("/home");
            }}
          >
            Regresar
          </button>
        </>
      ) : (
        !loadingState.isLoading &&
        chat &&
        user &&
        passwordEntered && (
          <ChatRoom
            chat={chat}
            chatId={params.chatId}
            username={user.username}
          />
        )
      )}
      {!loadingState.isLoading && !passwordEntered && (
        <form onSubmit={submitPasswordHandler}>
          <p>Introducir contraseña:</p>
          <input
            type="text"
            value={password.value}
            onChange={password.changeHandler}
          />
          <button disabled={!password.isValid}>Aceptar</button>
        </form>
      )}
      {loadingState.isLoading && <LoadingSpinner className="centered" />}
    </Fragment>
  );
};

export default ChatRoomPage;
