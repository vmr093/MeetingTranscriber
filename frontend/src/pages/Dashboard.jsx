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

const themeColors = ["#2d3a69", "#1e3a8a", "#2a4365", "#3c366b", "#1a365d"];

const styles = {
  container: {
    padding: "1.5rem",
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
      "radial-gradient(circle at 40% 30%, rgba(0, 123, 255, 0.2), transparent 60%),\n       radial-gradient(circle at 70% 80%, rgba(255, 255, 255, 0.08), transparent 60%)",
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

  header: {
    fontSize: "2.5rem",
    marginBottom: "1rem",
  },
  search: {
    marginBottom: "1.5rem",
    padding: "0.2rem 1rem",
    borderRadius: "8px",
    border: "1px solid #444",
    width: "50%",
    maxWidth: "300px",
    background: "#111",
    color: "#fff",
    fontSize: "1rem",
  },
  meetingsContainer: {
    display: "flex", // Ensure flexbox is enabled
    flexDirection: "column", // Stack cards vertically
    gap: "1rem", // Add spacing between cards
    alignItems: "center", // Center cards horizontally (optional)
    padding: "1rem",
    marginBottom: "7rem",
  },
  empty: {
    color: "var(--text-muted)",
    fontStyle: "italic",
  },
  logout: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    color: "#fff",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    padding: "0.3rem 1rem",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "bold",
    marginTop: "1rem",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    transition: "all 0.3s ease",
  },
  recordButton: {
    width: "56px",
    height: "56px",
    borderRadius: "50%",
    backgroundColor: "#ff4d4d",
    border: "3px solid #cc0000",
    margin: "1.5rem auto",
    cursor: "pointer",
    boxShadow: "0 0 12px rgba(255, 77, 77, 0.5)",
  },
};

function Dashboard() {
  const [meetings, setMeetings] = useState([]);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const userId = "YOUR_USER_ID_HERE";

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_BASE_URL}/api/meetings`) // Use environment variable
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
    setSummary("");
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

  const filteredMeetings = meetings.filter((meeting) =>
    meeting.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <style>{`
        @keyframes pulseGradient {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }
      `}</style>

      <div style={styles.backgroundGradient}></div>
      <div style={styles.darkPanel}></div>

      <div style={styles.container}>
        <h1 style={styles.header}>My Meetings</h1>

        <input
          type="text"
          placeholder="Search meetings..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.search}
        />

        {filteredMeetings.length === 0 ? (
          <p style={styles.empty}>No meetings found.</p>
        ) : (
          <div style={styles.meetingsContainer}>
            {filteredMeetings.map((meeting, index) => (
              <MeetingCard key={meeting._id} meeting={meeting} onClick={openModal} />
            ))}
          </div>
        )}

        <div
          style={styles.recordButton}
          title="Record"
          onClick={() => toast("Recording feature coming soon!")}
        />

        <MeetingModal
          isOpen={!!selectedMeeting}
          meeting={selectedMeeting}
          onClose={closeModal}
        >
          {selectedMeeting && (
            <>
              {(!selectedMeeting.summary || selectedMeeting.summary === "") && (
                <button
                  onClick={() => toast("Summary generation coming soon!")}
                  style={{
                    background: "#000",
                    color: "#fff",
                    padding: "0.5rem 1rem",
                    borderRadius: "8px",
                    marginTop: "1rem",
                    cursor: "pointer",
                  }}
                >
                  Generate Summary
                </button>
              )}
            </>
          )}
        </MeetingModal>

        <UploadModal
          isOpen={isUploadModalOpen}
          onClose={closeUploadModal}
          userId={userId}
          onUploadComplete={(newMeeting) => {
            setMeetings((prev) => [newMeeting, ...prev]);
            closeUploadModal();
          }}
        />

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 200 }}
          style={styles.logout}
          onClick={handleLogout}
        >
          Log Out
        </motion.button>
      </div>
    </>
  );
}

export default Dashboard;
