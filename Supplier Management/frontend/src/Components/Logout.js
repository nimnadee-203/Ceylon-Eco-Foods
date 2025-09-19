// frontend/src/Components/Logout.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

/**
 * Logout button.
 * Props:
 *  - redirect: path to navigate to after logout (default "/")
 *  - revokeUrl: optional server endpoint to call to invalidate token (POST)
 */
export default function Logout({ redirect = "/", revokeUrl = null }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const doClear = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // remove axios default auth header safely
    try {
      delete axios.defaults.headers.common["Authorization"];
    } catch (e) {
      axios.defaults.headers.common["Authorization"] = undefined;
    }
  };

  const logout = async () => {
    if (!window.confirm("Are you sure you want to log out?")) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (revokeUrl && token) {
        // best-effort call to server to revoke token; don't block on error
        try {
          await axios.post(revokeUrl, {}, {
            headers: { Authorization: `Bearer ${token}` }
          });
        } catch (err) {
          // ignore network/server errors here — proceed to clear client state
          console.warn("Token revoke failed (ignored):", err?.response?.data || err.message);
        }
      }
      doClear();
      navigate(redirect);
    } catch (err) {
      console.error("Logout error:", err);
      doClear();
      navigate(redirect);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={logout} disabled={loading}>
      {loading ? "Logging out..." : "Logout"}
    </button>
  );
}
