import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Toaster } from "react-hot-toast";
import "./styles/global.css";
import "./styles/theme.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
    <Toaster
      position="top-center"
      toastOptions={{
        style: {
          background: "#1c1c1e",
          color: "#fff",
          borderRadius: "12px",
          padding: "0.75rem 1.25rem",
          fontSize: "0.95rem",
        },
        success: {
          iconTheme: {
            primary: "lightgreen",
            secondary: "#1c1c1e",
          },
        },
        error: {
          iconTheme: {
            primary: "#ff4d4f",
            secondary: "#1c1c1e",
          },
        },
      }}
    />
  </React.StrictMode>
);
