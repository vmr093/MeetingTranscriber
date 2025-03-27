import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import MeetingCard from "../components/MeetingCard";
import MeetingModal from "../components/MeetingModal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  MdDelete,
  MdSearch,
  MdCalendarToday,
  MdSortByAlpha,
} from "react-icons/md";

const styles = {
  container: {
    padding: "6rem 1.5rem 5rem",
    maxWidth: "800px",
    margin: "0 auto",
    color: "#fff",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center", // ✅ ensures content centers horizontally
  },
  meetingsContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center", // ✅ centers cards horizontally
    justifyContent: "center",
    width: "100%",
    maxWidth: "600px", // ✅ optional, but helps keep layout tight
    margin: "0 auto", // ✅ centers container itself
    padding: "1rem 0",
  },

  empty: {
    color: "var(--text-muted)",
    fontStyle: "italic",
  },
  floatingBar: {
    position: "fixed",
    bottom: 0,
    width: "100%",
    background: "rgba(30, 27, 75, 0.95)",
    backdropFilter: "blur(10px)",
    display: "flex",
    justifyContent: "space-around",
    padding: "0.75rem 0",
    boxShadow: "0 -2px 6px rgba(0,0,0,0.3)",
    zIndex: 100,
  },
  iconButton: {
    background: "none",
    border: "none",
    color: "#fff",
    fontSize: "1.6rem",
    cursor: "pointer",
    position: "relative",
  },
  tooltip: {
    position: "absolute",
    bottom: "2.5rem",
    backgroundColor: "#000",
    color: "#fff",
    fontSize: "0.75rem",
    padding: "4px 8px",
    borderRadius: "4px",
    whiteSpace: "nowrap",
    zIndex: 999,
  },
  datepickerWrapper: {
    position: "absolute",
    bottom: "3rem",
  },
  confirmDelete: {
    marginTop: "1rem",
    display: "flex",
    gap: "1rem",
    justifyContent: "center",
  },
  confirmBtn: {
    backgroundColor: "#e53e3e",
    border: "none",
    padding: "0.4rem 1rem",
    borderRadius: "10px",
    fontWeight: "bold",
    cursor: "pointer",
    color: "#fff",
  },
  cancelBtn: {
    backgroundColor: "#4a5568",
    border: "none",
    padding: "0.4rem 1rem",
    borderRadius: "10px",
    fontWeight: "bold",
    cursor: "pointer",
    color: "#fff",
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
  const [showTooltip, setShowTooltip] = useState("");

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
      const meeting = meetings.find((m) => m._id === meetingId);
      const res = await axios.patch(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/api/meetings/${meetingId}/favorite`,
        {
          isFavorite: !meeting.isFavorite,
        }
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
          axios.delete(
            `${import.meta.env.VITE_API_BASE_URL}/api/meetings/${id}`
          )
        )
      );
      toast.success("Deleted selected meetings.");
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
    .filter((m) => m.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((m) =>
      selectedDate
        ? new Date(m.uploadedAt).toDateString() === selectedDate.toDateString()
        : true
    )
    .sort((a, b) => {
      if (sortOption === "title-az") return a.title.localeCompare(b.title);
      if (sortOption === "title-za") return b.title.localeCompare(a.title);
      return new Date(b.uploadedAt) - new Date(a.uploadedAt); // Default to newest
    });

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <h2 style={styles.sectionHeading}>My Meetings</h2>

        {filteredMeetings.length === 0 ? (
          <p style={styles.empty}>No meetings found.</p>
        ) : (
          <div style={styles.meetingsContainer}>
            {filteredMeetings.map((meeting, index) => (
              <div
                key={meeting._id}
                style={{
                  display: "flex",
                  justifyContent: "center", // ✅ centers the card horizontally
                  width: "100%",
                }}
              >
                {showDeleteMode && (
                  <input
                    type="checkbox"
                    checked={selectedForDelete.includes(meeting._id)}
                    onChange={() => handleToggleSelect(meeting._id)}
                    style={{ transform: "scale(1.2)", marginBottom: "0.5rem" }}
                  />
                )}
                <MeetingCard
                  meeting={meeting}
                  index={index}
                  onClick={() => !showDeleteMode && setSelectedMeeting(meeting)}
                  onToggleFavorite={handleToggleFavorite}
                />
              </div>
            ))}
          </div>
        )}

        {showDeleteMode && (
          <div style={styles.confirmDelete}>
            <button style={styles.confirmBtn} onClick={handleDeleteSelected}>
              Confirm Delete
            </button>
            <button
              style={styles.cancelBtn}
              onClick={() => {
                setShowDeleteMode(false);
                setSelectedForDelete([]);
              }}
            >
              Cancel
            </button>
          </div>
        )}

        <MeetingModal
          isOpen={!!selectedMeeting}
          meeting={selectedMeeting}
          onClose={() => setSelectedMeeting(null)}
        />
      </div>

      {/* Bottom Floating Controls */}
      <div style={styles.floatingBar}>
        <div
          style={styles.iconButton}
          onMouseEnter={() => setShowTooltip("search")}
          onMouseLeave={() => setShowTooltip("")}
        >
          <MdSearch />
          {showTooltip === "search" && (
            <div style={styles.tooltip}>
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  padding: "0.4rem 0.6rem",
                  borderRadius: "6px",
                  border: "1px solid #555",
                  backgroundColor: "#222",
                  color: "#fff",
                }}
              />
            </div>
          )}
        </div>

        <div
          style={styles.iconButton}
          onMouseEnter={() => setShowTooltip("delete")}
          onMouseLeave={() => setShowTooltip("")}
          onClick={() => setShowDeleteMode((prev) => !prev)}
        >
          <MdDelete />
          {showTooltip === "delete" && <div style={styles.tooltip}>Delete</div>}
        </div>

        <div
          style={styles.iconButton}
          onMouseEnter={() => setShowTooltip("calendar")}
          onMouseLeave={() => setShowTooltip("")}
        >
          <MdCalendarToday />
          {showTooltip === "calendar" && (
            <div style={styles.tooltip}>
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                dateFormat="MM/dd/yyyy"
                placeholderText="Filter by date"
                inline
              />
            </div>
          )}
        </div>

        <div
          style={styles.iconButton}
          onMouseEnter={() => setShowTooltip("sort")}
          onMouseLeave={() => setShowTooltip("")}
        >
          <MdSortByAlpha />
          {showTooltip === "sort" && (
            <div style={styles.tooltip}>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                style={{
                  padding: "0.3rem",
                  background: "#222",
                  color: "#fff",
                  borderRadius: "5px",
                }}
              >
                <option value="newest">Newest First</option>
                <option value="title-az">Title A-Z</option>
                <option value="title-za">Title Z-A</option>
              </select>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default MyMeetings;
