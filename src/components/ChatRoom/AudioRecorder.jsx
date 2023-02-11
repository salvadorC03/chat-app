import MicIcon from "@mui/icons-material/Mic";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import AudioTimer from "./AudioTimer";
import { useEffect, useState } from "react";
import { useReactMediaRecorder } from "react-media-recorder";

import "./AudioRecorder.css";

export const AudioRecorder = (props) => {
  const [submitRecording, setSubmitRecording] = useState(false);
  const { status, startRecording, stopRecording, mediaBlobUrl } =
    useReactMediaRecorder({ audio: true });

  useEffect(() => {
    if (!mediaBlobUrl) {
      return;
    }

    if (submitRecording) {
      props.onRecord(mediaBlobUrl);
    }
  }, [mediaBlobUrl]);

  useEffect(() => {
    if (status == "stopped" || status == "idle") {
      props.onStop();
    }
  }, [status])

  return (
    <>
      {status === "recording" && (
        <>
        <AudioTimer />
          <button
            className="btn btn-lg btn-danger recorder-group-timer"
            onClick={() => {
              setSubmitRecording(false);
              stopRecording();
              props.onStop();
            }}
          >
            <CloseIcon />
          </button>
          <button
            className="btn btn-lg btn-success recorder-group-actions"
            onClick={() => {
              setSubmitRecording(true);
              stopRecording();
              props.onStop();
            }}
          >
            <CheckIcon />
          </button>
        </>
      )}
      <button
        className="btn btn-lg btn-info recorder-group-actions"
        disabled={status == "recording"}
        onClick={() => {
          startRecording();
          props.onStart();
        }}
      >
        <MicIcon />
      </button>
    </>
  );
};
