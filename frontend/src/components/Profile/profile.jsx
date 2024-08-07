import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './profile.css';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('auth-token'); 
        if (!token) {
          setError('No auth token found');
          setLoading(false);
          return;
        }

        const response = await axios.get('http://localhost:4001/profile', {
          headers: {
            'auth-token': token
          }
        });

        setUserData(response.data);
        setNewUsername(response.data.name);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleEdit = async () => {
    try {
      const token = localStorage.getItem('auth-token');
      const response = await axios.post('http://localhost:4001/updateprofile', {
        username: newUsername,
        password: newPassword,
      }, {
        headers: {
          'auth-token': token
        }
      });
      setUserData(response.data.user);
      setEditing(false);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="profile-container">
      {userData ? (
        <div className="profile-card">
          <h2>Profile Information</h2>
          <div className="profile-field">
            <label>Name:</label>
            {editing ? (
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
              />
            ) : (
              <input type="text" value={userData.name} readOnly />
            )}
          </div>
          <div className="profile-field">
            <label>Email:</label>
            <input type="text" value={userData.email} readOnly />
          </div>
          <div className="profile-field">
            <label>Password:</label>
            {editing ? (
              <input
                type="password"
                placeholder="Enter new password"
                onChange={(e) => setNewPassword(e.target.value)}
              />
            ) : (
              <input type="text" value="Protected" readOnly />
            )}
          </div>
          <div className="profile-field">
            <label>Location:</label>
            <input type="text" value={userData.location || 'N/A'} readOnly />
          </div>
          {editing ? (
            <button className="edit-button" onClick={handleEdit}>Save Changes</button>
          ) : (
            <button className="edit-button" onClick={() => setEditing(true)}>Edit Profile</button>
          )}
        </div>
      ) : (
        <div>No user data found</div>
      )}
    </div>
  );
};

export default Profile;
