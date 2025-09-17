import React from 'react';
import Header from '../Nav/Header';
import Nav from '../Nav/Nav';
import "./layout.css";

function Layout({ children, profilePic, setProfilePic }) {
  return (
    <div style={{ display: 'flex' }}>
      <div style={{ width: '220px' }}>
        {/* ✅ Pass props to Header and Nav */}
        <Header profilePic={profilePic} setProfilePic={setProfilePic} />
        <Nav profilePic={profilePic} />
      </div>
      <div style={{ flex: 1, padding: '20px' }}>
        {children}
      </div>
    </div>
  );
}

export default Layout;
