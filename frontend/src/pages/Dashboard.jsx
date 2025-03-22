import { useEffect, useState } from "react";
import axios from "axios";
import MeetingCard from "../components/MeetingCard";
import MeetingModal from "../components/MeetingModal";
import FloatingUploadButton from "../components/FloatingUploadButton";
import UploadModal from "../components/UploadModal";

const styles = {
  container: {
    padding: "1.5rem 1rem",
    maxWidth: "500px",
    margin: "0 auto",
    textAlign: "center",
  },
  header: {
    fontSize: "1.8rem",
    color: "var(--text-color)",
    marginBottom: "1.2rem",
  },
  empty: {
    color: "var(--text-muted)",
    fontStyle: "italic",
  },
  illustration: {
    width: "100%",
    maxWidth: "280px",
    margin: "0 auto 1.5rem",
    display: "block",
  },
  cardList: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "1rem",
    width: "100%",
  },
};

function Dashboard() {
  const [meetings, setMeetings] = useState([]);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const userId = "YOUR_USER_ID_HERE"; // Replace this with real auth later

  useEffect(() => {
    axios
      .get("/api/meetings")
      .then((res) => {
        console.log("Meetings API Response:", res.data);
        if (Array.isArray(res.data)) {
          setMeetings(res.data);
        } else {
          console.error("❌ API did not return an array:", res.data);
          setMeetings([]);
        }
      })
      .catch((err) => {
        console.error("❌ Failed to fetch meetings", err);
        setMeetings([]);
      });
  }, []);

  const openModal = (meeting) => setSelectedMeeting(meeting);
  const closeModal = () => setSelectedMeeting(null);
  const handleUploadClick = () => setIsUploadModalOpen(true);
  const closeUploadModal = () => setIsUploadModalOpen(false);

  return (
    <div style={styles.container}>
      <img
        src="/assets/illustration.svg"
        alt="Meetings Illustration"
        style={styles.illustration}
      />

      <h1 style={styles.header}>My Meetings</h1>

      {Array.isArray(meetings) && meetings.length === 0 ? (
        <p style={styles.empty}>No meetings yet. Upload one!</p>
      ) : (
        <div style={styles.cardList}>
          {meetings.map((meeting) => (
            <MeetingCard
              key={meeting._id}
              meeting={meeting}
              onClick={openModal}
            />
          ))}
        </div>
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

export default Dashboard;
