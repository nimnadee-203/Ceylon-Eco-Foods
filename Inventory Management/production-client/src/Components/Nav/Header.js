import React from "react";
import "./header.css";

function Header({ profilePic, setProfilePic }) {
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

      <div className="header-right">
        <img
          src={profilePic}
          alt="profile"
          className="profile-pic"
          onClick={() => document.getElementById("profileInput").click()}
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
