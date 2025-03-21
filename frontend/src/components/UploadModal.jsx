import { motion, AnimatePresence } from "framer-motion";
import RecordMeeting from "./RecordMeeting";

function UploadModal({ isOpen, onClose, userId, onUploadComplete }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="upload-backdrop"
          style={styles.backdrop}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="upload-modal"
            style={styles.modal}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={styles.title}>🎙️ Record a New Meeting</h2>

            <RecordMeeting
              userId={userId}
              onUploadComplete={onUploadComplete}
            />

            <button onClick={onClose} style={styles.closeButton}>
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const styles = {
  backdrop: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 1000,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "1rem",
  },
  modal: {
    backgroundColor: "#fff",
    borderRadius: "16px",
    padding: "1.5rem",
    width: "100%",
    maxWidth: "500px",
    boxShadow: "0 5px 20px rgba(0,0,0,0.2)",
  },
  title: {
    fontSize: "1.3rem",
    marginBottom: "1rem",
    color: "#222",
    textAlign: "center",
  },
  closeButton: {
    marginTop: "1rem",
    width: "100%",
    padding: "0.7rem",
    fontSize: "1rem",
    backgroundColor: "#444",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
  },
};

export default UploadModal;
