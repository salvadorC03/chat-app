import Input from "../UI/Input";
import { useInput } from "../../hooks/useInput";

const JoinChatForm = (props) => {
  const chatId = useInput((chatId) => chatId.trim().length === 0);

  const submitHandler = (event) => {
    event.preventDefault();

    if (!chatId.isValid) {
      return;
    }

    props.onSubmit(chatId.value);
  };

  return (
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
      <button className="btn btn-primary group" disabled={!chatId.isValid}>
        Unirse al chat
      </button>
    </form>
  );
};

export default JoinChatForm;
