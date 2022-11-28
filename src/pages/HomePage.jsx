import ChatItem from "../components/UI/ChatItem";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import { collection, query, where } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { db } from "../util/firebase-config";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";

function HomePage(props) {
  const navigate = useNavigate();
  const chatsRef = collection(db, "chats");
  const chatsQuery = query(chatsRef, where("isPublic", "==", true));
  const [chats, loading ] = useCollectionData(chatsQuery);

  return (
    <main>
      <h2>Página principal</h2>
      <h5 className="group-text">Unirse a un chat:</h5>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <ul className="chatitem-list">
          {chats?.map((chat) => (
            <ChatItem
              isOwner={false}
              key={chat.id}
              chat={chat}
              onClick={() => {
                navigate("/chat/" + chat.id);
              }}
            />
          ))}
        </ul>
      )}
      {!loading && chats?.length === 0 && (
        <p className="group-text">No se han encontrado chats.</p>
      )}
    </main>
  );
}

export default HomePage;
