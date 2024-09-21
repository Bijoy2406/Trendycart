import React from 'react';
import './Sidebar.css';
import { Link } from 'react-router-dom';
import addproduct_icon from '../Assets/cart_icon.png'
import listproduct_icon from '../Assets/Product_list_icon.svg'
import User_list from "../Assets/user_list.png"
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
            <Link to='/userlist' style={{ textDecoration: 'none' }}>
                <div className="sidebar-item">
                    <img src={User_list} alt="Userlist Icon" />
                    <p>Userlist</p>
                </div>
            </Link>
            <Link to='/chart' style={{ textDecoration: 'none' }}>
                <div className="sidebar-item">
                    <img src={Dashboard_icon} alt="Userlist Icon" />
                    <p>Chart</p>
                </div>
            </Link>

        </div>
    );
}

export default Sidebar;
