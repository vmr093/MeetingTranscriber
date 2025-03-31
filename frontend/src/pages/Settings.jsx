import { useState, useEffect } from "react";
import { getAuth, updateProfile } from "firebase/auth";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";

const styles = {
  container: {
    padding: "6rem 1.5rem 2rem",
    maxWidth: "400px",
    margin: "0 auto",
    textAlign: "center",
    color: "#fff",
  },
  heading: {
    fontSize: "2rem",
    fontWeight: "bold",
    marginBottom: "2rem",
  },
  avatar: {
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    border: "3px solid #4eaaff",
    objectFit: "cover",
    marginBottom: "1rem",
  },
  label: {
    display: "block",
    marginTop: "1.2rem",
    marginBottom: "0.5rem",
    fontWeight: "bold",
  },
  input: {
    width: "80%",
    padding: "0.7rem",
    fontSize: "1rem",
    borderRadius: "10px",
    border: "1px solid #333",
    marginBottom: "1rem",
    background: "#111",
    color: "#fff",
  },
  uploadButton: {
    backgroundColor: "#4eaaff",
    border: "none",
    padding: "0.6rem 1.2rem",
    borderRadius: "10px",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
    marginBottom: "0.5rem",
  },
  fileName: {
    fontStyle: "italic",
    fontSize: "0.9rem",
    marginBottom: "1rem",
    color: "#bbb",
  },
  button: {
    backgroundColor: "#38d9a9",
    border: "none",
    padding: "0.7rem 1.5rem",
    borderRadius: "10px",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "1rem",
  },

};

function Settings() {
  const auth = getAuth();
  const user = auth.currentUser;

  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [photoURL, setPhotoURL] = useState(user?.photoURL || "");
  const [previewImage, setPreviewImage] = useState(photoURL);
  const [useAltTheme, setUseAltTheme] = useState(
    localStorage.getItem("useAltTheme") === "true"
  );

  useEffect(() => {
    document.body.classList.toggle("alt-theme", useAltTheme);
    localStorage.setItem("useAltTheme", useAltTheme);
  }, [useAltTheme]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      await updateProfile(user, {
        displayName,
        photoURL: previewImage,
      });

      // 🔐 Save to localStorage for global access (e.g., Navbar)
      localStorage.setItem("displayName", displayName);
      localStorage.setItem("photoURL", previewImage);

      alert("Profile updated successfully");
    } catch (err) {
      console.error("Update error:", err);
      alert("Failed to update profile");
    }
  };

  return (
    <>
      <Navbar />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={styles.container}
      >
        <h2 style={styles.heading}>Settings</h2>



        {previewImage && (
          <img src={previewImage} alt="Avatar" style={styles.avatar} />
        )}

        <label style={styles.label}>Display Name</label>
        <input
          style={styles.input}
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />

        <label style={styles.label}>Profile Image</label>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={styles.uploadButton}
          onClick={() => document.getElementById("hiddenFileInput").click()}
        >
          Upload Image
        </motion.button>

        <input
          id="hiddenFileInput"
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleImageChange}
        />


        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={styles.button}
          onClick={handleUpdateProfile}
        >
          Save
        </motion.button>
      </motion.div>
    </>
  );
}

export default Settings;
