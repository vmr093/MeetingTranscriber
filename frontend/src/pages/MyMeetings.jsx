import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import MeetingCard from "../components/MeetingCard";
import MeetingModal from "../components/MeetingModal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { MdSearch, MdDelete, MdSort, MdDateRange } from "react-icons/md";

const styles = {
  container: {
    padding: "6rem 1rem 5rem",
    maxWidth: "100%",
    margin: "0 auto",
    textAlign: "center",
    color: "#fff",
  },
  sectionHeading: {
    fontSize: "1.75rem",
    fontWeight: "bold",
    marginBottom: "1rem",
    color: "#fff",
  },
  meetingsContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1rem",
  },
  bottomBar: {
    position: "fixed",
    bottom: 0,
    left: 0,
    width: "100%",
    backgroundColor: "#1e1b4b",
    padding: "0.75rem 2rem",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    boxShadow: "0 -2px 8px rgba(0, 0, 0, 0.2)",
    borderTopLeftRadius: "20px",
    borderTopRightRadius: "20px",
    zIndex: 100,
  },
  iconButton: {
    fontSize: "1.75rem",
    color: "#fff",
    cursor: "pointer",
  },
  datepicker: {
    position: "absolute",
    bottom: "4rem",
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 1000,
  },
};

function MyMeetings() {
  const [meetings, setMeetings] = useState([]);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedForDelete, setSelectedForDelete] = useState([]);
  const [showDeleteMode, setShowDeleteMode] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/meetings`)
      .then((res) => setMeetings(res.data))
      .catch((err) => {
        console.error("Failed to fetch meetings", err);
        toast.error("Could not fetch meetings");
      });
  }, []);

  const handleToggleSelect = (id) => {
    setSelectedForDelete((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = async () => {
    if (selectedForDelete.length === 0)
      return toast.error("No meetings selected");
    try {
      await Promise.all(
        selectedForDelete.map((id) =>
          axios.delete(
            `${import.meta.env.VITE_API_BASE_URL}/api/meetings/${id}`
          )
        )
      );
      toast.success("Deleted successfully");
      setMeetings((prev) =>
        prev.filter((m) => !selectedForDelete.includes(m._id))
      );
      setSelectedForDelete([]);
      setShowDeleteMode(false);
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const handleToggleFavorite = async (id) => {
    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/api/meetings/${id}/favorite`
      );
      const updated = res.data;
      setMeetings((prev) =>
        prev.map((m) => (m._id === updated._id ? updated : m))
      );
    } catch (err) {
      toast.error("Failed to toggle favorite");
    }
  };

  const filteredMeetings = meetings
    .filter((m) => m.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((m) => {
      if (!selectedDate) return true;
      const meetingDate = new Date(m.uploadedAt);
      return meetingDate.toDateString() === selectedDate.toDateString();
    })
    .sort((a, b) => {
      if (sortOption === "title-az") return a.title.localeCompare(b.title);
      if (sortOption === "title-za") return b.title.localeCompare(a.title);
      if (sortOption === "oldest")
        return new Date(a.uploadedAt) - new Date(b.uploadedAt);
      return new Date(b.uploadedAt) - new Date(a.uploadedAt);
    });

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <h2 style={styles.sectionHeading}>My Meetings</h2>

        {filteredMeetings.length === 0 ? (
          <p style={{ opacity: 0.6 }}>No meetings found.</p>
        ) : (
          <div style={styles.meetingsContainer}>
            {filteredMeetings.map((meeting, index) => (
              <div
                key={meeting._id}
                style={{
                  display: "flex",
                  width: "90%",
                  maxWidth: "600px",
                  justifyContent: "center",
                }}
              >
                {showDeleteMode && (
                  <input
                    type="checkbox"
                    checked={selectedForDelete.includes(meeting._id)}
                    onChange={() => handleToggleSelect(meeting._id)}
                    style={{ marginRight: "0.75rem", transform: "scale(1.2)" }}
                  />
                )}
                <MeetingCard
                  meeting={meeting}
                  index={index}
                  onClick={setSelectedMeeting}
                  onToggleFavorite={handleToggleFavorite}
                />
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

      {/* Bottom Icon Bar */}
      <div style={styles.bottomBar}>
        <div title="Search">
          <MdSearch
            style={styles.iconButton}
            onClick={() => setSearchTerm(prompt("Search term:") || "")}
          />
        </div>
        <div title="Sort">
          <MdSort
            style={styles.iconButton}
            onClick={() =>
              setSortOption((prev) =>
                prev === "newest"
                  ? "title-az"
                  : prev === "title-az"
                  ? "title-za"
                  : "newest"
              )
            }
          />
        </div>
        <div title="Date Filter">
          <MdDateRange
            style={styles.iconButton}
            onClick={() => setShowDatePicker((prev) => !prev)}
          />
        </div>
        <div title={showDeleteMode ? "Cancel Delete" : "Delete"}>
          <MdDelete
            style={{
              ...styles.iconButton,
              color: showDeleteMode ? "#ff4d4f" : "#fff",
            }}
            onClick={() =>
              showDeleteMode ? handleDeleteSelected() : setShowDeleteMode(true)
            }
          />
        </div>
      </div>

      {showDatePicker && (
        <div style={styles.datepicker}>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => {
              setSelectedDate(date);
              setShowDatePicker(false);
            }}
            inline
          />
        </div>
      )}
    </>
  );
}

export default MyMeetings;
