import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { getAuth } from "firebase/auth";

function UploadModal({ isOpen, onClose, onUploadComplete }) {
  const [title, setTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async () => {
    if (!title.trim()) {
      toast.error("Please enter a meeting title");
      return;
    }
    if (!selectedFile) {
      toast.error("Please select an audio file");
      return;
    }

    try {
      setIsUploading(true);

      const auth = getAuth();
      const userId = auth.currentUser?.uid;

      const formData = new FormData();
      formData.append("audio", selectedFile);
      formData.append("title", title);
      formData.append("userId", userId);

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
      } else {
        toast.error(data.error || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Upload error. See console.");
    } finally {
      setIsUploading(false);
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
    startBtn: {
      backgroundColor: "black",
      color: "white",
      border: "none",
      padding: "0.8rem 1.2rem",
      fontSize: "1rem",
      borderRadius: "12px",
      fontWeight: "bold",
      cursor: "pointer",
      marginTop: "1rem",
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
    fileInput: {
      marginBottom: "1rem",
      color: "#000",
      backgroundColor: "#fff",
      borderRadius: "10px",
      padding: "0.5rem",
    },
  };

  const animatedGlowStyles = `
    @keyframes glowPulse {
      0% { box-shadow: 0 0 15px rgba(0, 123, 255, 0.4); }
      50% { box-shadow: 0 0 22px rgba(0, 123, 255, 0.65); }
      100% { box-shadow: 0 0 15px rgba(0, 123, 255, 0.4); }
    }

    .modal-glow {
      animation: glowPulse 2s infinite ease-in-out;
    }
  `;
const spinnerStyles = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .css-spinner {
    border: 4px solid rgba(255, 255, 255, 0.3);
    border-top: 4px solid #ffffff;
    border-radius: 50%;
    width: 36px;
    height: 36px;
    animation: spin 1s linear infinite;
    margin: 1rem auto;
  }
`;

  return (
    <AnimatePresence>
      {isOpen && (
        <div style={styles.overlay}>
          <style>{animatedGlowStyles + spinnerStyles}</style>

          <motion.div
            style={styles.modal}
            className="modal-glow"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.3 }}
          >
            <input
              type="text"
              placeholder="Meeting Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={styles.input}
              disabled={isUploading}
            />

            <input
              type="file"
              accept="audio/*"
              onChange={(e) => setSelectedFile(e.target.files[0])}
              style={styles.fileInput}
              disabled={isUploading}
            />

            {isUploading ? (
              <div className="css-spinner"></div>
            ) : (
              <button style={styles.startBtn} onClick={handleFileUpload}>
                Upload & Transcribe
              </button>
            )}

            <br />
            <button
              style={styles.closeBtn}
              onClick={onClose}
              disabled={isUploading}
            >
              Close
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default UploadModal;
