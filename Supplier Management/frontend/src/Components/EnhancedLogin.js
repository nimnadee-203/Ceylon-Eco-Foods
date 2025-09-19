// frontend/src/Components/EnhancedLogin.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function EnhancedLogin({ userType = "supplier" }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [shake, setShake] = useState(false);
  const [particles, setParticles] = useState([]);

  const isAdmin = userType === "admin";

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    
    try {
      const endpoint = isAdmin ? "http://localhost:5001/Admin/login" : "http://localhost:5001/Suppliers/login";
      const res = await axios.post(endpoint, form);
      const { token, user } = res.data;
      
      if (!isAdmin && (!user || user.role !== "supplier")) {
        setErr("This account is not a supplier account.");
        setLoading(false);
        return;
      }
      
      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      
      // Success animation
      setTimeout(() => {
        navigate(isAdmin ? "/admin/dashboard" : "/supplier/dashboard");
      }, 500);
      
    } catch (error) {
      setErr(error.response?.data?.message || "Login failed");
      setShake(true);
      setTimeout(() => setShake(false), 500);
    } finally {
      setLoading(false);
    }
  };

  const handleFocus = (field) => setFocusedField(field);
  const handleBlur = () => setFocusedField(null);

  // Create floating fruit particles
  useEffect(() => {
    const fruits = ['🍎', '🍊', '🍋', '🍇', '🍓', '🥝', '🍑', '🍒'];
    const newParticles = [];
    
    for (let i = 0; i < 8; i++) {
      newParticles.push({
        id: i,
        fruit: fruits[Math.floor(Math.random() * fruits.length)],
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 5,
        duration: 8 + Math.random() * 4
      });
    }
    
    setParticles(newParticles);
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      backgroundImage: "url('https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      position: "relative",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px"
    }}>
      {/* Background Overlay */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "linear-gradient(135deg, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.5) 100%)",
        backdropFilter: "blur(1px)"
      }} />

      {/* Floating Fruit Particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          style={{
            position: "absolute",
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            fontSize: "24px",
            opacity: 0.6,
            animation: `float ${particle.duration}s ease-in-out infinite`,
            animationDelay: `${particle.delay}s`,
            pointerEvents: "none",
            zIndex: 5
          }}
        >
          {particle.fruit}
        </div>
      ))}

      {/* Login Card */}
      <div style={{
        position: "relative",
        zIndex: 10,
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        borderRadius: "20px",
        padding: "40px",
        maxWidth: "450px",
        width: "100%",
        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        transform: shake ? "translateX(-10px)" : "translateX(0)",
        transition: "all 0.3s ease",
        cursor: "default"
      }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <div style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            backgroundColor: isAdmin ? "#4CAF50" : "#2196F3",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px",
            fontSize: "32px",
            color: "white",
            boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)"
          }}>
            {isAdmin ? "👨‍💼" : "🏭"}
          </div>
          <h2 style={{
            margin: 0,
            color: "#333",
            fontSize: "28px",
            fontWeight: "600"
          }}>
            {isAdmin ? "Admin Login" : "Supplier Login"}
          </h2>
          <p style={{
            margin: "8px 0 0",
            color: "#666",
            fontSize: "14px"
          }}>
            {isAdmin ? "Access your admin dashboard" : "Access your supplier portal"}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={submit} style={{ marginBottom: "20px" }}>
          {/* Email Field */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{
              display: "block",
              marginBottom: "8px",
              color: "#333",
              fontSize: "14px",
              fontWeight: "500"
            }}>
              Email Address
            </label>
            <div style={{ position: "relative" }}>
              <input
                name="email"
                type="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handle}
                onFocus={() => handleFocus("email")}
                onBlur={handleBlur}
                required
                style={{
                  width: "100%",
                  padding: "15px 20px",
                  border: `2px solid ${focusedField === "email" ? (isAdmin ? "#4CAF50" : "#2196F3") : "#e0e0e0"}`,
                  borderRadius: "12px",
                  fontSize: "16px",
                  outline: "none",
                  transition: "all 0.3s ease",
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  boxSizing: "border-box"
                }}
              />
              <div style={{
                position: "absolute",
                right: "15px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#999",
                fontSize: "18px"
              }}>
                ✉️
              </div>
            </div>
          </div>

          {/* Password Field */}
          <div style={{ marginBottom: "25px" }}>
            <label style={{
              display: "block",
              marginBottom: "8px",
              color: "#333",
              fontSize: "14px",
              fontWeight: "500"
            }}>
              Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={form.password}
                onChange={handle}
                onFocus={() => handleFocus("password")}
                onBlur={handleBlur}
                required
                style={{
                  width: "100%",
                  padding: "15px 50px 15px 20px",
                  border: `2px solid ${focusedField === "password" ? (isAdmin ? "#4CAF50" : "#2196F3") : "#e0e0e0"}`,
                  borderRadius: "12px",
                  fontSize: "16px",
                  outline: "none",
                  transition: "all 0.3s ease",
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  boxSizing: "border-box"
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "15px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "18px",
                  color: "#999"
                }}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "15px",
              backgroundColor: loading ? "#ccc" : (isAdmin ? "#4CAF50" : "#2196F3"),
              color: "white",
              border: "none",
              borderRadius: "12px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.3s ease",
              boxShadow: loading ? "none" : "0 8px 20px rgba(0, 0, 0, 0.1)",
              transform: loading ? "none" : "translateY(0)",
              marginBottom: "20px"
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 12px 25px rgba(0, 0, 0, 0.15)";
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 8px 20px rgba(0, 0, 0, 0.1)";
              }
            }}
          >
            {loading ? (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                <div style={{
                  width: "16px",
                  height: "16px",
                  border: "2px solid #fff",
                  borderTop: "2px solid transparent",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite"
                }} />
                Logging in...
              </div>
            ) : (
              `Login as ${isAdmin ? "Admin" : "Supplier"}`
            )}
          </button>
        </form>

        {/* Error Message */}
        {err && (
          <div style={{
            backgroundColor: "#ffebee",
            color: "#c62828",
            padding: "12px 16px",
            borderRadius: "8px",
            fontSize: "14px",
            border: "1px solid #ffcdd2",
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}>
            <span>⚠️</span>
            {err}
          </div>
        )}

        {/* Footer */}
        <div style={{
          textAlign: "center",
          paddingTop: "20px",
          borderTop: "1px solid #e0e0e0"
        }}>
          <p style={{
            margin: 0,
            color: "#666",
            fontSize: "12px"
          }}>
            {isAdmin ? "Admin Portal" : "Supplier Portal"} • Secure Login
          </p>
        </div>
      </div>

      {/* CSS Animation */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg); 
            opacity: 0.6;
          }
          25% { 
            transform: translateY(-20px) rotate(5deg); 
            opacity: 0.8;
          }
          50% { 
            transform: translateY(-10px) rotate(-3deg); 
            opacity: 0.7;
          }
          75% { 
            transform: translateY(-15px) rotate(2deg); 
            opacity: 0.9;
          }
        }
      `}</style>
    </div>
  );
}
