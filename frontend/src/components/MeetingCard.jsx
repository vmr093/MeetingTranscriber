import { motion } from "framer-motion";

function MeetingCard({ meeting, onClick, index = 0 }) {
  const { title, uploadedAt } = meeting;
  const formattedDate = new Date(uploadedAt).toLocaleString();

  const styles = {
    card: {
      backgroundColor: "#1c1c1e",
      color: "#fff",
      borderRadius: "16px",
      padding: "1rem",
      width: "90%",
      maxWidth: "360px",
      boxShadow: `
        0 4px 12px rgba(0, 0, 0, 0.3),
        0 0 10px rgba(0, 123, 255, 0.2)
      `,
      textAlign: "center",
      cursor: "pointer",
    },
    title: {
      fontSize: "1.1rem",
      fontWeight: 600,
      marginBottom: "0.3rem",
    },
    date: {
      fontSize: "0.85rem",
      color: "var(--text-muted)",
    },
  };

  return (
    <motion.div
      style={styles.card}
      onClick={() => onClick(meeting)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
    >
      <div style={styles.title}>{title}</div>
      <div style={styles.date}>{formattedDate}</div>
    </motion.div>
  );
}

export default MeetingCard;
