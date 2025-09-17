import React from "react";
import Nav from "./Nav";
import 'bootstrap/dist/css/bootstrap.min.css';

function Home() {
  return (
    <div className="container-fluid">
      <Nav />
      <div className="container mt-4">
        <div className="card p-4 shadow-sm">
          <h1 className="mb-3">Dashboard</h1>
          <p className="lead">Welcome to the Dashboard!</p>
        </div>
      </div>
    </div>
  );
}

export default Home;
