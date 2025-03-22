import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Landing() {
  const styles = {
    page: {
      position: "relative",
      minHeight: "100vh",
      backgroundColor: "#1e1b4b",
      color: "#fff",
      fontFamily: "'Inter', sans-serif",
      scrollBehavior: "smooth",
      overflowX: "hidden",
      textAlign: "center",
      zIndex: 0,
    },
    backgroundGradient: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      background:
        "radial-gradient(circle at 20% 30%, rgba(0, 122, 255, 0.15), transparent 60%), radial-gradient(circle at 80% 70%, rgba(255, 255, 255, 0.05), transparent 60%)",
      zIndex: -1,
      pointerEvents: "none",
    },
    nav: {
      position: "fixed",
      top: 0,
      left: -15,
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
    waveTop: {
      display: "block",
      marginBottom: "-4rem",
      transform: "translateY(-60px)",
    },
    illustration: {
      width: "200px",
      maxWidth: "100%",
      marginBottom: "1rem",
    },
    heroTitle: {
      fontSize: "1.5rem",
      fontWeight: "900",
      marginBottom: "1rem",
      fontFamily: "'Orbitron', sans-serif",
      letterSpacing: "1px",
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
      borderRadius: "0.7rem",
      border: "none",
      cursor: "pointer",
    },
    secondaryButton: {
      backgroundColor: "#007bff",
      color: "#fff",
      fontWeight: "bold",
      padding: "0.5rem 1.5rem",
      borderRadius: "0.7rem",
      border: "none",
      cursor: "pointer",
    },
    illustratedFeatures: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
      gap: "3rem",
      alignItems: "center",
      justifyContent: "center",
    },
    featureBlock: {
      textAlign: "center",
    },
    featureIcon: {
      width: "120px",
      height: "120px",
      marginBottom: "1rem",
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

  const FeatureIllustration = ({ img, title, desc }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true, amount: 0.1 }}
      style={styles.featureBlock}
    >
      <img src={img} alt={title} style={styles.featureIcon} />
      <h3 style={styles.cardTitle}>{title}</h3>
      <p style={styles.cardText}>{desc}</p>
    </motion.div>
  );

  return (
    <div style={styles.page}>
      <div style={styles.backgroundGradient}></div>
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
      <section id="hero" style={styles.section}>
        <svg
          style={styles.waveTop}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
        >
          <path
            fill="#2e2a6a"
            fillOpacity="1"
            d="M0,160L48,165.3C96,171,192,181,288,181.3C384,181,480,171,576,149.3C672,128,768,96,864,85.3C960,75,1056,85,1152,117.3C1248,149,1344,203,1392,229.3L1440,256L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
          ></path>
        </svg>

        <motion.img
          src="/assets/illustration.svg"
          alt="Hero Illustration"
          style={styles.illustration}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />

        <motion.h1
          style={styles.heroTitle}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          MeetingTranscriber
        </motion.h1>

        <motion.p
          style={styles.paragraph}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.6 }}
        >
          Turn your conversations into clarity. Transcribe, summarize, and stay
          organized.
        </motion.p>

        <div style={styles.buttonRow}>
          <Link to="/login">
            <button style={styles.primaryButton}>Login</button>
          </Link>
          <Link to="/signup">
            <button style={styles.secondaryButton}>Sign Up</button>
          </Link>
        </div>
      </section>

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
        <div style={styles.illustratedFeatures}>
          <FeatureIllustration
            img="/assets/summaries.svg"
            title="AI-Powered Summaries"
            desc="Instantly generate concise summaries from transcripts."
          />
          <FeatureIllustration
            img="/assets/export.svg"
            title="Export to PDF/Markdown"
            desc="Download your notes in your preferred format."
          />
          <FeatureIllustration
            img="/assets/history.svg"
            title="Version History"
            desc="View and restore previous summaries."
          />
          <FeatureIllustration
            img="/assets/transcribe.svg"
            title="Auto Transcription"
            desc="Upload or record and get an instant transcript."
          />
          <FeatureIllustration
            img="/assets/ui.svg"
            title="Clean, Modern UI"
            desc="Beautifully styled dashboard with animations."
          />
          <FeatureIllustration
            img="/assets/secure.svg"
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
        <h2 style={styles.subheading}>About</h2>
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
        <h2 style={styles.subheading}>Contact</h2>
        <p style={styles.paragraph}>Have questions or feedback?</p>
        <a href="mailto:ranjha.viola@gmail.com" style={styles.link}>
          ranjha.viola@gmail.com
        </a>
      </motion.section>

      <footer style={styles.footer}>
        &copy; {new Date().getFullYear()} Made by Viola Ranjha. All rights
        reserved.
      </footer>
    </div>
  );
}
