import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import '../styles/AdminDashboard.css'; // Create CSS as needed

const AdminDashboard: React.FC = () => {
  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <nav className="admin-nav">
        <ul>
          <li>
            <Link to="add-film">Add New Film</Link>
          </li>
          {/* Add more admin links here as needed */}
        </ul>
      </nav>
      {/* Render nested admin routes */}
      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminDashboard;
