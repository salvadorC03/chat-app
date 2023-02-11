import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import { useState } from "react";
import { useInput } from "../../hooks/useInput";
import { AudioRecorder } from "../ChatRoom/AudioRecorder";
import "./NewMessageForm.css";

const NewMessageForm = (props) => {
  const [isRecording, setIsRecording] = useState(false);
  const message = useInput((message) => message.trim().length === 0);

  const sendMessageHandler = (event) => {
    event.preventDefault();

    if (message.value.trim().length === 0) {
      return;
    }

    props.onSendMessage(message.value);
    message.reset();
  };

  return (
    <>
      <p>Escribir un mensaje:</p>
      <textarea
        id="message"
        className="form-control"
        value={message.value}
        maxLength="1000"
        onChange={message.changeHandler}
      />

      <table className="form-group" style={{ width: "100%" }}>
        <tr>
          <th>
            {!isRecording && (
              <button
                onClick={sendMessageHandler}
                disabled={!message.isValid}
                className="btn btn-lg btn-dark"
              >
                Enviar mensaje
              </button>
            )}
          </th>
          <th style={{ textAlign: "right" }}>
            {!isRecording && (
              <label
                className="btn btn-dark btn-lg upload-photo-label"
                for="upload-photo"
              >
                <InsertPhotoIcon />
              </label>
            )}
            <AudioRecorder
              onStart={() => setIsRecording(true)}
              onStop={() => setIsRecording(false)}
              onRecord={props.onSendRecord}
            />
          </th>
        </tr>
      </table>
      <input id="upload-photo" onChange={props.onSendPicture} type="file" />
    </>
  );
};

export default NewMessageForm;
