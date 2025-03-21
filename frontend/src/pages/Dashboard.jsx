import { useEffect, useState } from "react";
import axios from "axios";
import MeetingCard from "../components/MeetingCard";
import MeetingModal from "../components/MeetingModal";
import FloatingUploadButton from "../components/FloatingUploadButton";
import UploadModal from "../components/UploadModal";

function Dashboard() {
  const [meetings, setMeetings] = useState([]);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Replace with actual MongoDB userId when login is in place
  const userId = "YOUR_USER_ID_HERE";

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
    setIsUploadModalOpen(true);
  };

  const closeUploadModal = () => {
    setIsUploadModalOpen(false);
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
