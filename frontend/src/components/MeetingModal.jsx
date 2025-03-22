import { motion, AnimatePresence } from "framer-motion";

function MeetingModal({ isOpen, onClose, meeting, children }) {
  if (!meeting) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={styles.backdrop}
          onClick={onClose}
        >
          <motion.div
            className="modal-content"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={styles.modal}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={styles.title}>{meeting.title}</h2>
            <p style={styles.date}>
              {new Date(meeting.uploadedAt).toLocaleString()}
            </p>
            <div style={styles.transcript}>
              {meeting.transcript || "Transcript not available."}
            </div>

            {/* ✅ Insert children (summary, export buttons, etc.) here */}
            {children}

            <button onClick={onClose} style={styles.button}>
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
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-end",
    padding: "1rem",
    zIndex: 1000,
  },
  modal: {
    background: "#fff",
    borderRadius: "16px",
    padding: "1rem",
    width: "100%",
    maxWidth: "500px",
    maxHeight: "80vh",
    overflowY: "auto",
    boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
  },
  title: {
    fontSize: "1.3rem",
    fontWeight: "bold",
    marginBottom: "0.3rem",
  },
  date: {
    fontSize: "0.9rem",
    color: "#666",
    marginBottom: "1rem",
  },
  transcript: {
    fontSize: "1rem",
    color: "#333",
    lineHeight: 1.5,
    whiteSpace: "pre-wrap",
    marginBottom: "1rem",
  },
  button: {
    marginTop: "1.5rem",
    width: "100%",
    padding: "0.6rem",
    backgroundColor: "#444",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
};

export default MeetingModal;
