import { useState, useRef } from "react";
import axios from "axios";

function RecordMeeting({ userId, onUploadComplete }) {
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [title, setTitle] = useState("");
  const chunks = useRef([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunks.current.push(e.data);
      }
    };

    recorder.onstop = async () => {
      const blob = new Blob(chunks.current, { type: "audio/webm" });
      chunks.current = [];

      const formData = new FormData();
      formData.append("audio", blob, "recording.webm");
      formData.append("title", title || "Untitled Meeting");
      formData.append("userId", userId);

      try {
        const res = await axios.post(
          "http://localhost:8080/api/upload",
          formData
        );
        alert("Upload and transcription complete!");
        onUploadComplete?.(res.data.meeting); // optional callback
      } catch (err) {
        console.error("Upload error:", err);
        alert("Failed to upload recording");
      }
    };

    recorder.start();
    setMediaRecorder(recorder);
    setRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setRecording(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <input
        type="text"
        placeholder="Meeting title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={styles.input}
      />

      {!recording ? (
        <button onClick={startRecording} style={styles.buttonStart}>
          🎙️ Start Recording
        </button>
      ) : (
        <button onClick={stopRecording} style={styles.buttonStop}>
          ⏹️ Stop & Upload
        </button>
      )}
    </div>
  );
}

const styles = {
  wrapper: {
    padding: "1rem",
    background: "#f8f8f8",
    borderRadius: "12px",
    marginTop: "1rem",
    textAlign: "center",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  input: {
    padding: "0.5rem",
    marginBottom: "0.8rem",
    width: "100%",
    fontSize: "1rem",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },
  buttonStart: {
    background: "#28a745",
    color: "white",
    padding: "0.8rem 1.2rem",
    fontSize: "1rem",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
  },
  buttonStop: {
    background: "#dc3545",
    color: "white",
    padding: "0.8rem 1.2rem",
    fontSize: "1rem",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
  },
};

export default RecordMeeting;
