import { useInput } from "../hooks/useInput";

const NewMessageForm = (props) => {
  const message = useInput((message) => message.trim().length === 0);

  const sendMessageHandler = (event) => {
    event.preventDefault();

    if (message.value.trim().length === 0) {
      return;
    }

    props.onSendMessage(message.value);
    message.setValue("");
  };

  return (
      <form onSubmit={sendMessageHandler}>
        <p>Escribir un mensaje:</p>
        <textarea
          id="message"
          className="form-control"
          value={message.value}
          onChange={message.changeHandler}
        />
        <button
          disabled={message.hasError}
          className="btn btn-lg btn-dark group"
        >
          Enviar mensaje
        </button>
      </form>
  );
};

export default NewMessageForm;
