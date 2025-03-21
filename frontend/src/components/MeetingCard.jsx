import { motion } from "framer-motion";

function MeetingCard({ meeting, onClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={styles.card}
      onClick={() => onClick(meeting)}
    >
      <h2 style={styles.title}>{meeting.title}</h2>
      <p style={styles.date}>{new Date(meeting.uploadedAt).toLocaleString()}</p>
      <p style={styles.preview}>
        {meeting.transcript
          ? meeting.transcript.slice(0, 80) + "..."
          : "No transcript yet."}
      </p>
    </motion.div>
  );
}

const styles = {
  card: {
    background: "#f9f9f9",
    borderRadius: "12px",
    padding: "1rem",
    marginBottom: "1rem",
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
    cursor: "pointer",
  },
  title: {
    margin: 0,
    fontSize: "1.2rem",
    color: "#222",
  },
  date: {
    fontSize: "0.9rem",
    color: "#666",
    marginBottom: "0.5rem",
  },
  preview: {
    fontSize: "1rem",
    color: "#444",
  },
};

export default MeetingCard;
