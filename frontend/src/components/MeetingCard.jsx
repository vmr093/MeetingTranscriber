import { motion } from "framer-motion";
import { MdForkRight, MdStar, MdStarBorder } from "react-icons/md";

const styles = {
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    backdropFilter: "blur(10px)",
    borderRadius: "12px",
    padding: "1rem 1.5rem",
    width: "70%",
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
    cursor: "pointer",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    color: "#fff",
  },
  title: {
    fontSize: "1.1rem",
    fontWeight: "bold",
  },
  date: {
    fontSize: "0.9rem",
    color: "#ccc",
  },
  leftSection: {
    display: "flex",
    flexDirection: "column",
    textAlign: "left",
  },
  favoriteButton: {
    background: "transparent",
    border: "none",
    color: "#FFD700",
    cursor: "pointer",
    fontSize: "1.5rem",
  },
};

function MeetingCard({ meeting, onClick, onToggleFavorite, index = 0 }) {
  const { title, uploadedAt, isFavorite } = meeting;
  const formattedDate = uploadedAt
    ? new Date(uploadedAt).toLocaleString()
    : "No date";

  return (
    <motion.div
      style={styles.card}
      onClick={() => onClick && onClick(meeting)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
    >
      <div style={styles.leftSection}>
        <div style={styles.title}>{title}</div>
        <div style={styles.date}>{formattedDate}</div>
      </div>
      {onToggleFavorite && (
        <button
          style={styles.favoriteButton}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(meeting._id);
          }}
          title={isFavorite ? "Unfavorite" : "Favorite"}
        >
          {isFavorite ? <MdStar /> : <MdStarBorder />}
        </button>
      )}
    </motion.div>
  );
}

export default MeetingCard;
