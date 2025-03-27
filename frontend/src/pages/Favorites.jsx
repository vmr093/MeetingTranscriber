import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import MeetingCard from "../components/MeetingCard";
import MeetingModal from "../components/MeetingModal";

const styles = {
  container: {
    padding: "6rem 1.5rem 2rem",
    maxWidth: "800px",
    margin: "0 auto",
    textAlign: "center",
    color: "#fff",
  },
  heading: {
    fontSize: "2rem",
    fontWeight: "bold",
    marginBottom: "1.5rem",
    color: "#fff",
  },
  empty: {
    color: "var(--text-muted)",
    fontStyle: "italic",
  },
  meetingsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    alignItems: "center",
    padding: "1rem 0",
  },
};

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [selectedMeeting, setSelectedMeeting] = useState(null);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/meetings`)
      .then((res) => {
        const filtered = res.data.filter((meeting) => meeting.isFavorite);
        setFavorites(filtered);
      })
      .catch((err) => {
        console.error("Failed to fetch favorites", err);
        toast.error("Could not load favorites");
      });
  }, []);

  const handleToggleFavorite = async (meetingId) => {
    try {
      const res = await axios.patch(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/api/meetings/${meetingId}/favorite`,
        { isFavorite: false }
      );
      setFavorites((prev) => prev.filter((m) => m._id !== meetingId));
    } catch (err) {
      toast.error("Failed to unfavorite meeting");
      console.error(err);
    }
  };

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <h2 style={styles.heading}>Favorite Meetings</h2>
        {favorites.length === 0 ? (
          <p style={styles.empty}>No favorite meetings yet.</p>
        ) : (
          <div style={styles.meetingsContainer}>
            {favorites.map((meeting, index) => (
              <MeetingCard
                key={meeting._id}
                meeting={meeting}
                index={index}
                onClick={() => setSelectedMeeting(meeting)}
                onToggleFavorite={handleToggleFavorite}
              />
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

export default Favorites;
