import Avatar from "@mui/material/Avatar";
import { auth } from "../../util/firebase-config";
import "./ChatMessage.css";

const ChatMessage = ({ message }) => {
  const messageClasses =
    auth.currentUser.uid === message?.sender.uid
      ? "alert alert-info"
      : "alert alert-success";

  const avatarClasses =
    auth.currentUser.uid === message?.sender.uid ? "own-avatar" : "avatar";

  const avatar = (
    <div className={`chat-group ${avatarClasses}`}>
      <Avatar
        alt="Foto de perfil"
        src={message.sender.photoURL}
        sx={{ width: 60, height: 60 }}
      />
    </div>
  );

  return (
    <div
      className={`message ${
        auth.currentUser.uid === message?.sender.uid && "own-message"
      }`}
    >
      {auth.currentUser.uid !== message?.sender.uid && avatar}
      <div className="chat-group">
        <h6>{message.sender.username}:</h6>
        <p className={`message-text ${messageClasses}`}>{message.text}</p>
      </div>
      {auth.currentUser.uid === message?.sender.uid && avatar}
    </div>
  );
};

export default ChatMessage;
