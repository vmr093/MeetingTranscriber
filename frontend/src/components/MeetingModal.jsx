import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { jsPDF } from "jspdf";

function MeetingModal({ isOpen, onClose, meeting }) {
  const [sections, setSections] = useState([]);
  const [mode, setMode] = useState(null);
  const [newSectionName, setNewSectionName] = useState("");
  const [selectedSectionToRemove, setSelectedSectionToRemove] = useState(null);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    if (meeting?.summary) {
      const parsedSections = meeting.summary.split("\n\n").map((block) => {
        const lines = block.trim().split("\n");
        const title = lines[0]?.replace(/^#+\s*/, "").trim();
        const content = lines
          .slice(1)
          .map((line) => line.replace(/^[-*•]\s*/, "").trim());
        return { title, content };
      });
      setSections(parsedSections);
    }
  }, [meeting]);

  const addSection = (name) => {
    const newSection = { title: name, content: [] };
    setSections([...sections, newSection]);
  };

  const removeSection = (index) => {
    setSections(sections.filter((_, i) => i !== index));
  };

  const updateSectionContent = (index, newContent) => {
    const updatedSections = [...sections];
    updatedSections[index].content = newContent;
    setSections(updatedSections);
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
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/meetings/${meeting._id}/summary`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ summary: versionText }),
        }
      );

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
            <h2 style={styles.title}>{meeting.title || "Untitled Meeting"}</h2>
            <p style={styles.date}>
              {meeting.uploadedAt
                ? new Date(meeting.uploadedAt).toLocaleString()
                : "Date not available"}
            </p>

            <div style={styles.buttonRow}>
              <button
                onClick={() => setMode("remove")}
                style={styles.actionButton}
              >
                Remove
              </button>
              <button
                onClick={() => setMode("add")}
                style={styles.actionButton}
              >
                Add Section
              </button>
              <button
                onClick={() => setMode("edit")}
                style={styles.actionButton}
              >
                Edit
              </button>
            </div>

            {mode === "remove" && (
              <div>
                {sections.map((section, index) => (
                  <div key={index} style={styles.section}>
                    <label>
                      <input
                        type="radio"
                        name="removeSection"
                        value={index}
                        onChange={(e) =>
                          setSelectedSectionToRemove(Number(e.target.value))
                        }
                      />
                      {section.title}
                    </label>
                  </div>
                ))}
                <button
                  onClick={() => {
                    if (selectedSectionToRemove !== null) {
                      removeSection(selectedSectionToRemove);
                      setMode(null);
                    }
                  }}
                  style={styles.confirmButton}
                >
                  Confirm Remove
                </button>
                <button
                  onClick={() => setMode(null)}
                  style={styles.cancelButton}
                >
                  Cancel
                </button>
              </div>
            )}

            {mode === "add" && (
              <div style={styles.addSectionModal}>
                <h4>Enter New Section Name</h4>
                <input
                  type="text"
                  value={newSectionName}
                  onChange={(e) => setNewSectionName(e.target.value)}
                  style={styles.input}
                />
                <button
                  onClick={() => {
                    if (newSectionName.trim()) {
                      addSection(newSectionName);
                      setNewSectionName("");
                      setMode(null);
                    }
                  }}
                  style={styles.confirmButton}
                >
                  Add Section
                </button>
                <button
                  onClick={() => setMode(null)}
                  style={styles.cancelButton}
                >
                  Cancel
                </button>
              </div>
            )}

            {sections.map((section, index) => (
              <div key={index} style={styles.section}>
                <h4>{section.title}</h4>
                <ul style={styles.sectionContent}>
                  {section.content.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
                {mode === "edit" && (
                  <div>
                    <input
                      type="text"
                      placeholder="Add a bullet point"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && e.target.value.trim()) {
                          updateSectionContent(index, [
                            ...section.content,
                            e.target.value.trim(),
                          ]);
                          e.target.value = "";
                        }
                      }}
                      style={styles.contentInput}
                    />
                  </div>
                )}
              </div>
            ))}

            {mode === "edit" && (
              <button onClick={() => setMode(null)} style={styles.cancelButton}>
                Cancel
              </button>
            )}

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
                                onClick={() =>
                                  navigator.clipboard.writeText(version)
                                }
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
    bottom: 30,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-end",
    padding: "1rem",
    zIndex: 1000,
    backdropFilter: "blur(10px)",
  },
  modal: {
    background: "rgba(5, 6, 20, 0.85)",
    borderRadius: "25px",
    padding: "1rem",
    width: "80%",
    maxWidth: "450px",
    maxHeight: "75vh",
    overflowY: "auto",
    boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "bold",
    marginBottom: "1rem",
    color: "#4eaaff",
    textAlign: "left",
  },
  date: {
    fontSize: "1.2rem",
    color: "#4eaaff",
    marginBottom: "1.5rem",
    textAlign: "left",
  },
  section: { marginBottom: "1.5rem", textAlign: "left" },
  sectionContent: {
    listStyleType: "disc",
    paddingLeft: "1.5rem",
    color: "#e1eaed",
  },
  contentInput: {
    border: "1px solid #ccc",
    background: "rgba(255, 255, 255, 0.7)",
    color: "#2d3a69",
    width: "100%",
    padding: "0.5rem",
    borderRadius: "8px",
    marginBottom: "0.5rem",
  },
  buttonRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "1.5rem",
  },
  actionButton: {
    padding: "0.4rem 1.2rem",
    fontSize: "0.7rem",
    borderRadius: "12px",
    border: "none",
    cursor: "pointer",
    backgroundColor: "rgba(45, 58, 105, 0.7)",
    color: "#fff",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
  },
  confirmButton: {
    marginTop: "1rem",
    backgroundColor: "green",
    color: "#fff",
    padding: "0.5rem 1rem",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
  },
  cancelButton: {
    marginTop: "1rem",
    backgroundColor: "#ccc",
    color: "#000",
    padding: "0.5rem 1rem",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
  },
  addSectionModal: {
    backgroundColor: "#2d3a69",
    padding: "1rem",
    borderRadius: "12px",
    color: "#fff",
  },
  input: {
    width: "80%",
    padding: "0.6rem",
    marginBottom: "1rem",
    borderRadius: "8px",
    border: "1px solid #ccc",
    background: "rgba(255, 255, 255, 0.7)",
    color: "rgba(45, 58, 105, 0.7)",
  },
  actions: {
    display: "flex",
    gap: "1rem",
    justifyContent: "center",
    marginTop: "1.5rem",
  },
  historyToggle: {
    marginTop: "1rem",
    padding: "0.6rem 1.2rem",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "bold",
    backgroundColor: "rgba(45, 58, 105, 0.7)",
    color: "#fff",
  },
  historyContainer: {
    marginTop: "1rem",
    maxHeight: "200px",
    overflowY: "auto",
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "0.5rem",
    backgroundColor: "rgba(255, 255, 255, 0.85)",
  },
  historyBlock: { marginBottom: "1rem", textAlign: "left" },
  historyText: {
    whiteSpace: "pre-wrap",
    backgroundColor: "rgba(238, 238, 238, 0.85)",
    padding: "0.5rem",
    borderRadius: "6px",
    fontSize: "0.95rem",
    color: "#2d3a69",
  },
  historyActionButton: {
    padding: "0.4rem 0.8rem",
    fontSize: "0.9rem",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    backgroundColor: "rgba(45, 58, 105, 0.7)",
    color: "#fff",
  },
  button: {
    marginTop: "1rem",
    padding: "0.4rem 1.2rem",
    fontSize: "0.7rem",
    borderRadius: "12px",
    border: "none",
    cursor: "pointer",
    backgroundColor: "rgba(45, 58, 105, 0.7)",
    color: "#fff",
  },
};

export default MeetingModal;
