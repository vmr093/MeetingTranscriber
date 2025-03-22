import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const styles = {
    page: {
      height: "100vh",
      backgroundColor: "#000",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "0 1.5rem",
    },
    formContainer: {
      backgroundColor: "rgba(255, 255, 255, 0.05)",
      backdropFilter: "blur(15px)",
      WebkitBackdropFilter: "blur(15px)",
      padding: "2rem",
      borderRadius: "20px",
      width: "100%",
      maxWidth: "400px",
      boxShadow: "0 0 20px rgba(0, 123, 255, 0.4)",
      color: "#fff",
      textAlign: "center",
    },
    input: {
      width: "100%",
      padding: "0.8rem",
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
      padding: "0.8rem",
      backgroundColor: "#fff",
      color: "#000",
      borderRadius: "12px",
      fontWeight: "bold",
      fontSize: "1rem",
      marginBottom: "0.75rem",
      border: "none",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "0.5rem",
    },
    link: {
      color: "#6ea8fe",
      cursor: "pointer",
      textDecoration: "underline",
      fontSize: "0.9rem",
    },
    icon: {
      width: "20px",
      height: "20px",
    },
  };

  const handleSignup = async () => {
    if (!email || !password || !confirmPassword) {
      toast.error("Please fill out all fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Account created!");
        navigate("/login");
      } else {
        toast.error(data.message || "Signup failed");
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.formContainer}>
        <h2 style={{ marginBottom: "1.5rem" }}>Create an Account ✨</h2>

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

        <input
          type="password"
          placeholder="Confirm Password"
          style={styles.input}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button style={styles.button} onClick={handleSignup}>
          Sign Up
        </button>

        <button style={styles.altButton}>
          <img src="/assets/google-icon.svg" alt="Google" style={styles.icon} />
          Continue with Google
        </button>


        <p>
          Already have an account?{" "}
          <span style={styles.link} onClick={() => navigate("/login")}>
            Log In
          </span>
        </p>
      </div>
    </div>
  );
}

export default Signup;
