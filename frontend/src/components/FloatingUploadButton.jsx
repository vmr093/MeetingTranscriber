function FloatingUploadButton({ onClick }) {
  const styles = {
    button: {
      backgroundColor: "var(--primary-color)", // blue
      color: "white",
      border: "none",
      padding: "1rem",
      borderRadius: "16px",
      fontSize: "1rem",
      fontWeight: "bold",
      width: "100%",
      maxWidth: "360px", // same width as MeetingCard
      margin: "2rem auto 0", // centers it
      display: "block",
      cursor: "pointer",
      boxShadow: `
        0 4px 12px rgba(0, 0, 0, 0.3),
        0 0 10px rgba(0, 123, 255, 0.2)
        `,
      transition: "transform 0.2s ease",
      
    },
  };

  return (
    <button
      style={styles.button}
      onClick={onClick}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      
    >
      Record Meeting
    </button>
  );
}

export default FloatingUploadButton;
