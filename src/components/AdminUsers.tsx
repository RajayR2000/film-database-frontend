import React, { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import NotificationPopup from './NotificationPopup';
import { apiFetch } from '../apifetch';
import '../styles/AdminUsers.css';

// --- Type definitions ---
interface User {
  user_id?: number;
  username: string;
  password: string;
  role: string; // New users will be assigned the role 'reader'
  active?: boolean; // Optional flag for soft deletion
}

// --- Validation Schema for Users ---
const userValidationSchema = Yup.object().shape({
  username: Yup.string().required('Username required'),
  password: Yup.string().required('Password required'),
});

// --- Initial values for adding a new user ---
const initialUserValues: User = {
  username: '',
  password: '',
  role: 'reader', // role is set as 'reader'
};

const AdminUsers: React.FC = () => {
  // This local state manages which user sub-section to show
  const [activeUserTab, setActiveUserTab] = useState<'add' | 'update' | 'delete'>('add');
  const [message, setMessage] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Load users list from the backend
  const loadUsers = async () => {
    try {
      const res = await apiFetch('http://localhost:3001/users', {
        headers: {
          Authorization: localStorage.getItem('accessToken')
            ? `Bearer ${localStorage.getItem('accessToken')}`
            : '',
        },
      });
      if (!res.ok) {
        setMessage('Failed to load users list.');
        return;
      }
      const data = await res.json();
      // Expecting data.users to be an array of user records
      setUsers(data.users);
    } catch (error: any) {
      setMessage('Error loading users: ' + error.message);
    }
  };

  // Refresh users when this section loads or when a tab changes
  useEffect(() => {
    loadUsers();
  }, [activeUserTab]);

  // --- Handler: Add a new user ---
  const onAddUserSubmit = async (values: User, actions: any) => {
    try {
      // Ensure role is set to 'reader' regardless of what is passed in
      const newUser = { ...values, role: 'reader' };
      const res = await apiFetch('http://localhost:3001/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify(newUser),
      });
      if (!res.ok) {
        const errorData = await res.json();
        actions.setErrors({ username: errorData.error || 'Submission error' });
        setMessage(errorData.error || 'Submission error');
        return;
      }
      setMessage('User added successfully!');
      actions.resetForm();
      loadUsers();
    } catch (error: any) {
      setMessage(error.message);
    } finally {
      actions.setSubmitting(false);
    }
  };

  // --- Handler: Update a user ---
  const onUpdateUserSubmit = async (values: User, actions: any) => {
    try {
      if (!selectedUser || !selectedUser.user_id) {
        setMessage('No user selected to update');
        return;
      }
      // The backend should prevent duplicate usernames. It will return an error if a duplicate exists.
      const res = await apiFetch(`http://localhost:3001/users/${selectedUser.user_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const errorData = await res.json();
        actions.setErrors({ username: errorData.error || 'Submission error' });
        setMessage(errorData.error || 'Submission error');
        return;
      }
      setMessage('User updated successfully!');
      actions.resetForm();
      setSelectedUser(null);
      loadUsers();
    } catch (error: any) {
      setMessage(error.message);
    } finally {
      actions.setSubmitting(false);
    }
  };

  // --- Handler: Soft delete a user ---
  // In a soft-delete, the backend may mark the user as inactive rather than removing the record.
  const onDeleteUser = async (user_id: number) => {
    try {
      const res = await apiFetch(`http://localhost:3001/users/${user_id}`, {
        method: 'DELETE',
        headers: {
          Authorization: localStorage.getItem('accessToken')
            ? `Bearer ${localStorage.getItem('accessToken')}`
            : '',
        },
      });
      if (!res.ok) {
        setMessage('Failed to delete user');
        return;
      }
      setMessage('User deleted successfully!');
      loadUsers();
    } catch (error: any) {
      setMessage('Error deleting user: ' + error.message);
    }
  };

  return (
    <div className="admin-dashboard">
      {/* <h2>Manage Users</h2> */}
      {/* Tabs for Users Management */}
      <div className="admin-tabs">
        <button
          className={activeUserTab === 'add' ? 'active' : ''}
          onClick={() => {
            setActiveUserTab('add');
            setMessage('');
            setSelectedUser(null);
          }}
        >
          Add User
        </button>
        <button
          className={activeUserTab === 'update' ? 'active' : ''}
          onClick={() => {
            setActiveUserTab('update');
            setMessage('');
            setSelectedUser(null);
          }}
        >
          Update User
        </button>
        <button
          className={activeUserTab === 'delete' ? 'active' : ''}
          onClick={() => {
            setActiveUserTab('delete');
            setMessage('');
            setSelectedUser(null);
          }}
        >
          Delete User
        </button>
      </div>
      {message && <NotificationPopup message={message} onClose={() => setMessage('')} />}
      <div className="admin-content">
        {activeUserTab === 'add' && (
          <Formik
            initialValues={initialUserValues}
            validationSchema={userValidationSchema}
            onSubmit={onAddUserSubmit}
          >
            {({ isSubmitting, errors, touched }) => (
              <Form className="admin-form">
                <div>
                  <label htmlFor="username">Username:</label>
                  <Field name="username" type="text" />
                  {errors.username && touched.username && (
                    <div className="error">{errors.username}</div>
                  )}
                </div>
                <div>
                  <label htmlFor="password">Password:</label>
                  <Field name="password" type="password" />
                  {errors.password && touched.password && (
                    <div className="error">{errors.password}</div>
                  )}
                </div>
                <button className="btn-edit" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Add User'}
                </button>
              </Form>
            )}
          </Formik>
        )}
        {activeUserTab === 'update' && (
          <div>
            {!selectedUser ? (
              <div>
                <h3>Select a User to Update</h3>
                <ul className="users-list">
                  {users.map((user) => (
                    <li key={user.user_id}>
                      <span>{user.username}</span>
                      <button  className="btn-edit" onClick={() => setSelectedUser(user)}>Edit</button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <Formik
                initialValues={selectedUser}
                validationSchema={userValidationSchema}
                onSubmit={onUpdateUserSubmit}
                enableReinitialize={true}
              >
                {({ isSubmitting, errors, touched }) => (
                  <Form className="admin-form">
                    <div>
                      <label htmlFor="username">Username:</label>
                      <Field name="username" type="text" />
                      {errors.username && touched.username && (
                        <div className="error">{errors.username}</div>
                      )}
                    </div>
                    <div>
                      <label htmlFor="password">Password:</label>
                      <Field name="password" type="password" />
                      {errors.password && touched.password && (
                        <div className="error">{errors.password}</div>
                      )}
                    </div>
                    <button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? 'Submitting...' : 'Update User'}
                    </button>
                    <button type="button" onClick={() => setSelectedUser(null)}>
                      Cancel
                    </button>
                  </Form>
                )}
              </Formik>
            )}
          </div>
        )}
        {activeUserTab === 'delete' && (
          <div>
            <h3>Select a User to Delete</h3>
            <ul className="users-list">
              {users.map((user) => (
                <li key={user.user_id}>
                  <span>{user.username}</span>
                  <button className="btn-delete" onClick={() => onDeleteUser(user.user_id!)}>Delete</button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
