import { Link, useLocation } from "react-router-dom";

import {MdLogout, MdSettings, MdFavorite, MdHome, MdMeetingRoom, } from "react-icons/md";


const styles = {
  nav: {
    position: "fixed",
    top: 0,
    left: -20,
    width: "100%",
    backgroundColor: "#1e1b4b",
    zIndex: 50,
    padding: "1rem 1.5rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
  },
  logo: {
    color: "#4eaaff",
    textDecoration: "none",
    fontWeight: "bold",
    fontSize: "2rem",
    marginRight: "2rem",
    marginBottom: "0.5rem",
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
    display: "flex",
    alignItems: "center",
    gap: "0.4rem",
    transition: "color 0.3s",
  },
};

function Navbar() {
  const location = useLocation();

  const isDashboard = location.pathname === "/dashboard";
  const isMyMeetings = location.pathname === "/meetings";

  const linksForDashboard = [
    { to: "/", label: "Home" },
    { to: "/meetings", label: "My Meetings" },
    { to: "/favorites", label: "Favorites" },
    { to: "/settings", icon: <MdSettings /> },
    { to: "/logout", icon: <MdLogout /> },
  ];

  const linksForMyMeetings = [
    { to: "/", label: "Home" },
    { to: "/dashboard", label: "Dashboard" },
    { to: "/favorites", label: "Favorites" },
    { to: "/settings",  icon: <MdSettings /> },
    { to: "/logout", icon: <MdLogout /> },
  ];

  const links = isMyMeetings ? linksForMyMeetings : linksForDashboard;

  return (
    <nav style={styles.nav}>
      {/* <Link to="/" style={styles.logo}>
        MeetingTranscriber
      </Link> */}
      <div style={styles.links}>
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            style={styles.link}
            title={link.label || ""} // Adds tooltip only if label exists
          >
            {link.icon ? link.icon : link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}

export default Navbar;
