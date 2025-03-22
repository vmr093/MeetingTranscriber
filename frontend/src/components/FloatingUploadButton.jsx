function FloatingUploadButton({ onClick }) {
  return (
    <button style={styles.button} onClick={onClick}>
      ⬆️ Upload
    </button>
  );
}

const styles = {
  button: {
    position: "fixed",
    bottom: "1.5rem",
    right: "1.5rem",
    backgroundColor: "#4f46e5", // Bluish color
    color: "#fff",
    border: "none",
    padding: "0.8rem 1.2rem",
    borderRadius: "30px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
    fontSize: "1rem",
    zIndex: 999,
    cursor: "pointer",
    fontWeight: "bold",
    transition: "transform 0.2s ease",
  },
  buttonHover: {
    transform: "scale(1.05)",
  },
};

export default FloatingUploadButton;
