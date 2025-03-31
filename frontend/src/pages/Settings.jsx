import { useState, useEffect } from "react";
import {
  getAuth,
  updateProfile,
  updatePassword,
  onAuthStateChanged,
} from "firebase/auth";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import { MdPerson, MdLock } from "react-icons/md";

const styles = {
  container: {
    padding: "6rem 1rem 2rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "start",
  },
  card: {
    background: "rgba(255, 255, 255, 0.05)",
    backdropFilter: "blur(15px)",
    WebkitBackdropFilter: "blur(15px)",
    borderRadius: "20px",
    boxShadow: "0 0 20px rgba(78, 170, 255, 0.25)",
    width: "100%",
    maxWidth: "800px",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  tabs: {
    display: "flex",
    justifyContent: "space-around",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(0, 0, 0, 0.2)",
  },
  tab: (active) => ({
    flex: 1,
    padding: "1rem",
    cursor: "pointer",
    textAlign: "center",
    fontWeight: "bold",
    backgroundColor: active ? "rgba(255,255,255,0.1)" : "transparent",
    borderBottom: active ? "3px solid #4eaaff" : "none",
    transition: "0.3s",
  }),
  content: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    padding: "2rem",
    gap: "2rem",
  },
  section: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    fontWeight: "bold",
    marginBottom: "0.5rem",
  },
  input: {
    padding: "0.7rem",
    fontSize: "1rem",
    borderRadius: "10px",
    border: "1px solid #333",
    marginBottom: "1rem",
    background: "#111",
    color: "#fff",
  },
  avatar: {
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    border: "3px solid #4eaaff",
    objectFit: "cover",
    marginBottom: "1rem",
  },
  uploadButton: {
    backgroundColor: "#4eaaff",
    border: "none",
    padding: "0.6rem 1rem",
    borderRadius: "8px",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
    marginBottom: "1rem",
    fontSize: "0.9rem",
  },
  saveButton: {
    backgroundColor: "#38d9a9",
    border: "none",
    padding: "0.5rem 1rem",
    borderRadius: "8px",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "0.9rem",
    marginTop: "1rem",
  },
  mobileStack: {
    gridTemplateColumns: "1fr",
  },
};

function Settings() {
  const [activeTab, setActiveTab] = useState("profile");
  const [displayName, setDisplayName] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setDisplayName(user.displayName || "");
        setPhotoURL(user.photoURL || "");
        setPreviewImage(user.photoURL || "");
      }
    });
    return () => unsubscribe();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return toast.error("Invalid file");
    if (file.size > 2 * 1024 * 1024) return toast.error("Max size: 2MB");
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => setPreviewImage(reader.result);
    reader.readAsDataURL(file);
  };

  const handleUpdateProfile = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return toast.error("Not authenticated");

    let uploadedUrl = photoURL;
    if (imageFile) {
      const formData = new FormData();
      formData.append("avatar", imageFile);
      formData.append("userId", user.uid);
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/users/upload-avatar`,
          {
            method: "POST",
            body: formData,
          }
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Upload failed");
        uploadedUrl = data.url;
        setPhotoURL(uploadedUrl);
        localStorage.setItem("photoURL", uploadedUrl);
      } catch (err) {
        console.error(err);
        toast.error("Avatar upload failed");
        return;
      }
    }

    try {
      await updateProfile(user, {
        displayName,
        photoURL: uploadedUrl,
      });
      localStorage.setItem("displayName", displayName);
      toast.success("Profile updated");
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
    }

    if (newPassword || confirmPassword) {
      if (newPassword !== confirmPassword)
        return toast.error("Passwords do not match");
      if (newPassword.length < 6)
        return toast.error("Password must be 6+ characters");
      try {
        await updatePassword(user, newPassword);
        toast.success("Password updated");
        setNewPassword("");
        setConfirmPassword("");
      } catch (err) {
        console.error(err);
        toast.error("Password update failed");
      }
    }
  };

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.tabs}>
            <div
              style={styles.tab(activeTab === "profile")}
              onClick={() => setActiveTab("profile")}
            >
              <MdPerson /> Profile
            </div>
            <div
              style={styles.tab(activeTab === "security")}
              onClick={() => setActiveTab("security")}
            >
              <MdLock /> Security
            </div>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === "profile" && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.3 }}
                style={{
                  ...styles.content,
                  ...(window.innerWidth < 768 && styles.mobileStack),
                }}
              >
                <div style={styles.section}>
                  {previewImage && (
                    <img
                      src={previewImage}
                      alt="Avatar"
                      style={styles.avatar}
                    />
                  )}
                  <button
                    style={styles.uploadButton}
                    onClick={() =>
                      document.getElementById("hiddenFileInput").click()
                    }
                  >
                    Upload Image
                  </button>
                  <input
                    id="hiddenFileInput"
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleImageChange}
                  />
                </div>

                <div style={styles.section}>
                  <label style={styles.label}>Display Name</label>
                  <input
                    style={styles.input}
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                  />
                  <button
                    style={styles.saveButton}
                    onClick={handleUpdateProfile}
                  >
                    Save Changes
                  </button>
                </div>
              </motion.div>
            )}

            {activeTab === "security" && (
              <motion.div
                key="security"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3 }}
                style={{
                  ...styles.content,
                  ...(window.innerWidth < 768 && styles.mobileStack),
                }}
              >
                <div style={styles.section}>
                  <label style={styles.label}>New Password</label>
                  <input
                    type="password"
                    style={styles.input}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />

                  <label style={styles.label}>Confirm Password</label>
                  <input
                    type="password"
                    style={styles.input}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />

                  <button
                    style={styles.saveButton}
                    onClick={handleUpdateProfile}
                  >
                    Save Changes
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}

export default Settings;
