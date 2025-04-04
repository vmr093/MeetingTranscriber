import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { getAuth } from "firebase/auth";

function RecordModal({ isOpen, onClose, onUploadComplete }) {
  const [title, setTitle] = useState("");
  const [recording, setRecording] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const navigate = useNavigate();

  const handleStartRecording = async () => {
    if (!title.trim()) {
      toast.error("Please enter a meeting title");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        setIsUploading(true);
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const formData = new FormData();
        formData.append("audio", blob, `${title}.webm`);
        formData.append("title", title);

        const auth = getAuth();
        const userId = auth.currentUser?.uid;
        formData.append("userId", userId);

        try {
          const res = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/api/record/upload`,
            {
              method: "POST",
              body: formData,
            }
          );

          const data = await res.json();

          if (res.ok) {
            toast.success("Meeting uploaded and transcribed!");
            onUploadComplete(data);
            onClose();
            navigate("/meetings");
          } else {
            toast.error(data.message || "Upload failed");
          }
        } catch (err) {
          console.error("Upload error:", err);
          toast.error("Upload error. See console.");
        } finally {
          setIsUploading(false);
        }
      };

      mediaRecorder.start();
      setRecording(true);
      toast("Recording started");
    } catch (err) {
      console.error("Mic access denied or failed:", err);
      toast.error("Mic access denied");
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  const styles = {
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
    },
    modal: {
      backgroundColor: "rgba(0, 123, 255, 0.15)",
      backdropFilter: "blur(20px)",
      borderRadius: "20px",
      padding: "2rem",
      width: "100%",
      maxWidth: "360px",
      margin: "0 1.25rem",
      textAlign: "center",
      color: "#fff",
      boxShadow: "0 0 15px rgba(0, 123, 255, 0.4)",
    },
    input: {
      width: "95%",
      padding: "0.8rem",
      fontSize: "1rem",
      marginBottom: "1rem",
      border: "2px solid black",
      borderRadius: "12px",
      backgroundColor: "white",
      color: "black",
    },
    recordBtn: {
      backgroundColor: recording ? "darkred" : "black",
      color: "white",
      border: "none",
      padding: "0.8rem 1.2rem",
      fontSize: "1rem",
      borderRadius: "12px",
      fontWeight: "bold",
      cursor: "pointer",
      marginRight: "0.5rem",
    },
    closeBtn: {
      marginTop: "1rem",
      backgroundColor: "white",
      color: "black",
      border: "none",
      padding: "0.5rem 1rem",
      fontWeight: "bold",
      borderRadius: "10px",
      cursor: "pointer",
    },
    spinner: {
      margin: "1rem auto",
      width: "32px",
      height: "32px",
      border: "4px solid rgba(255, 255, 255, 0.3)",
      borderTop: "4px solid #4eaaff",
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
    },
  };

  return (
    <>
      <style>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>

      <AnimatePresence>
        {isOpen && (
          <div style={styles.overlay}>
            <motion.div
              style={styles.modal}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <input
                type="text"
                placeholder="Meeting Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={styles.input}
                disabled={recording || isUploading}
              />

              {isUploading ? (
                <div style={styles.spinner} />
              ) : !recording ? (
                <button style={styles.recordBtn} onClick={handleStartRecording}>
                  Start Recording
                </button>
              ) : (
                <button style={styles.recordBtn} onClick={handleStopRecording}>
                  Stop & Upload
                </button>
              )}

              <br />
              <button
                style={styles.closeBtn}
                onClick={onClose}
                disabled={isUploading}
              >
                Cancel
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

export default RecordModal;
