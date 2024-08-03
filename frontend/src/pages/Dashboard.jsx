import React, { useState, useEffect } from 'react';
import './CSS/Dashboard.css';
import ToggleSwitch from './ToggleSwitch'; // Import the custom ToggleSwitch component

function Dashboard() {
    const [users, setUsers] = useState([]);
    const [currentUserEmail, setCurrentUserEmail] = useState('');

    useEffect(() => {
        // Retrieve the current user's email from localStorage or any other source
        const fetchCurrentUserEmail = () => {
            const email = localStorage.getItem('current-user-email');
            setCurrentUserEmail(email);
        };

        fetchCurrentUserEmail();

        const fetchUsers = async () => {
            try {
                const response = await fetch('https://backend-beryl-nu-15.vercel.app/allusers', {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                });
                const data = await response.json();
                setUsers(data.users);
            } catch (error) {
                console.error("Failed to fetch users:", error);
            }
        };

        fetchUsers();
    }, []);

    const handleToggle = async (email, isChecked) => {
        try {
            const token = localStorage.getItem('auth-token'); // Retrieve the token from storage
            if (!token) {
                alert('Authentication token not found. Please log in again.');
                return;
            }
            const response = await fetch(`https://backend-beryl-nu-15.vercel.app/approveadmin/${email}`, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'auth-token': token // Ensure you are using the correct header name
                },
                body: JSON.stringify({ isApprovedAdmin: isChecked }) // Send the approval status
            });
            const data = await response.json();
            if (response.ok) {
                alert('Admin approval status updated successfully!');
                // Update state or UI accordingly
                setUsers(users.map(user => user.email === email ? { ...user, isApprovedAdmin: isChecked } : user));
            } else {
                alert(data.message || 'Failed to update admin approval status');
            }
        } catch (error) {
            console.error("Failed to update admin approval status:", error);
            alert('An error occurred. Please try again.');
        }
    };

    const sortedUsers = [...users]
        .filter(user => user.email !== currentUserEmail) // Exclude current user
        .sort((a, b) => {
            if (a.isAdmin && b.isAdmin) {
                return b.isApprovedAdmin - a.isApprovedAdmin;
            }
            return b.isAdmin - a.isAdmin;
        });

    return (
        <div className="dashboard-container">
            <h2 className="dashboard-header">User Dashboard</h2>
            <ul className="user-list">
                {sortedUsers.map(user => (
                    <li key={user._id} className={`user-card ${user.isAdmin ? 'admin-user' : ''}`}>
                        <div className="user-info">
                            <span className="user-name"><label>Name: </label>{user.name}</span>
                            <span className={`user-email ${user.isAdmin ? 'admin' : ''}`}><label>Email:  </label>{user.email}</span>
                        </div>
                        {user.isAdmin && (
                            <div className="wrap-check-57">
                                <label>Approve Admin: </label>
                                <ToggleSwitch 
                                    isChecked={user.isApprovedAdmin} 
                                    onChange={() => handleToggle(user.email, !user.isApprovedAdmin)} 
                                />
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Dashboard;
