import { useState } from "react";
import UploadModal from "./UploadModal";
import RecordModal from "./RecordModal";

function MeetingModalSwitcher({ isOpen, onClose, onUploadComplete }) {
  const [mode, setMode] = useState("upload"); // 'upload' or 'record'

  const toggleStyles = {
    container: {
      display: "flex",
      justifyContent: "center",
      gap: "1rem",
      marginBottom: "1rem",
    },
    button: (active) => ({
      padding: "0.5rem 1.2rem",
      borderRadius: "12px",
      border: "2px solid white",
      backgroundColor: active ? "white" : "transparent",
      color: active ? "black" : "white",
      fontWeight: "bold",
      cursor: "pointer",
    }),
  };

  return (
    <>
      {isOpen && (
        <>
          <div style={toggleStyles.container}>
            <button
              style={toggleStyles.button(mode === "upload")}
              onClick={() => setMode("upload")}
            >
              Upload
            </button>
            <button
              style={toggleStyles.button(mode === "record")}
              onClick={() => setMode("record")}
            >
              Record
            </button>
          </div>

          {mode === "upload" ? (
            <UploadModal
              isOpen={isOpen}
              onClose={onClose}
              onUploadComplete={onUploadComplete}
            />
          ) : (
            <RecordModal
              isOpen={isOpen}
              onClose={onClose}
              onUploadComplete={onUploadComplete}
            />
          )}
        </>
      )}
    </>
  );
}

export default MeetingModalSwitcher;
