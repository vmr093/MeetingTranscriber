import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import RecordModal from "../components/RecordModal";
import UploadModal from "../components/UploadModal";

const styles = {
  container: {
    padding: "6rem 1.5rem 1.5rem",
    maxWidth: "800px",
    margin: "0 auto",
    textAlign: "center",
    color: "#fff",
    position: "relative",
    zIndex: 1,
  },
  backgroundGradient: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background:
      "radial-gradient(circle at 40% 30%, rgba(0, 123, 255, 0.2), transparent 60%), radial-gradient(circle at 70% 80%, rgba(255, 255, 255, 0.08), transparent 60%)",
    zIndex: 0,
    pointerEvents: "none",
    animation: "pulseGradient 20s ease-in-out infinite",
  },
  darkPanel: {
    position: "fixed",
    bottom: 0,
    left: 0,
    width: "100%",
    height: "120px",
    background: "linear-gradient(to top, rgba(14, 25, 78, 0.95), transparent)",
    zIndex: 0,
    pointerEvents: "none",
  },
  sectionHeading: {
    fontSize: "1.8rem",
    fontWeight: "bold",
    margin: "2rem 0 1rem",
    color: "#fff",
    textAlign: "center",
  },
  buttonRow: {
    display: "flex",
    gap: "1rem",
    justifyContent: "center",
    marginBottom: "3rem",
  },
  recordButton: {
    backgroundColor: "#ff4d4d",
    color: "#fff",
    fontWeight: "bold",
    padding: "0.6rem 1.5rem",
    borderRadius: "10px",
    border: "none",
    cursor: "pointer",
    boxShadow: "0 4px 10px rgba(255, 77, 77, 0.3)",
  },
  uploadButton: {
    backgroundColor: "#007bff",
    color: "#fff",
    fontWeight: "bold",
    padding: "0.6rem 1.5rem",
    borderRadius: "10px",
    border: "none",
    cursor: "pointer",
    boxShadow: "0 4px 10px rgba(0, 123, 255, 0.3)",
  },

  illustration: {
    width: "250px",
    maxWidth: "100%",
    margin: "5rem auto",
    display: "block",
  
  },
};

function Dashboard() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);

  return (
    <>
      <Navbar />
      <style>{`
        @keyframes pulseGradient {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }
      `}</style>

      <div style={styles.backgroundGradient}></div>
      <div style={styles.darkPanel}></div>

      <div style={styles.container}>
        <img
          src="/undraw_speech-to-text_4kov.svg"
          alt="Speech to Text Illustration"
          style={styles.illustration}
        />

        <h2 style={styles.sectionHeading}>Record or Upload Meeting</h2>

        <div style={styles.buttonRow}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={styles.recordButton}
            onClick={() => setIsRecordModalOpen(true)}
          >
            Record
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={styles.uploadButton}
            onClick={() => setIsUploadModalOpen(true)}
          >
            Upload
          </motion.button>
        </div>

        <RecordModal
          isOpen={isRecordModalOpen}
          onClose={() => setIsRecordModalOpen(false)}
          onUploadComplete={() => {}}
        />

        <UploadModal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          userId={"TEMP_USER_ID"} // Replace if needed
          onUploadComplete={() => {}}
        />
      </div>
    </>
  );
}

export default Dashboard;
