import { motion } from "framer-motion";

function MeetingCard({ meeting, onClick, index = 0 }) {
  const { title, uploadedAt } = meeting;
  const formattedDate = new Date(uploadedAt).toLocaleString();

  const styles = {
    card: {
      backgroundColor: "#2d3a69", // Set the box's background color
      color: "#fff",
      borderRadius: "10px",
      padding: "0.5rem",
      width: "250px",
      height: "40px",
      boxShadow: `
        0 4px 12px rgba(0, 0, 0, 0.3),
        0 0 10px rgba(0, 123, 255, 0.2)
      `,
      textAlign: "center",
      cursor: "pointer",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      margin: "0 auto",
    },
    title: {
      fontSize: "0.8rem",
      fontWeight: 600,
      marginBottom: "0.3rem",
      color: "#fff",
    },
    date: {
      fontSize: "0.7rem",
      color: "#ddd",
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
