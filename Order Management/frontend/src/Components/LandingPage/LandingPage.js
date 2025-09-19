import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function LandingPage() {
  const navigate = useNavigate();

  const selectRole = (role) => {
  localStorage.setItem('role', role);
  if (role === 'admin') {
    navigate('/AdminLogin'); // go to login first
  } else if (role === 'customer') {
    navigate('/log'); // customer login page
  }
};


  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100" style={{ gap: '2rem' }}>
      <h1>Welcome to Ceylon Eco Foods</h1>
      <button className="btn btn-primary btn-lg w-50" onClick={() => selectRole('admin')}>I am Admin</button>
      <button className="btn btn-success btn-lg w-50" onClick={() => selectRole('customer')}>I am Customer</button>
    </div>
  );
}

export default LandingPage;
