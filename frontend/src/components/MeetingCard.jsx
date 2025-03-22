function MeetingCard({ meeting, onClick }) {
  const { title, uploadedAt } = meeting;

  const formattedDate = new Date(uploadedAt).toLocaleString();

  const styles = {
    card: {
      backgroundColor: "#1c1c1e",
      color: "#fff",
      borderRadius: "16px",
      padding: "1rem",
      width: "100%",
      maxWidth: "360px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
      textAlign: "center",
      cursor: "pointer",
      transition: "transform 0.2s ease",
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
    <div
      style={styles.card}
      onClick={() => onClick(meeting)}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      <div style={styles.title}>{title}</div>
      <div style={styles.date}>{formattedDate}</div>
    </div>
  );
}

export default MeetingCard;
