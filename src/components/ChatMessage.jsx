import Avatar from "@mui/material/Avatar";
import { auth } from "../util/firebase-config";

const ChatMessage = ({ message }) => {
  const messageClasses =
    auth.currentUser.email === message?.sender.email
      ? "alert alert-info"
      : "alert alert-success";

  const avatarClasses =
    auth.currentUser.email === message?.sender.email ? "own-avatar" : "avatar";

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
          className={`${
            auth.currentUser.email === message?.sender.email && "own-message"
          }`}
          style={{ paddingBottom: "1rem" }}
        >
          {auth.currentUser.email !== message?.sender.email && avatar}
          <div className="chat-group">
            <h6>{message.sender.username}:</h6>
            <p className={messageClasses} style={{ maxWidth: "50rem" }}>
              {message.text}
            </p>
          </div>
          {auth.currentUser.email === message?.sender.email && avatar}
        </div>
  );
};

export default ChatMessage;
