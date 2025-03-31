import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MdLogout,
  MdSettings,
  MdFavorite,
  MdHome,
  MdMeetingRoom,
} from "react-icons/md";

const styles = {
  nav: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    backgroundColor: "#1e1b4b",
    zIndex: 50,
    padding: "1rem 1.25rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "nowrap",
    boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
    overflow: "hidden",
  },
  logo: {
    color: "#4eaaff",
    textDecoration: "none",
    fontWeight: "bold",
    fontSize: "1.2rem",
  },
  links: {
    display: "flex",
    gap: "1rem",
    alignItems: "center",
    flex: 1,
    flexWrap: "nowrap",
  },
  link: {
    color: "#fff",
    textDecoration: "none",
    fontSize: "0.95rem",
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    gap: "0.3rem",
    transition: "all 0.3s ease",
    whiteSpace: "nowrap",
  },
  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: "0.4rem",
    flexShrink: 0,
    marginLeft: "1rem",
    paddingRight: "0.5rem", // ⬅️ Give the avatar breathing room
    overflow: "visible", // ⬅️ Prevent clipping
  },

  avatar: {
    width: "32px", // Slightly larger for clarity
    height: "32px",
    borderRadius: "50%", // Use 50% for perfect circle
    objectFit: "cover",
    border: "2px solid #4eaaff",
    marginRight: "1.25rem", // Add a little spacing from edge
  },

  name: {
    fontWeight: "bold",
    fontSize: "0.8rem",
    color: "#fff",
    maxWidth: "100px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
};

function Navbar() {
  const location = useLocation();

  const displayName = localStorage.getItem("displayName");
  const photoURL = localStorage.getItem("photoURL");

  const isDashboard = location.pathname === "/dashboard";
  const isMyMeetings = location.pathname === "/meetings";

  const linksForDashboard = [
    { to: "/", label: "Home" },
    { to: "/meetings", label: "Meetings" },
    { to: "/favorites", label: "Favorites" },
    { to: "/settings", icon: <MdSettings /> },
    { to: "/logout", icon: <MdLogout /> },
  ];

  const linksForMyMeetings = [
    { to: "/", label: "Home" },
    { to: "/dashboard", label: "Dash" },
    { to: "/favorites", label: "Favorites" },
    { to: "/settings", icon: <MdSettings /> },
    { to: "/logout", icon: <MdLogout /> },
  ];

  const links = isMyMeetings ? linksForMyMeetings : linksForDashboard;

  return (
    <nav style={styles.nav}>
      <div style={styles.links}>
        {links.map((link) => (
          <motion.div
            key={link.to}
            whileHover={{ y: -2, color: "#4eaaff" }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Link to={link.to} style={styles.link} title={link.label || ""}>
              {link.icon ? link.icon : link.label}
            </Link>
          </motion.div>
        ))}
      </div>

      {photoURL && (
        <div style={styles.userInfo}>
          {displayName && <span style={styles.name}>{displayName}</span>}
          <img src={photoURL} alt="Avatar" style={styles.avatar} />
        </div>
      )}
    </nav>
  );
}

export default Navbar;
