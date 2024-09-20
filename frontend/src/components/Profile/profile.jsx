import React, { useEffect, useState, useRef } from 'react';
import { toast } from 'react-toastify';
import './profile.css';
import defaultProfilePic from '../Assets/default-profile.png'; // Default profile image
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
  const [profilePictureURL, setProfilePictureURL] = useState(null); // State for image URL
  const [uploading, setUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null); // For image preview

  // Function to refresh access token using refresh token
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
        localStorage.setItem('auth-token', data.accessToken);
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

  // Helper function to make authenticated fetch requests
  const fetchWithToken = async (url, options = {}) => {
    let token = localStorage.getItem('auth-token');
    if (!token) {
      token = await refreshAccessToken(); // Get new token if expired
    }

    if (!token) {
      throw new Error('No valid token available');
    }

    const fetchOptions = { ...options };
    fetchOptions.headers = {
      ...fetchOptions.headers,
      'auth-token': token,
    };

    let response = await fetch(url, fetchOptions);
    
    // If token is expired or invalid, try to refresh and retry
    if (response.status === 401) {
      token = await refreshAccessToken();
      if (token) {
        fetchOptions.headers['auth-token'] = token;
        response = await fetch(url, fetchOptions); // Retry with refreshed token
      }
    }

    return response; // Return the final response
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('auth-token');
        if (!token) {
          setError('No auth token found');
          setLoading(false);
          return;
        }

        const response = await fetchWithToken('https://backend-beryl-nu-15.vercel.app/profile');
        const data = await response.json();
        
        if (response.ok) {
          setUserData(data);
          setNewUsername(data.name);
          setLocation(data.location);
          setDateOfBirth(data.dateOfBirth);
          setProfilePictureURL(data.profilePicture || null);
        } else {
          throw new Error(data.message || 'Failed to fetch user data');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Handle profile picture change and preview
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file && file.size <= 5 * 1024 * 1024) {
      setProfilePicture(file);
      setSelectedImage(file); 
    } else {
      toast.error('File size too large. Max size is 5MB.');
      event.target.value = null;
    }
  };

  const handleEdit = async () => {
    try {
      setUploading(true);
      const formData = new FormData();

      if (profilePicture) {
        formData.append('profilePicture', profilePicture);
        const response = await fetchWithToken('https://backend-beryl-nu-15.vercel.app/updateprofilepic', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();
        if (response.ok) {
          setUserData(data.user);
          setProfilePicture(null);
          setProfilePictureURL(data.user.profilePicture);
          toast.success('Profile picture updated successfully!');
        } else {
          throw new Error(data.message || 'Failed to update profile picture');
        }
      }

      if (newPassword) {
        const passwordResponse = await fetchWithToken('https://backend-beryl-nu-15.vercel.app/updatepassword', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ password: newPassword }),
        });

        const passwordData = await passwordResponse.json();
        if (passwordResponse.ok) {
          toast.success('Password updated successfully');
        } else {
          throw new Error(passwordData.message || 'Failed to update password');
        }
      }
    } catch (err) {
      setError(err.message);
      toast.error('Failed to update profile.');
    } finally {
      setUploading(false);
    }
  };

  // Trigger file input for profile picture change
  const handleProfilePictureClick = () => {
    if (editing && inputFileRef.current) {
      inputFileRef.current.click();
    }
  };

  if (loading) {
    return <Loader />;
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
            {uploading ? (
              <Loader />
            ) : (
              <img
                src={selectedImage ? URL.createObjectURL(selectedImage) : profilePictureURL || defaultProfilePic}
                alt="Profile"
                className="profile-picture"
                onClick={handleProfilePictureClick}
              />
            )}

            <input
              type="file"
              accept="image/*"
              ref={inputFileRef}
              style={{ display: 'none' }}
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
