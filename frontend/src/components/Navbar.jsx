import { Link } from "react-router-dom";
import { FaCog, FaSignOutAlt } from "react-icons/fa"; // ⚙️ Settings & 🚪 Logout icons

const styles = {
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
    alignItems: "center",
    flexWrap: "wrap",
    boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
    gap: "2rem",
  },
  logo: {
    color: "#4eaaff",
    textDecoration: "none",
    fontWeight: "bold",
    fontSize: "1.2rem",
    marginRight: "2rem",
  },
  links: {
    display: "flex",
    gap: "1.5rem",
    alignItems: "center",
    flexWrap: "wrap",
  },
  link: {
    color: "#fff",
    textDecoration: "none",
    fontSize: "1rem",
    fontWeight: "bold",
    transition: "color 0.3s",
  },
  iconLink: {
    color: "#fff",
    fontSize: "1.2rem",
    cursor: "pointer",
    transition: "color 0.3s",
  },
};

function Navbar() {
  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.logo}>
        MeetingTranscriber
      </Link>

      <div style={styles.links}>
        <Link to="/landing" style={styles.link}>
          Home
        </Link>
        <Link to="/meetings" style={styles.link}>
          My Meetings
        </Link>
        <Link to="/favorites" style={styles.link}>
          Favorites
        </Link>

        {/* Icon + tooltip for Settings */}
        <Link to="/settings" style={styles.iconLink} title="Settings">
          <FaCog />
        </Link>

        {/* Icon + tooltip for Logout */}
        <Link to="/logout" style={styles.iconLink} title="Logout">
          <FaSignOutAlt />
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
