import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { signInWithPopup, auth, provider } from "../firebase";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const styles = {
    page: {
      height: "100vh",
      backgroundColor: "#000",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "0 1.5rem",
      position: "relative",
    },
    formContainer: {
      backgroundColor: "rgba(255, 255, 255, 0.05)",
      backdropFilter: "blur(15px)",
      WebkitBackdropFilter: "blur(15px)",
      padding: "2rem",
      borderRadius: "20px",
      width: "100%",
      maxWidth: "400px",
      boxShadow: "0 0 20px rgba(98, 62, 241, 0.89)",
      color: "#fff",
      textAlign: "center",
    },
    input: {
      width: "100%",
      padding: "0.3rem",
      marginBottom: "1rem",
      borderRadius: "12px",
      border: "2px solid black",
      backgroundColor: "#fff",
      color: "#000",
      fontSize: "1rem",
    },
    button: {
      width: "100%",
      padding: "0.8rem",
      backgroundColor: "black",
      color: "white",
      border: "none",
      borderRadius: "12px",
      fontWeight: "bold",
      fontSize: "1rem",
      cursor: "pointer",
      marginBottom: "1rem",
    },
    altButton: {
      width: "100%",
      padding: "0.3rem",
      backgroundColor: "#fff",
      color: "#000",
      borderRadius: "12px",
      fontWeight: "bold",
      fontSize: "0.7rem",
      marginBottom: "0.75rem",
      border: "none",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "0.5rem",
    },
    icon: {
      width: "20px",
      height: "20px",
    },
    link: {
      color: "#6ea8fe",
      cursor: "pointer",
      textDecoration: "underline",
      fontSize: "0.9rem",
    },
    homeButton: {
      position: "absolute",
      top: "1rem",
      left: "1rem",
      background: "transparent",
      border: "1px solid #444",
      color: "#fff",
      padding: "0.5rem 1rem",
      borderRadius: "10px",
      fontSize: "0.7rem",
      cursor: "pointer",
    },
  };

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Please fill out all fields");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        toast.success("Login successful!");
        navigate("/dashboard");
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const token = await user.getIdToken();

      localStorage.setItem("token", token);
      toast.success(`Welcome, ${user.displayName || "User"}!`);
      navigate("/dashboard");
    } catch (error) {
      console.error("Google login error:", error);
      toast.error("Google login failed");
    }
  };

  return (
    <div style={styles.page}>
      <button style={styles.homeButton} onClick={() => navigate("/")}>
        Home
      </button>

      <div style={styles.formContainer}>
        <h2 style={{ marginBottom: "1.5rem" }}>Welcome Back</h2>

        <input
          type="email"
          placeholder="Email"
          style={styles.input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          style={styles.input}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button style={styles.button} onClick={handleLogin}>
          Login
        </button>

        <button style={styles.altButton} onClick={handleGoogleLogin}>
          <img src="/assets/google-icon.svg" alt="Google" style={styles.icon} />
          Continue with Google
        </button>

        <p>
          Don’t have an account?{" "}
          <span style={styles.link} onClick={() => navigate("/signup")}>
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
