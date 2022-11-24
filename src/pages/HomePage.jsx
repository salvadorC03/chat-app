import { collection, query, where } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { db } from "../util/firebase-config";
import { useNavigate } from "react-router-dom";
import ChatItem from "../components/ChatItem";
import LoadingSpinner from "../components/LoadingSpinner";

function HomePage(props) {
  const navigate = useNavigate();
  const chatsRef = collection(db, "chats");
  const chatsQuery = query(chatsRef, where("isPublic", "==", true));
  const [chats, loading, error] = useCollectionData(chatsQuery);

  return (
    <main>
      <h2>Página principal</h2>
      <h5 style={{marginTop: "2%", marginLeft: "1%"}}>Unirse a un chat:</h5>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <ul style={{ listStyleType: "none" }}>
          {chats?.map((chat) => (
            <ChatItem
              key={chat.id}
              chat={chat}
              onClick={() => {
                navigate("/chat/" + chat.id);
              }}
            />
          ))}
        </ul>
      )}
      {!loading && chats?.length === 0 && <p style={{marginTop: "2%", marginLeft: "1%"}}>No se han encontrado chats.</p>}
    </main>
  );
}

export default HomePage;
