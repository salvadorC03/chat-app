import JoinChatForm from "../components/UserPage/JoinChatForm";
import { useNavigate } from "react-router-dom";

const JoinChatPage = () => {
  const navigate = useNavigate();

  const joinChatHandler = (chatId) => {
    navigate("/chat/" + chatId);
  };

  return (
      <JoinChatForm onSubmit={joinChatHandler} />
  );
};

export default JoinChatPage;
