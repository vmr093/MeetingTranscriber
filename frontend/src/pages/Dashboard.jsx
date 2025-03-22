import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { jsPDF } from "jspdf";

import MeetingCard from "../components/MeetingCard";
import MeetingModal from "../components/MeetingModal";
import FloatingUploadButton from "../components/FloatingUploadButton";
import UploadModal from "../components/UploadModal";

const styles = {
  container: {
    padding: "1.5rem",
    maxWidth: "600px",
    margin: "0 auto",
    textAlign: "center",
    color: "#fff",
  },
  header: {
    fontSize: "2.5rem",
    marginBottom: "1.5rem",
  },
  empty: {
    color: "var(--text-muted)",
    fontStyle: "italic",
  },
  logout: {
    backgroundColor: "#111",
    color: "#fff",
    border: "1px solid #333",
    padding: "0.5rem 1rem",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "bold",
    marginTop: "1rem",
    transition: "background 0.2s ease",
  },
  illustration: {
    width: "100%",
    height: "auto",
    marginBottom: "1rem",
  },
};

function Dashboard() {
  const [meetings, setMeetings] = useState([]);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const userId = "YOUR_USER_ID_HERE"; // Replace with actual logic when ready

  useEffect(() => {
    axios
      .get("/api/meetings")
      .then((res) => {
        if (Array.isArray(res.data)) {
          setMeetings(res.data);
        } else {
          toast.error("Unexpected API response");
          setMeetings([]);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch meetings", err);
        toast.error("Could not fetch meetings");
      });
  }, []);

  const openModal = (meeting) => {
    setSelectedMeeting(meeting);
    setSummary(""); // Reset temp summary so we show saved one
  };

  const closeModal = () => {
    setSelectedMeeting(null);
    setSummary("");
    setLoading(false);
  };

  const handleUploadClick = () => {
    setIsUploadModalOpen(true);
  };

  const closeUploadModal = () => {
    setIsUploadModalOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast("Logged out");
    navigate("/login");
  };

  const getMeetingSummary = async (transcript) => {
    try {
      setLoading(true);
      setSummary("");

      const res = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript }),
      });

      const data = await res.json();

      if (res.ok) {
        setSummary(data.summary);
        toast.success("Summary generated!");

        // Save summary to MongoDB
        await fetch(`/api/meetings/${selectedMeeting._id}/summary`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ summary: data.summary }),
        });

        // Refresh meetings list (optional)
        const updated = await axios.get("/api/meetings");
        setMeetings(updated.data);
      } else {
        toast.error(data.error || "Failed to summarize.");
      }
    } catch (err) {
      console.error(err);
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const exportToPDF = (title, summary, transcript) => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text(title, 10, 10);

    doc.setFontSize(12);
    doc.text("Summary:", 10, 20);
    doc.text(summary || "No summary available", 10, 30);

    doc.addPage();
    doc.text("Transcript:", 10, 10);
    doc.setFontSize(10);
    doc.text(transcript || "No transcript", 10, 20);

    doc.save(`${title}_meeting_summary.pdf`);
  };

  const exportToMarkdown = (title, summary, transcript) => {
    const markdown = `# ${title}\n\n## Summary\n${summary}\n\n---\n\n## Transcript\n${transcript}`;
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${title}_summary.md`;
    link.click();
  };

  return (
    <div style={styles.container}>
      <img
        src="assets/illustration.svg"
        alt="Illustration"
        style={styles.illustration}
      />
      <h1 style={styles.header}>My Meetings</h1>

      {Array.isArray(meetings) && meetings.length === 0 ? (
        <p style={styles.empty}>No meetings yet. Upload one!</p>
      ) : (
        meetings.map((meeting) => (
          <MeetingCard
            key={meeting._id}
            meeting={meeting}
            onClick={openModal}
          />
        ))
      )}

      <MeetingModal
        isOpen={!!selectedMeeting}
        meeting={selectedMeeting}
        onClose={closeModal}
      >
        {selectedMeeting && (
          <div>
            {!selectedMeeting.summary && (
              <button
                style={{
                  background: "#000",
                  color: "#fff",
                  padding: "0.5rem 1rem",
                  borderRadius: "8px",
                  marginTop: "1rem",
                  cursor: "pointer",
                }}
                onClick={() =>
                  getMeetingSummary(
                    selectedMeeting.transcript ||
                      "The team discussed launching the new feature next week. Action items: John will QA the deployment, Lisa will prepare documentation."
                  )
                }
                disabled={loading}
              >
                {loading ? "Generating..." : "Generate Summary"}
              </button>
            )}

            {loading && (
              <p style={{ marginTop: "1rem", fontStyle: "italic" }}>
                Generating summary...
              </p>
            )}

            {(summary || selectedMeeting.summary) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={{
                  background: "#fff",
                  color: "#000",
                  padding: "1rem",
                  marginTop: "1rem",
                  borderRadius: "12px",
                  textAlign: "left",
                  boxShadow: "0 0 10px rgba(0,0,0,0.2)",
                }}
              >
                <h3 style={{ fontWeight: "bold", marginBottom: "0.5rem" }}>
                  AI Summary
                </h3>
                <pre style={{ whiteSpace: "pre-wrap" }}>
                  {summary || selectedMeeting.summary}
                </pre>

                <div
                  style={{ marginTop: "1rem", display: "flex", gap: "1rem" }}
                >
                  <button
                    onClick={() =>
                      exportToPDF(
                        selectedMeeting.title,
                        summary || selectedMeeting.summary,
                        selectedMeeting.transcript
                      )
                    }
                    style={{
                      padding: "0.4rem 0.8rem",
                      background: "#007bff",
                      color: "#fff",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                    }}
                  >
                    Export PDF
                  </button>
                  <button
                    onClick={() =>
                      exportToMarkdown(
                        selectedMeeting.title,
                        summary || selectedMeeting.summary,
                        selectedMeeting.transcript
                      )
                    }
                    style={{
                      padding: "0.4rem 0.8rem",
                      background: "#28a745",
                      color: "#fff",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                    }}
                  >
                    Export Markdown
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </MeetingModal>

      <FloatingUploadButton onClick={handleUploadClick} />

      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={closeUploadModal}
        userId={userId}
        onUploadComplete={(newMeeting) => {
          setMeetings((prev) => [newMeeting, ...prev]);
          closeUploadModal();
        }}
      />

      <button style={styles.logout} onClick={handleLogout}>
        Log Out
      </button>
    </div>
  );
}

export default Dashboard;
