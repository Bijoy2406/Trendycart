import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './CSS/Dashboard.css';

const Dashboard = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('https://backend-beryl-nu-15.vercel.app//allusers'); // Adjust the URL if needed
                if (response.data.success) {
                    setUsers(response.data.users);
                }
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        fetchUsers();
    }, []);

    return (
        <div className="dashboard-container">
            <h1 className="dashboard-header">User List</h1>
            <ul className="user-list">
                {users.map(user => (
                    <li key={user.email} className="user-card">
                        <div className="user-info">
                            <span className="user-name">Username: {user.name}</span>
                            <span className={`user-email ${user.isAdmin ? 'admin' : ''}`}>
                                Email: {user.email} {user.isAdmin && '(admin)'}
                            </span>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Dashboard;
