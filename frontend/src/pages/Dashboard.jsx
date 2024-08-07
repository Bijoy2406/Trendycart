import React, { useState, useEffect } from 'react';
import './CSS/Dashboard.css';

function Dashboard() {
    const [users, setUsers] = useState([]);
    const [currentUserEmail, setCurrentUserEmail] = useState('');
    const [currentUserName, setCurrentUserName] = useState('');

    useEffect(() => {
        const fetchCurrentUser = async () => {
        try {
            const response = await fetch('http://localhost:4001/currentuser', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth-token')}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                const data = await response.json();
                setCurrentUserEmail(data.user.email);
                setCurrentUserName(data.user.name);
                fetchUsers(); // Fetch users after getting current user details
            } else {
                console.error("Failed to fetch current user:", await response.json());
            }
        } catch (error) {
            console.error("Failed to fetch current user:", error);
        }
    };

    fetchCurrentUser();


        const fetchUsers = async () => {
            try {
                const response = await fetch('http://localhost:4001/allusers', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('auth-token')}`,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setUsers(data.users);
                } else {
                    console.error("Failed to fetch users:", await response.json());
                }
            } catch (error) {
                console.error("Failed to fetch users:", error);
            }
        };

        fetchUsers();
    }, []);





    const handleToggle = async (email, isChecked) => {
        try {
            const token = localStorage.getItem('auth-token');
            if (!token) {
                alert('Authentication token not found. Please log in again.');
                return;
            }
            const response = await fetch(`http://localhost:4001/approveadmin/${email}`, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'auth-token': token
                },
                body: JSON.stringify({ isApprovedAdmin: isChecked })
            });
            const data = await response.json();
            if (response.ok) {
                alert('Admin approval status updated successfully!');
                setUsers(users.map(user => user.email === email ? { ...user, isApprovedAdmin: isChecked } : user));
            } else {
                alert(data.message || 'Failed to update admin approval status');
            }
        } catch (error) {
            console.error("Failed to update admin approval status:", error);
            alert('An error occurred. Please try again.');
        }
    };

    // Debugging logs
    console.log('Current User Email:', currentUserEmail);
    console.log('Current User Name:', currentUserName);
    console.log('Users:', users);

    const sortedUsers = [...users]
        .filter(user => user.email !== currentUserEmail) // Exclude current user
        .sort((a, b) => {
            if (a.isAdmin && b.isAdmin) {
                return b.isApprovedAdmin - a.isApprovedAdmin;
            }
            return b.isAdmin - a.isAdmin;
        });


    const ToggleSwitch = ({ isChecked, onChange }) => {
        return (
            <label className="switch">
                <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) => onChange(e.target.checked)}
                />
                <span className="slider"></span>
            </label>
        );
    };

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
                                <label className="approve-admin-label">
                                    Approve Admin:
                                </label>
                                <ToggleSwitch
                                    isChecked={user.isApprovedAdmin}
                                    onChange={(checked) => handleToggle(user.email, checked)}
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
