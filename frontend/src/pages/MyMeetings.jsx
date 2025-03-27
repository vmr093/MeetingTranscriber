import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import MeetingCard from "../components/MeetingCard";
import MeetingModal from "../components/MeetingModal";
import Navbar from "../components/Navbar";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


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
  controlsRow: {
    display: "flex",
    justifyContent: "center",
    gap: "1rem",
    flexWrap: "wrap",
    alignItems: "center",
    marginBottom: "1.5rem",
  },
  search: {
    padding: "0.4rem 1rem",
    borderRadius: "8px",
    border: "1px solid #444",
    background: "#111",
    color: "#fff",
    fontSize: "1rem",
  },
  dropdown: {
    padding: "0.2rem 1rem",
    borderRadius: "8px",
    border: "1px solid #444",
    background: "#111",
    color: "#fff",
    fontSize: "1rem",
    cursor: "pointer",
  },
  deleteToggle: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    color: "#fff",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    padding: "0.1rem 1rem",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "bold",
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
  meetingsContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "1rem 0",
    width: "100%",
  },
  empty: {
    color: "var(--text-muted)",
    fontStyle: "italic",
  },
};

function MyMeetings() {
  const [meetings, setMeetings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [selectedForDelete, setSelectedForDelete] = useState([]);
  const [showDeleteMode, setShowDeleteMode] = useState(false);
  const [sortOption, setSortOption] = useState("newest");
  const [selectedDate, setSelectedDate] = useState(null);


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

  const handleToggleFavorite = async (meetingId) => {
    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/api/meetings/${meetingId}/favorite`
      );
      const updated = res.data;
      setMeetings((prev) =>
        prev.map((m) => (m._id === updated._id ? updated : m))
      );
    } catch (err) {
      toast.error("Failed to toggle favorite");
      console.error(err);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedForDelete.length === 0) {
      toast.error("No meetings selected.");
      return;
    }

    try {
      await Promise.all(
        selectedForDelete.map((id) =>
          axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/meetings/${id}`)
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

  const filteredMeetings = meetings
    .filter((meeting) =>
      meeting.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOption === "newest") {
        return new Date(b.uploadedAt) - new Date(a.uploadedAt);
      } else if (sortOption === "oldest") {
        return new Date(a.uploadedAt) - new Date(b.uploadedAt);
      } else if (sortOption === "title-az") {
        return a.title.localeCompare(b.title);
      } else if (sortOption === "title-za") {
        return b.title.localeCompare(a.title);
      }
      return 0;
    });

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <h2 style={styles.sectionHeading}>My Meetings</h2>

        <div style={styles.controlsRow}>
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.search}
          />

          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            style={styles.dropdown}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="title-az">Title A-Z</option>
            <option value="title-za">Title Z-A</option>
          </select>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={styles.deleteToggle}
            onClick={() => setShowDeleteMode((prev) => !prev)}
          >
            {showDeleteMode ? "Cancel Delete" : "Delete Meetings"}
          </motion.button>
        </div>

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
            {filteredMeetings.map((meeting, index) => (
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
                  onClick={() =>
                    !showDeleteMode && setSelectedMeeting(meeting)
                  }
                >
                  <MeetingCard
                    meeting={meeting}
                    index={index}
                    onToggleFavorite={handleToggleFavorite}
                  />
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
