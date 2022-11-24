import { useInput } from "../hooks/useInput";
import { useNavigate } from "react-router-dom";
import Input from "../components/Input";

const JoinChatPage = () => {
  const chatId = useInput((chatId) => chatId.trim().length === 0);
  const navigate = useNavigate();

  const submitHandler = (event) => {
    event.preventDefault();

    navigate("/chat/" + chatId.value);
  };

  return (
    <div>
      <form onSubmit={submitHandler}>
        <Input
          fieldsetClass="col-sm-4"
          id="chatId"
          label="Introducir ID del chat:"
          attributes={{
            className: "form-control " + chatId.inputClasses,
            type: "text",
            value: chatId.value,
            onChange: chatId.changeHandler,
          }}
        />
        {chatId.hasError && <p>Por favor introduce un ID válido</p>}
        <button className="btn btn-primary group" disabled={chatId.hasError}>
          Unirse al chat
        </button>
      </form>
    </div>
  );
};

export default JoinChatPage;
