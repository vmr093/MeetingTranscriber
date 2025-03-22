import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

function UploadModal({ isOpen, onClose, userId, onUploadComplete }) {
  const [title, setTitle] = useState("");

  const handleStartRecording = () => {
    if (!title.trim()) {
      toast.error("Please enter a meeting title");
      return;
    }

    toast.success("🎙️ Recording started!");
    // TODO: hook up recording logic
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
      backgroundColor: "rgba(0, 123, 255, 0.15)", // translucent blue
      backdropFilter: "blur(20px)", // 💎 frosted effect
      WebkitBackdropFilter: "blur(20px)",
      borderRadius: "20px",
      padding: "2rem",
      Wwidth: "100%",
      maxWidth: "360px", // tightly matches card width
      margin: "0 1.25rem", // padding on left/right (for smaller screens)
      textAlign: "center",
      boxShadow: "0 4px 30px rgba(0, 0, 0, 0.4)",
      color: "#fff",
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
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div style={styles.overlay}>
          <motion.div
            style={styles.modal}
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
            />

            <button style={styles.startBtn} onClick={handleStartRecording}>
              Start Recording
            </button>

            <br />
            <button style={styles.closeBtn} onClick={onClose}>
              Close
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default UploadModal;
