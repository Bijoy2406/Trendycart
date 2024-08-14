import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './profile.css';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const refreshAccessToken = async () => {
    try {
      const refreshToken = localStorage.getItem('refresh-token');
      if (!refreshToken) throw new Error('No refresh token available');

      const response = await fetch('https://backend-beryl-nu-15.vercel.app/token', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: refreshToken }),
      });

      const data = await response.json();

      if (data.accessToken) {
        localStorage.setItem('auth-token', data.accessToken); // Update access token
        return data.accessToken;
      } else {
        throw new Error('Failed to refresh token');
      }
    } catch (error) {
      console.error('Error refreshing access token:', error);
      toast.error('Session expired, please log in again.');
      localStorage.removeItem('auth-token');
      localStorage.removeItem('refresh-token');
      window.location.replace('/');
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        let token = localStorage.getItem('auth-token');
        if (!token) {
          setError('No auth token found');
          setLoading(false);
          return;
        }

        try {
          const response = await axios.get('https://backend-beryl-nu-15.vercel.app/profile', {
            headers: {
              'auth-token': token,
            },
          });
          setUserData(response.data);
          setNewUsername(response.data.name);
        } catch (err) {
          if (err.response && err.response.status === 401) {
            token = await refreshAccessToken(); // Try refreshing the token
            if (token) {
              const response = await axios.get('https://backend-beryl-nu-15.vercel.app/profile', {
                headers: {
                  'auth-token': token,
                },
              });
              setUserData(response.data);
              setNewUsername(response.data.name);
            }
          } else {
            throw err;
          }
        }
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
      const response = await axios.post('https://backend-beryl-nu-15.vercel.app/updateprofile', {
        username: newUsername,
        password: newPassword,
      }, {
        headers: {
          'auth-token': token,
        },
      });
      setUserData(response.data.user);
      setEditing(false);
      toast.success('Profile updated successfully!');
    } catch (err) {
      setError(err.message);
      toast.error('Failed to update profile.');
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
