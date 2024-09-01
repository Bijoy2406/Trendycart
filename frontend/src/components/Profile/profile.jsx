import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './profile.css';
import defaultProfilePic from '../Assets/default-profile.png'; // Import a default profile image
import Loader from '../../Loader';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [location, setLocation] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const inputFileRef = useRef(null);
  const [profilePictureURL, setProfilePictureURL] = useState(null); // New state for URL
  const [uploading, setUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null); // For image preview


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
      localStorage.removeItem('auth-token');
      localStorage.removeItem('refresh-token');
      window.location.replace('/');
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Declare 'token' inside the function scope
        const token = localStorage.getItem('auth-token'); 

        if (!token) {
          setError('No auth token found');
          setLoading(false);
          return;
        }

        const response = await axios.get('https://backend-beryl-nu-15.vercel.app/profile', {
          headers: {
            'auth-token': token,
          },
        });

        setUserData(response.data);
        setNewUsername(response.data.name);
        setLocation(response.data.location);
        setDateOfBirth(response.data.dateOfBirth);
        setProfilePictureURL(response.data.profilePicture || null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);



  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file && file.size <= 5 * 1024 * 1024) {
      setProfilePicture(file);
      setSelectedImage(file); // Set preview image
    } else {
      toast.error('File size too large. Max size is 5MB.');
      event.target.value = null;
    }
  };

  const handleEdit = async () => {
    try {
      setUploading(true);
      const token = localStorage.getItem('auth-token');
      const formData = new FormData();
      formData.append('username', newUsername);
      formData.append('password', newPassword);
      formData.append('location', location);
      if (profilePicture) {
        formData.append('profilePicture', profilePicture);
      }
  
      const response = await axios.post('https://backend-beryl-nu-15.vercel.app/updateprofile', formData, {
        headers: {
          'auth-token': token,
          'Content-Type': 'multipart/form-data',
        },
      });
  
      setUserData(response.data.user);
      setProfilePicture(null); 
      setProfilePictureURL(response.data.user.profilePicture); 
      setEditing(false);
      toast.success('Profile updated successfully!');
    } catch (err) {
      setError(err.message);
      toast.error('Failed to update profile.');
    } finally {
      setUploading(false);
    }
  };
  

  const handleProfilePictureClick = () => {
    if (editing && inputFileRef.current) { // Check if ref is attached
      inputFileRef.current.click();
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

          <div className="profile-picture-container">
            {uploading ? ( // Show loader during upload
              <Loader />
            ) : (
              <img
                src={selectedImage ? URL.createObjectURL(selectedImage) : profilePictureURL || defaultProfilePic}
                alt="Profile"
                className="profile-picture"
                onClick={handleProfilePictureClick}
              />
            )}

            <img
              src={defaultProfilePic}
              alt="Default Profile"
              className="profile-picture"
              onClick={handleProfilePictureClick}
            />
            <input
              type="file"
              accept="image/*"
              ref={inputFileRef}
              style={{ display: editing ? 'block' : 'none' }} // Control visibility with CSS
              onChange={handleImageChange}
            />
          </div>
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
            {editing ? (
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            ) : (
              <input type="text" value={userData.location || 'N/A'} readOnly />
            )}
          </div>
          <div className="profile-field">
            <label>Date of Birth:</label>
            <input
              type="text"
              value={userData.dateOfBirth ? new Date(userData.dateOfBirth).toLocaleDateString() : 'N/A'}
              readOnly
            />
          </div>

          {editing ? (
            <button className="edit-button" onClick={handleEdit}>
              Save Changes
            </button>
          ) : (
            <button className="edit-button" onClick={() => setEditing(true)}>
              Edit Profile
            </button>
          )}
        </div>
      ) : (
        <div>No user data found</div>
      )}
    </div>
  );
};

export default Profile;