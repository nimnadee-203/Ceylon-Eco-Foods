import React from "react";
import AdminNavbar from "../Navbar/AdminNavbar";
import CustomerNavbar from "../Navbar/CustomerNavbar";
import "./Home.css";
import logo from "../../assets/logo.jfif";

// Import card images
import freshImg from "../../assets/cards/fresh.jfif";
import farmerImg from "../../assets/cards/farmer.jfif";
import rangeImg from "../../assets/cards/range.jfif";
import deliveryImg from "../../assets/cards/delivery.jfif";
import supportImg from "../../assets/cards/support.jfif";
import qualityImg from "../../assets/cards/quality.jfif";

const features = [
  { title: "Fresh & Organic", desc: "Farm-fresh produce delivered to your door.", img: freshImg },
  { title: "Direct Farmer Involvement", desc: "Providing the chance for direct communication.", img: farmerImg },
  { title: "Wide Product Range", desc: "Fruits, vegetables, and processed goods.", img: rangeImg },
  { title: "Fast Delivery", desc: "Quick and reliable delivery across Sri Lanka.", img: deliveryImg },
  { title: "Farmer Support", desc: "Empowering local farmers for better livelihoods.", img: supportImg },
  { title: "Quality Assurance", desc: "Strict quality checks for every product.", img: qualityImg },
];

const Home = () => {
  const role = localStorage.getItem("role"); // "admin" or "customer"

  return (
    <div className="home-page">
      {/* Select Navbar */}
      {role === "admin" ? <AdminNavbar /> : <CustomerNavbar />}

      {/* Logo */}
      <div className="text-center py-3">
        <img src={logo} alt="Ceylon Eco Foods Logo" className="logo mb-3" />
      </div>

      {/* Heading */}
      <h1 className="text-success fw-bold text-center mb-3">
        Welcome to Ceylon Eco Foods
      </h1>
      <p className="text-muted text-center mb-5">
        From farm to fork, we bring the best of nature to you.
      </p>

      {/* Feature Cards */}
      <div className="cards-container">
        {features.map((feature, index) => (
          <div key={index} className="feature-card">
            <div className="card-image">
              <img src={feature.img} alt={feature.title} />
            </div>
            <div className="card-content">
              <h5 className="text-success fw-bold">{feature.title}</h5>
              <p className="text-muted">{feature.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
