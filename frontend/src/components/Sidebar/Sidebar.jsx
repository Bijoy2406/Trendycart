import React from 'react';
import './Sidebar.css';
import { Link } from 'react-router-dom';
import addproduct_icon from '../Assets/cart_icon.png'
import listproduct_icon from '../Assets/Product_list_icon.svg'
import Dashboard_icon from '../Assets/dashboard_icon.png'

const Sidebar = () => {
    return (
        <div className='sidebar'>
            <Link to='/addproduct' style={{ textDecoration: 'none' }}>
                <div className="sidebar-item">
                    <img src={addproduct_icon} alt="" />
                    <p>
                        Add product
                    </p>
                </div>

            </Link>
            <Link to='/listproduct' style={{ textDecoration: 'none' }}>
                <div className="sidebar-item">
                    <img src={listproduct_icon} alt="" />
                    <p>
                        All products
                    </p>
                </div>
            </Link>
            <Link to='/dashboard' style={{ textDecoration: 'none' }}>
                <div className="sidebar-item">
                    <img src={Dashboard_icon} alt="Dashboard Icon" />
                    <p>Dashboard</p>
                </div>
            </Link>
            <Link to='/chart' style={{ textDecoration: 'none' }}>
                <div className="sidebar-item">
                    <img src={Dashboard_icon} alt="Dashboard Icon" />
                    <p>Chart</p>
                </div>
            </Link>

        </div>
    );
}

export default Sidebar;
