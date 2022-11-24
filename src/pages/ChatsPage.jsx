import { collection, query, where } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { auth, db } from "../util/firebase-config";
import LoadingSpinner from "../components/LoadingSpinner";
import { useNavigate } from "react-router-dom";
import ChatItem from "../components/ChatItem";
import ErrorAlert from '../components/ErrorAlert'

const ChatsPage = () => {
  const navigate = useNavigate();
  const chatsRef = collection(db, "chats");
  const chatsQuery = query(
    chatsRef,
    where("owner", "==", auth.currentUser.email)
  );

  const [chats, loading, error] = useCollectionData(chatsQuery);

  return (
    <div>
      <h4>Aquí se muestran los chats.</h4>
      {loading && <LoadingSpinner />}
      {!loading && error && <ErrorAlert message="Error al cargar los chats." />}
      {!loading && !error && chats?.length === 0 && <p className="group">No hay chats disponibles.</p>}
      {!loading && chats?.length > 0 && <ul style={{ listStyleType: "none" }}>
        {chats?.map((chat) => (
          <ChatItem key={chat.id} chat={chat} onClick={() => {navigate("/chat/" + chat.id)}} />
        ))}
      </ul>}
    </div>
  );
};

export default ChatsPage;
