import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function Landing() {
  const navigate = useNavigate();

  const styles = {
    container: {
      height: "100vh",
      backgroundColor: "#000",
      color: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      overflow: "hidden",
      padding: "0 1.5rem", // ✅
      boxSizing: "border-box",
    },
    content: {
      zIndex: 2,
      textAlign: "center",
      padding: "2rem",
      backdropFilter: "blur(12px)",
      backgroundColor: "rgba(0, 0, 0, 0.4)",
      borderRadius: "20px",
      boxShadow: "0 0 20px rgba(0, 123, 255, 0.4)",
    },
    heading: {
      fontSize: "2.5rem",
      fontWeight: "bold",
      marginBottom: "1rem",
    },
    subtext: {
      fontSize: "1.1rem",
      color: "#ccc",
      marginBottom: "2rem",
    },
    button: {
      backgroundColor: "white",
      color: "black",
      border: "none",
      padding: "0.8rem 1.6rem",
      borderRadius: "12px",
      fontSize: "1rem",
      fontWeight: "bold",
      cursor: "pointer",
      transition: "transform 0.2s ease",
    },
    bgIllustration: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      objectPosition: "center", // ✅ centers the focus
      zIndex: 0,
      opacity: 0.2,
    },
  };

  return (
    <div style={styles.container}>
      <img
        src="/assets/landing-illustration.png" 
        alt="Background Art"
        style={styles.bgIllustration}
      />

      <motion.div
        style={styles.content}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 style={styles.heading}>MeetingTranscriber</h1>
        <p style={styles.subtext}>
          AI-powered meeting notes. Modern. Secure. Mobile-first.
        </p>
        <button
          style={styles.button}
          onClick={() => navigate("/login")}
          onMouseEnter={(e) =>
            (e.currentTarget.style.transform = "scale(1.05)")
          }
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          Get Started
        </button>
      </motion.div>
    </div>
  );
}

export default Landing;
