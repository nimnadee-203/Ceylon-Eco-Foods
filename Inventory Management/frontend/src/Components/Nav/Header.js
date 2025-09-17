import React from "react";
import "./header.css";
import { useNavigate } from "react-router-dom";

function Header({ profilePic, setProfilePic }) {
  const navigate = useNavigate();

  const handleProfileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfilePic(imageUrl); // ✅ this now works
      localStorage.setItem("profilePic", imageUrl);
    }
  };

  return (
    <header className="header">
      <div className="header-left">
        <img src="/favicon.ico" alt="logo" className="logo" />
        <h2 className="company-name">Ceylon Eco Foods</h2>
      </div>

      <div className="header-right" style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        {/* Expiry Alerts Button */}
        <button
          onClick={() => navigate("/ExpiryTrackingPage")}
          style={{
            padding: "8px 14px",
            backgroundColor: "#e74c3c",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          Expiry Alerts
        </button>

        {/* Profile Picture */}
        <img
          src={profilePic}
          alt="profile"
          className="profile-pic"
          onClick={() => document.getElementById("profileInput").click()}
          style={{ cursor: "pointer" }}
        />
        <input
          type="file"
          accept="image/*"
          id="profileInput"
          onChange={handleProfileChange}
          style={{ display: "none" }}
        />
      </div>
    </header>
  );
}

export default Header;
