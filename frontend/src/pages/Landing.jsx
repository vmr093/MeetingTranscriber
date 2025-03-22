import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Landing() {
  const [activeSection, setActiveSection] = useState("hero");
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["hero", "features", "about", "contact"];
      for (let id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveSection(id);
            break;
          }
        }
      }
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const slideVariants = {
    left: {
      hidden: { opacity: 0, x: -50 },
      visible: { opacity: 1, x: 0 },
    },
    right: {
      hidden: { opacity: 0, x: 50 },
      visible: { opacity: 1, x: 0 },
    },
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollTopStyle = {
    position: "fixed",
    bottom: "2rem",
    right: "2rem",
    background: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "50%",
    width: "3rem",
    height: "3rem",
    fontSize: "1.5rem",
    cursor: "pointer",
    boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
    zIndex: 100,
  };

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
      animation: "moveGradient 20s ease infinite",
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
    navLink: (id) => ({
      color: activeSection === id ? "#4eaaff" : "white",
      textDecoration: "none",
      fontWeight: activeSection === id ? "bold" : "normal",
      borderBottom: activeSection === id ? "2px solid #4eaaff" : "none",
      paddingBottom: "0.2rem",
    }),
    section: {
      padding: "6rem 1rem",
      maxWidth: "1000px",
      margin: "0 auto",
    },
    illustration: {
      width: "250px",
      maxWidth: "100%",
      marginBottom: "5rem",
    },
    heroTitle: {
      fontSize: "1.5rem",
      fontWeight: "900",
      marginBottom: "1rem",
      fontFamily: "'Orbitron', sans-serif",
      letterSpacing: "1px",
    },
    subheading: {
      fontSize: "3rem",
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
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      color: "#fff",
      fontWeight: "bold",
      padding: "0.5rem 1.5rem",
      borderRadius: "1rem",
      border: "1px solid rgba(255, 255, 255, 0.3)",
      backdropFilter: "blur(10px)",
      WebkitBackdropFilter: "blur(10px)",
      boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
      cursor: "pointer",
      transition: "transform 0.2s ease, background 0.3s ease",
    },
    secondaryButton: {
      backgroundColor: "rgba(0, 123, 255, 0.1)",
      color: "#fff",
      fontWeight: "bold",
      padding: "0.5rem 1.5rem",
      borderRadius: "1rem",
      border: "1px solid rgba(0, 123, 255, 0.3)",
      backdropFilter: "blur(10px)",
      WebkitBackdropFilter: "blur(10px)",
      boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
      cursor: "pointer",
      transition: "transform 0.2s ease, background 0.3s ease",
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
      width: "150px",
      height: "150px",
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

  return (
    <div style={styles.page}>
      <style>
        {`
          @keyframes moveGradient {
            0% { background-position: 0% 0%; }
            50% { background-position: 100% 100%; }
            100% { background-position: 0% 0%; }
          }
          @keyframes waveAnimation {
            0% { transform: translateY(60px); }
            100% { transform: translateY(65px); }
          }
        `}
      </style>

      <div style={styles.backgroundGradient}></div>

      <nav style={styles.nav}>
        <a href="#features" style={styles.navLink("features")}>
          Features
        </a>
        <a href="#about" style={styles.navLink("about")}>
          About
        </a>
        <a href="#contact" style={styles.navLink("contact")}>
          Contact
        </a>
      </nav>

      <section id="hero" style={styles.section}>
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
            <motion.button
              whileHover={{ scale: 1.05 }}
              style={styles.primaryButton}
            >
              Login
            </motion.button>
          </Link>
          <Link to="/signup">
            <motion.button
              whileHover={{ scale: 1.05 }}
              style={styles.secondaryButton}
            >
              Sign Up
            </motion.button>
          </Link>
        </div>
      </section>

      <motion.section
        id="features"
        style={styles.section}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={slideVariants.left}
      >
        <h2 style={styles.subheading}>Features</h2>

        <div style={styles.featureBlock}>
          <img
            src="/assets/ui.svg"
            alt="Transcription"
            style={styles.featureIcon}
          />
          <h3 style={styles.cardTitle}>Intuitive Design</h3>
          <p style={styles.cardText}>
            Enjoy a modern interface optimized for ease of use.
          </p>
        </div>

        <div style={styles.illustratedFeatures}>
          {[
            {
              src: "/assets/transcribe.svg",
              alt: "Transcription",
              title: "Accurate Transcription",
              text: "Turn voice into text with AI-powered precision.",
            },
            {
              src: "/assets/summaries.svg",
              alt: "Summarize",
              title: "AI Summaries",
              text: "Generate smart summaries with one click.",
            },
            {
              src: "/assets/export.svg",
              alt: "Export",
              title: "Export Options",
              text: "Download your notes in PDF or Markdown format.",
            },
            {
              src: "/assets/history.svg",
              alt: "History",
              title: "Version History",
              text: "Revisit previous versions of your summaries anytime.",
            },
            {
              src: "/assets/secure.svg",
              alt: "Security",
              title: "End-to-End Security",
              text: "Your meeting data is encrypted and secure.",
            },
            {
              src: "/assets/ui.svg",
              alt: "Intuitive UI",
              title: "Intuitive Design",
              text: "Enjoy a modern interface optimized for ease of use.",
            },
          ].map((feature, idx) => (
            <motion.div
              key={feature.title}
              style={styles.featureBlock}
              initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
            >
              <motion.img
                src={feature.src}
                alt={feature.alt}
                style={styles.featureIcon}
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              />
              <h3 style={styles.cardTitle}>{feature.title}</h3>
              <p style={styles.cardText}>{feature.text}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <motion.section
        id="about"
        style={{ ...styles.section, backgroundColor: "#2e2a6a" }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={slideVariants.right}
      >
        <h2 style={styles.subheading}>About</h2>
        <p style={styles.paragraph}>
          MeetingTranscriber helps you capture, summarize, and revisit meetings
          like never before. Built for clarity and speed.
        </p>
      </motion.section>

      <motion.section
        id="contact"
        style={styles.section}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={slideVariants.left}
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

      {showScrollTop && (
        <motion.button
          onClick={scrollToTop}
          style={scrollTopStyle}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          ↑
        </motion.button>
      )}
    </div>
  );
}
