// AdminDashboard.tsx
import React, { useState } from 'react';
import AdminFilms from './AdminFilms';
import AdminUsers from './AdminUsers';
import '../styles/AdminDashboard.css';

const AdminDashboard: React.FC = () => {
  // Two main tabs: one for films, one for users
  const [activeTab, setActiveTab] = useState<'films' | 'users'>('films');

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <div className="admin-tabs">
        <button 
          className={activeTab === 'films' ? 'active' : ''} 
          onClick={() => setActiveTab('films')}
        >
          Manage Films
        </button>
        <button 
          className={activeTab === 'users' ? 'active' : ''} 
          onClick={() => setActiveTab('users')}
        >
          Manage Users
        </button>
      </div>
      <div className="admin-content">
        {activeTab === 'films' && <AdminFilms />}
        {activeTab === 'users' && <AdminUsers />}
      </div>
    </div>
  );
};

export default AdminDashboard;
