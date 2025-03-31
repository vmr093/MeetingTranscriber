import { Link, useLocation, useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import toast from "react-hot-toast";
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
    padding: "1rem 1.5rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
  },
  logo: {
    color: "#4eaaff",
    textDecoration: "none",
    fontWeight: "bold",
    fontSize: "1.2rem",
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
  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    marginLeft: "1.5rem",
  },
  avatar: {
    width: "35px",
    height: "35px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "2px solid #4eaaff",
  },
  name: {
    fontWeight: "bold",
    fontSize: "0.95rem",
    color: "#fff",
  },
};

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const displayName = localStorage.getItem("displayName");
  const photoURL = localStorage.getItem("photoURL");

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
    { to: "/settings", icon: <MdSettings /> },
    { to: "/logout", icon: <MdLogout /> },
  ];

  const links = isMyMeetings ? linksForMyMeetings : linksForDashboard;

  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      localStorage.removeItem("token");
      localStorage.removeItem("displayName");
      localStorage.removeItem("photoURL");
      toast.success("Logged out!");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed");
    }
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.links}>
        {links.map((link) =>
          link.to === "/logout" ? (
            <button
              key={link.to}
              onClick={handleLogout}
              style={{
                ...styles.link,
                background: "transparent",
                border: "none",
              }}
              title="Logout"
            >
              {link.icon}
            </button>
          ) : (
            <Link
              key={link.to}
              to={link.to}
              style={styles.link}
              title={link.label || ""}
            >
              {link.icon ? link.icon : link.label}
            </Link>
          )
        )}
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
