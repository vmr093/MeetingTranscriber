import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { jsPDF } from "jspdf";

function MeetingModal({ isOpen, onClose, meeting }) {
  const [sections, setSections] = useState([
    { title: "Meeting Overview", content: ["A short high-level summary of what the meeting was about."] },
    { title: "Key Decisions", content: ["What was agreed upon? Any final calls or choices made?"] },
    { title: "Action Items", content: ["A bulleted list of assigned tasks, who’s responsible, and deadlines (if mentioned)."] },
    { title: "Discussion Highlights", content: ["Notable talking points, questions raised, or challenges discussed."] },
    { title: "Next Steps", content: ["What’s happening after this meeting? Any follow-ups or planned dates?"] },
    { title: "Questions & Concerns", content: ["Any unresolved issues or items that require clarification."] },
    { title: "Attendees (Optional)", content: ["Who was present (if the transcript includes names or roles)."] },
  ]);

  const [mode, setMode] = useState(null); // Modes: "remove", "add", "edit"
  const [newSectionName, setNewSectionName] = useState(""); // For adding a new section
  const [selectedSectionToRemove, setSelectedSectionToRemove] = useState(null); // For removing a section
  const [showHistory, setShowHistory] = useState(false); // For version control

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

            {/* Button Row */}
            <div style={styles.buttonRow}>
              <button onClick={() => setMode("remove")} style={styles.actionButton}>
                Remove
              </button>
              <button onClick={() => setMode("add")} style={styles.actionButton}>
                Add Section
              </button>
              <button onClick={() => setMode("edit")} style={styles.actionButton}>
                Edit
              </button>
            </div>

            {/* Remove Mode */}
            {mode === "remove" && (
              <div>
                {sections.map((section, index) => (
                  <div key={index} style={styles.section}>
                    <label>
                      <input
                        type="radio"
                        name="removeSection"
                        value={index}
                        onChange={(e) => setSelectedSectionToRemove(Number(e.target.value))}
                      />
                      {section.title}
                    </label>
                  </div>
                ))}
                <button
                  onClick={() => {
                    if (selectedSectionToRemove !== null) {
                      removeSection(selectedSectionToRemove);
                      setMode(null); // Exit remove mode
                    }
                  }}
                  style={styles.confirmButton}
                >
                  Confirm Remove
                </button>
                <button onClick={() => setMode(null)} style={styles.cancelButton}>
                  Cancel
                </button>
              </div>
            )}

            {/* Add Section Mode */}
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
                      setNewSectionName(""); // Clear input
                      setMode(null); // Exit add mode
                    }
                  }}
                  style={styles.confirmButton}
                >
                  Add Section
                </button>
                <button onClick={() => setMode(null)} style={styles.cancelButton}>
                  Cancel
                </button>
              </div>
            )}

            {/* Edit Mode */}
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
                          updateSectionContent(index, [...section.content, e.target.value.trim()]);
                          e.target.value = ""; // Clear input
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

            {/* Export Buttons */}
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

            {/* Version Control */}
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
                                onClick={() => navigator.clipboard.writeText(version)}
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
    background: "rgba(181, 185, 245, 0.85)",
    borderRadius: "16px",
    padding: "1.5rem",
    width: "100%",
    maxWidth: "600px",
    maxHeight: "80vh",
    overflowY: "auto",
    boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "bold",
    marginBottom: "1rem",
    color: "#2d3a69", // Theme color for text
    textAlign: "left",
  },
  date: {
    fontSize: "0.7rem",
    color: "#2d3a69", // Theme color for text
    marginBottom: "1.5rem",
    textAlign: "left",
  },
  section: {
    marginBottom: "1.5rem",
    textAlign: "left", // Align sections to the left
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "0.5rem",
  },
  sectionTitleInput: {
    fontSize: "1.2rem",
    fontWeight: "bold",
    border: "none",
    background: "transparent",
    color: "#1e3a8a", // Theme color for text
    width: "80%",
  },
  sectionContent: {
    listStyleType: "disc",
    paddingLeft: "1.5rem",
    color: "#2d3a69", // Theme color for text
  },
  contentInput: {
    border: "1px solid #ccc",
    background: "rgba(255, 255, 255, 0.7)", // Frosted glass effect
    color: "#2d3a69", // Theme color for text
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
    backgroundColor: "rgba(45, 58, 105, 0.7)", // Frosted glass effect with theme color
    color: "#fff",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
  },
  confirmButton: {
    marginTop: "1rem",
    padding: "0.4rem 1.2rem",
    fontSize: "0.7rem",
    borderRadius: "12px",
    border: "none",
    cursor: "pointer",
    backgroundColor: "rgba(40, 167, 69, 0.7)", // Green frosted glass effect
    color: "#fff",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
  },
  cancelButton: {
    marginTop: "1rem",
    padding: "0.4rem 1.2rem",
    fontSize: "0.7rem",
    borderRadius: "12px",
    border: "none",
    cursor: "pointer",
    backgroundColor: "rgba(220, 53, 69, 0.7)", // Red frosted glass effect
    color: "#fff",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
  },
  addSectionModal: {
    backgroundColor: "#2d3a69",
    padding: "1.5rem",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
    textAlign: "center",
  },
  input: {
    width: "80%",
    padding: "0.6rem",
    marginBottom: "1rem",
    borderRadius: "8px",
    border: "1px solid #ccc",
    background: "rgba(255, 255, 255, 0.7)", // Frosted glass effect
    color: "rgba(45, 58, 105, 0.7)", // Theme color for text
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
    backgroundColor: "rgba(45, 58, 105, 0.7)", // Theme color frosted glass
    color: "#fff",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
  },
  historyContainer: {
    marginTop: "1rem",
    maxHeight: "200px",
    overflowY: "auto",
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "0.5rem",
    backgroundColor: "rgba(255, 255, 255, 0.85)", // Frosted glass effect
  },
  historyBlock: {
    marginBottom: "1rem",
    textAlign: "left", // Align history blocks to the left
  },
  historyText: {
    whiteSpace: "pre-wrap",
    backgroundColor: "rgba(238, 238, 238, 0.85)", // Frosted glass effect
    padding: "0.5rem",
    borderRadius: "6px",
    fontSize: "0.95rem",
    color: "#2d3a69", // Theme color for text
  },
  historyActionButton: {
    padding: "0.4rem 0.8rem",
    fontSize: "0.9rem",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    backgroundColor: "rgba(45, 58, 105, 0.7)", // Theme color frosted glass
    color: "#fff",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
  },
  button: {
    marginTop: "1rem",
    padding: "0.4rem 1.2rem",
    fontSize: "0.7rem",
    borderRadius: "12px",
    border: "none",
    cursor: "pointer",
    backgroundColor: "rgba(45, 58, 105, 0.7)", // Theme color frosted glass
    color: "#fff",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
  },
};

export default MeetingModal;
