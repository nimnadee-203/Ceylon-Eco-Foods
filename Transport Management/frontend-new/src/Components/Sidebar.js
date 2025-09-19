import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FaTruck, 
  FaHome, 
  FaBox, 
  FaCar, 
  FaUsers, 
  FaWrench, 
  FaRoute 
} from 'react-icons/fa';

const Sidebar = ({ activePage, setActivePage }) => {
  const location = useLocation();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FaHome, path: '/dashboard' },
    { id: 'deliveries', label: 'Deliveries', icon: FaBox, path: '/deliveries' },
    { id: 'vehicles', label: 'Vehicles', icon: FaCar, path: '/vehicles' },
    { id: 'drivers', label: 'Drivers', icon: FaUsers, path: '/drivers' },
    { id: 'maintenance', label: 'Maintenance', icon: FaWrench, path: '/maintenance' },
    { id: 'routes', label: 'Routes', icon: FaRoute, path: '/routes' }
  ];

  return (
    <div className="d-flex flex-column bg-dark text-white vh-100 p-3 shadow-sm sidebar">
      {/* Brand / Logo */}
      <div className="d-flex align-items-center mb-4">
        <FaTruck className="me-2 text-primary" size={22} />
        <span className="fw-bold fs-5"></span>
      </div>

      {/* Navigation */}
      <nav className="flex-grow-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.id}
              to={item.path}
              className={`d-flex align-items-center p-2 mb-2 rounded nav-link-custom ${
                isActive ? 'active' : 'text-white-50'
              }`}
              onClick={() => setActivePage(item.id)}
              style={{ textDecoration: 'none' }}
            >
              <Icon className="me-2" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="mt-auto pt-3 border-top border-secondary small">
        <div className="fw-semibold">Food Processing Factory</div>
        <div className="text-white-50">Transport Management System</div>
      </div>
    </div>
  );
};

export default Sidebar;
