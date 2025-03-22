import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div style={styles.page}>
      {/* Sticky Nav */}
      <nav style={styles.nav}>
        <a href="#features" style={styles.navLink}>
          Features
        </a>
        <a href="#about" style={styles.navLink}>
          About
        </a>
        <a href="#contact" style={styles.navLink}>
          Contact
        </a>
      </nav>

      {/* Hero Section */}
      <motion.section
        id="hero"
        style={styles.section}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, amount: 0.2 }}
      >
        <img
          src="/assets/illustration.svg"
          alt="Hero Illustration"
          style={styles.illustration}
        />
        <h1 style={styles.heading}>MeetingTranscriber</h1>
        <p style={styles.paragraph}>
          Turn your conversations into clarity. Transcribe, summarize, and stay
          organized.
        </p>
        <div style={styles.buttonRow}>
          <Link to="/login">
            <button style={styles.primaryButton}>Login</button>
          </Link>
          <Link to="/signup">
            <button style={styles.secondaryButton}>Sign Up</button>
          </Link>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        id="features"
        style={styles.section}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, amount: 0.2 }}
      >
        <h2 style={styles.subheading}>Features</h2>
        <div style={styles.cardGrid}>
          <FeatureCard
            title="AI-Powered Summaries"
            desc="Instantly generate concise summaries from transcripts."
          />
          <FeatureCard
            title="Export to PDF/Markdown"
            desc="Download your notes in your preferred format."
          />
          <FeatureCard
            title="Version History"
            desc="View and restore previous summaries."
          />
          <FeatureCard
            title="Auto Transcription"
            desc="Upload or record and get an instant transcript."
          />
          <FeatureCard
            title="Clean, Modern UI"
            desc="Beautifully styled dashboard with animations."
          />
          <FeatureCard
            title="Secure Login"
            desc="Sign in with Google or Apple to access your meetings."
          />
        </div>
      </motion.section>

      {/* About Section */}
      <motion.section
        id="about"
        style={{ ...styles.section, backgroundColor: "#2e2a6a" }}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, amount: 0.2 }}
      >
        <h2 style={styles.subheading}>About MeetingTranscriber</h2>
        <p style={styles.paragraph}>
          Built to save time and enhance productivity, MeetingTranscriber uses
          AI to turn your spoken meetings into actionable insights. Whether
          you're a solo founder, team leader, or freelancer, it's the easiest
          way to stay on top of every conversation.
        </p>
      </motion.section>

      {/* Contact Section */}
      <motion.section
        id="contact"
        style={styles.section}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, amount: 0.2 }}
      >
        <h2 style={styles.subheading}>Contact Us</h2>
        <p style={styles.paragraph}>Have questions or feedback?</p>
        <a href="mailto:hello@meetingtranscriber.ai" style={styles.link}>
          hello@meetingtranscriber.ai
        </a>
      </motion.section>

      <footer style={styles.footer}>
        &copy; {new Date().getFullYear()} MeetingTranscriber. All rights
        reserved.
      </footer>
    </div>
  );
}

function FeatureCard({ title, desc }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true, amount: 0.1 }}
      style={styles.card}
    >
      <h3 style={styles.cardTitle}>{title}</h3>
      <p style={styles.cardText}>{desc}</p>
    </motion.div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#1e1b4b",
    color: "#fff",
    fontFamily: "'Poppins', sans-serif",
    scrollBehavior: "smooth",
    overflowX: "hidden",
    textAlign: "center",
  },
  nav: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    backgroundColor: "#1e1b4b",
    zIndex: 50,
    padding: "1rem",
    display: "flex",
    justifyContent: "center",
    gap: "1.5rem",
    fontSize: "16px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
  },
  navLink: {
    color: "white",
    textDecoration: "none",
  },
  section: {
    padding: "6rem 1rem",
    maxWidth: "1000px",
    margin: "0 auto",
  },
  illustration: {
    width: "200px",
    maxWidth: "100%",
    marginBottom: "1rem",
  },
  heading: {
    fontSize: "2rem",
    fontWeight: "bold",
    marginBottom: "1rem",
  },
  subheading: {
    fontSize: "2rem",
    fontWeight: "bold",
    marginBottom: "2rem",
  },
  paragraph: {
    fontSize: "1rem",
    color: "#ccc",
    maxWidth: "600px",
    margin: "0 auto 1.5rem",
    lineHeight: "1.6",
  },
  buttonRow: {
    display: "flex",
    gap: "1rem",
    justifyContent: "center",
    flexWrap: "wrap",
    marginTop: "1rem",
  },
  primaryButton: {
    backgroundColor: "#fff",
    color: "#000",
    fontWeight: "bold",
    padding: "0.5rem 1.5rem",
    borderRadius: "1rem",
    border: "none",
    cursor: "pointer",
  },
  secondaryButton: {
    backgroundColor: "#007bff",
    color: "#fff",
    fontWeight: "bold",
    padding: "0.5rem 1.5rem",
    borderRadius: "1rem",
    border: "none",
    cursor: "pointer",
  },
  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "2rem",
  },
  card: {
    backgroundColor: "#322f6d",
    padding: "1.5rem",
    borderRadius: "1rem",
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
    textAlign: "left",
  },
  cardTitle: {
    fontSize: "1.25rem",
    fontWeight: "bold",
    marginBottom: "0.5rem",
  },
  cardText: {
    fontSize: "1rem",
    color: "#ccc",
  },
  link: {
    color: "#4eaaff",
    textDecoration: "underline",
    fontSize: "1rem",
  },
  footer: {
    padding: "2rem 1rem",
    textAlign: "center",
    color: "#aaa",
    fontSize: "0.875rem",
  },
};
