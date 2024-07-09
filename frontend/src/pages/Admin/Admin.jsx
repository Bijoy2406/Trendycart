import React from 'react';
import './Admin.css';
import Sidebar from '../../components/Sidebar/Sidebar.jsx';
import { Routes, Route } from 'react-router-dom';
import Addproduct from '../../components/Addproduct/Addproduct';
import Listproduct from '../../components/Listproduct/Listproduct';

const Admin = () => {
  return (
    <div className='admin'>
      <Sidebar />
      <div className="content">
        <div className="welcome-text">
          <h2>Welcome to the admin panel.</h2> 
          <p>Here you can add, edit, or browse all of your products.</p>
        </div>
      </div>
      <Routes>
        <Route path='/addproduct' element={<Addproduct />} />
        <Route path='/listproduct' element={<Listproduct />} />
      </Routes>  
    </div>
  )
}

export default Admin;
