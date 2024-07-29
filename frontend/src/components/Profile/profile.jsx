import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './profile.css';
import'../../loader_login.js'

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('auth-token'); 
        if (!token) {
          setError('No auth token found');
          setLoading(false);
          return;
        }

        const response = await axios.get('https://backend-beryl-nu-15.vercel.app/profile', {
          headers: {
            'auth-token': token
          }
        });

        setUserData(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <div>loading<loader_login /></div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="profile">
      {userData ? (
        <div>
          <h1>Profile</h1>
          <p>Name: {userData.name}</p>
          <p>Email: {userData.email}</p>
          {/* Add more fields as needed */}
        </div>
      ) : (
        <div>No user data found</div>
      )}
    </div>
  );
};

export default Profile;
