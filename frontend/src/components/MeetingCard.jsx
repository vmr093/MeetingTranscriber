import { motion } from "framer-motion";
import { MdStar, MdStarBorder } from "react-icons/md";

const styles = {
  card: {
    backgroundColor: "rgba(13, 51, 101, 0.75)",
    borderRadius: "20px",
    padding: "1rem",
    width: "100%",
    maxWidth: "270px",
    boxShadow: "0 4px 12px rgba(0, 123, 255, 0.15)",
    cursor: "pointer",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    color: "#fff",
    transition: "box-shadow 0.3s ease",
  },
  leftSection: {
    display: "flex",
    flexDirection: "column",
    textAlign: "left",
  },
  title: {
    fontSize: "1rem",
    fontWeight: "bold",
    marginBottom: "0.25rem",
  },
  date: {
    fontSize: "0.85rem",
    color: "#aaa",
  },
  favoriteButton: {
    background: "transparent",
    border: "none",
    color: "#FFD700",
    cursor: "pointer",
    fontSize: "1.4rem",
    padding: "0.3rem",
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
      transition={{ duration: 0.3, delay: index * 0.08 }}
      whileHover={{
        scale: 1.03,
        boxShadow: "0 6px 16px rgba(0, 123, 255, 0.2)",
      }}
      whileTap={{ scale: 0.97 }}
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
