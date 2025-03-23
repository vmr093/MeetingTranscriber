import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { jsPDF } from "jspdf";

function MeetingModal({ isOpen, onClose, meeting }) {
  const [showHistory, setShowHistory] = useState(false);

  if (!meeting) return null;

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  const exportMarkdown = (title, summary) => {
    const markdown = `# ${title}\n\n${summary}`;
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${title}_summary.md`;
    link.click();
  };

  const exportPDF = (title, summary) => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text(title, 10, 10);
    doc.setFontSize(12);
    doc.text(summary, 10, 20);
    doc.save(`${title}_summary.pdf`);
  };

  const restoreVersion = async (versionText) => {
    try {
      const response = await fetch(`/api/meetings/${meeting._id}/summary`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ summary: versionText }),
      });

      if (response.ok) {
        alert("Version restored successfully!");
        window.location.reload();
      } else {
        alert("Failed to restore version.");
      }
    } catch (error) {
      console.error("Error restoring version:", error);
      alert("An error occurred while restoring the version.");
    }
  };

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
            <h2 style={styles.title}>{meeting.title || "Untitled Meeting"}</h2>
            <p style={styles.date}>
              {meeting.uploadedAt
                ? new Date(meeting.uploadedAt).toLocaleString()
                : "Date not available"}
            </p>

            <div style={styles.transcriptStyled}>
              <h3>Transcript</h3>
              {meeting.transcript ? (
                meeting.transcript.split("\n").map((line, idx) => (
                  <p key={idx} style={{ marginBottom: "0.5rem" }}>
                    {line.startsWith("-") ? <li>{line.slice(1)}</li> : line}
                  </p>
                ))
              ) : (
                <p>Transcript not available.</p>
              )}
            </div>

            <div style={styles.actions}>
              <button
                onClick={() => exportPDF(meeting.title, meeting.summary)}
                style={styles.actionButton}
              >
                Export PDF
              </button>
              <button
                onClick={() => exportMarkdown(meeting.title, meeting.summary)}
                style={styles.actionButton}
              >
                Export Markdown
              </button>
            </div>

            {Array.isArray(meeting.summaryHistory) &&
              meeting.summaryHistory.length > 0 && (
                <div style={{ marginTop: "1.5rem" }}>
                  <button
                    onClick={() => setShowHistory(!showHistory)}
                    style={{
                      ...styles.historyToggle,
                      backgroundColor: showHistory ? "#ccc" : "#444",
                      color: showHistory ? "#000" : "#fff",
                    }}
                  >
                    {showHistory ? "Hide" : "Show"} Summary History
                  </button>

                  {showHistory && (
                    <div style={styles.historyContainer}>
                      {meeting.summaryHistory
                        .slice()
                        .reverse()
                        .map((version, index) => (
                          <div key={index} style={styles.historyBlock}>
                            <h4>
                              Version {meeting.summaryHistory.length - index}
                            </h4>
                            <pre style={styles.historyText}>{version}</pre>
                            <div style={{ display: "flex", gap: "0.5rem" }}>
                              <button
                                onClick={() => restoreVersion(version)}
                                style={styles.historyActionButton}
                              >
                                Restore
                              </button>
                              <button
                                onClick={() => copyToClipboard(version)}
                                style={styles.historyActionButton}
                              >
                                Copy
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              )}

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
    backdropFilter: "blur(10px)",
  },
  modal: {
    background: "rgba(255, 255, 255, 0.85)",
    borderRadius: "16px",
    padding: "1rem",
    width: "100%",
    maxWidth: "500px",
    maxHeight: "80vh",
    overflowY: "auto",
    boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
  },
  title: {
    fontSize: "1.3rem",
    fontWeight: "bold",
    marginBottom: "0.3rem",
  },
  date: {
    fontSize: "0.9rem",
    color: "#333",
    marginBottom: "1rem",
  },
  transcriptStyled: {
    fontSize: "1rem",
    color: "#222",
    lineHeight: 1.6,
    whiteSpace: "pre-wrap",
    backgroundColor: "#f2f2f2",
    padding: "1rem",
    borderRadius: "10px",
    marginBottom: "1rem",
  },
  actions: {
    display: "flex",
    gap: "1rem",
    justifyContent: "center",
    marginTop: "1rem",
  },
  actionButton: {
    padding: "0.5rem 1rem",
    fontSize: "0.9rem",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    backgroundColor: "#444",
    color: "#fff",
  },
  historyToggle: {
    marginTop: "1rem",
    padding: "0.5rem 1rem",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  historyContainer: {
    marginTop: "1rem",
    maxHeight: "200px",
    overflowY: "auto",
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "0.5rem",
    backgroundColor: "#fff",
  },
  historyBlock: {
    marginBottom: "1rem",
  },
  historyText: {
    whiteSpace: "pre-wrap",
    backgroundColor: "#eee",
    padding: "0.5rem",
    borderRadius: "6px",
    fontSize: "0.95rem",
  },
  historyActionButton: {
    padding: "0.3rem 0.6rem",
    fontSize: "0.8rem",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    backgroundColor: "#333",
    color: "#fff",
  },
  button: {
    marginTop: "1rem",
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
