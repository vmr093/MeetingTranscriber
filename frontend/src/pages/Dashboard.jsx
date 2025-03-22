import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
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
    fontSize: "1.8rem",
    marginBottom: "1rem",
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
};

function Dashboard() {
  const [meetings, setMeetings] = useState([]);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
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
  };

  const closeModal = () => {
    setSelectedMeeting(null);
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

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>📅 My Meetings</h1>

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
      />

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
