import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import MeetingCard from "../components/MeetingCard";
import MeetingModal from "../components/MeetingModal";
import Navbar from "../components/Navbar";

const styles = {
  container: {
    padding: "6rem 1.5rem 2rem",
    maxWidth: "800px",
    margin: "0 auto",
    textAlign: "center",
    color: "#fff",
  },
  sectionHeading: {
    fontSize: "2rem",
    fontWeight: "bold",
    marginBottom: "1.5rem",
    color: "#fff",
  },
  search: {
    display: "block",
    margin: "0 auto 1rem",
    padding: "0.1rem 1rem",
    borderRadius: "8px",
    border: "1px solid #444",
    width: "80%",
    maxWidth: "150px",
    background: "#111",
    color: "#fff",
    fontSize: "1rem",
  },
  meetingsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    alignItems: "center",
    padding: "1rem 0",
  },
  empty: {
    color: "var(--text-muted)",
    fontStyle: "italic",
  },
  deleteToggle: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    color: "#fff",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    padding: "0.4rem 1.2rem",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "bold",
    marginBottom: "1rem",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    transition: "all 0.3s ease",
  },
  confirmDelete: {
    backgroundColor: "rgba(220, 53, 69, 0.9)",
    color: "#fff",
    padding: "0.5rem 1.2rem",
    border: "none",
    borderRadius: "12px",
    fontWeight: "bold",
    marginBottom: "1.5rem",
    cursor: "pointer",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
  },
};

function MyMeetings() {
  const [meetings, setMeetings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [selectedForDelete, setSelectedForDelete] = useState([]);
  const [showDeleteMode, setShowDeleteMode] = useState(false);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/meetings`)
      .then((res) => setMeetings(res.data))
      .catch((err) => {
        console.error("Failed to fetch meetings", err);
        toast.error("Could not fetch meetings");
      });
  }, []);

  const handleToggleSelect = (meetingId) => {
    setSelectedForDelete((prev) =>
      prev.includes(meetingId)
        ? prev.filter((id) => id !== meetingId)
        : [...prev, meetingId]
    );
  };

  const handleDeleteSelected = async () => {
    if (selectedForDelete.length === 0) {
      toast.error("No meetings selected.");
      return;
    }

    try {
      await Promise.all(
        selectedForDelete.map((id) =>
          axios.delete(
            `${import.meta.env.VITE_API_BASE_URL}/api/meetings/${id}`
          )
        )
      );
      toast.success("Selected meetings deleted.");
      setMeetings((prev) =>
        prev.filter((m) => !selectedForDelete.includes(m._id))
      );
      setSelectedForDelete([]);
      setShowDeleteMode(false);
    } catch (error) {
      console.error("Batch delete failed:", error);
      toast.error("Error deleting meetings.");
    }
  };

  const filteredMeetings = meetings.filter((meeting) =>
    meeting.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Navbar /> {/* Navbar stays at the top */}
      <div style={styles.container}>
        <h2 style={styles.sectionHeading}>My Meetings</h2>

        <input
          type="text"
          placeholder="Search meetings..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.search}
        />

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={styles.deleteToggle}
          onClick={() => setShowDeleteMode((prev) => !prev)}
        >
          {showDeleteMode ? "Cancel Delete" : "Delete Meetings"}
        </motion.button>

        {showDeleteMode && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={styles.confirmDelete}
            onClick={handleDeleteSelected}
          >
            Confirm Delete ({selectedForDelete.length})
          </motion.button>
        )}

        {filteredMeetings.length === 0 ? (
          <p style={styles.empty}>No meetings found.</p>
        ) : (
          <div style={styles.meetingsContainer}>
            {filteredMeetings.map((meeting) => (
              <div
                key={meeting._id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  gap: "0.5rem",
                }}
              >
                {showDeleteMode && (
                  <input
                    type="checkbox"
                    checked={selectedForDelete.includes(meeting._id)}
                    onChange={() => handleToggleSelect(meeting._id)}
                    style={{ transform: "scale(1.3)", cursor: "pointer" }}
                  />
                )}
                <div
                  style={{ flex: 1 }}
                  onClick={() => !showDeleteMode && setSelectedMeeting(meeting)}
                >
                  <MeetingCard meeting={meeting} />
                </div>
              </div>
            ))}
          </div>
        )}

        <MeetingModal
          isOpen={!!selectedMeeting}
          meeting={selectedMeeting}
          onClose={() => setSelectedMeeting(null)}
        />
      </div>
    </>
  );
}

export default MyMeetings;
