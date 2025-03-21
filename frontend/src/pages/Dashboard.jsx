import { useEffect, useState } from "react";
import axios from "axios";
import MeetingCard from "../components/MeetingCard";
import MeetingModal from "../components/MeetingModal";
import FloatingUploadButton from "../components/FloatingUploadButton";

function Dashboard() {
  const [meetings, setMeetings] = useState([]);
  const [selectedMeeting, setSelectedMeeting] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/meetings")
      .then((res) => setMeetings(res.data))
      .catch((err) => console.error("Failed to fetch meetings", err));
  }, []);

  const openModal = (meeting) => {
    setSelectedMeeting(meeting);
  };

  const closeModal = () => {
    setSelectedMeeting(null);
  };

  const handleUploadClick = () => {
    alert("Upload button clicked!"); // 🔄 Replace with modal or upload action later
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>📅 My Meetings</h1>

      {meetings.length === 0 ? (
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

      {/* Floating Upload Button */}
      <FloatingUploadButton onClick={handleUploadClick} />
    </div>
  );
}

const styles = {
  container: {
    padding: "1rem",
    maxWidth: "600px",
    margin: "0 auto",
    position: "relative",
  },
  header: {
    fontSize: "1.8rem",
    color: "#333",
    marginBottom: "1rem",
  },
  empty: {
    color: "#888",
    fontStyle: "italic",
  },
};

export default Dashboard;
