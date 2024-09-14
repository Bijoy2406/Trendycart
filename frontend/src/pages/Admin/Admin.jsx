import React, { useEffect, useState } from 'react';
import './Admin.css';
import Sidebar from '../../components/Sidebar/Sidebar.jsx';
import { Routes, Route } from 'react-router-dom';
import Addproduct from '../../components/Addproduct/Addproduct';
import Listproduct from '../../components/Listproduct/Listproduct';

const Admin = () => {
  const [data, setData] = useState([]);

  // Array of colors for the pie chart slices
  const colors = ["#8884d8", "#ff6f61", "#4caf50", "#ffeb3b", "#00bcd4", "#e91e63", "#9c27b0", "#3f51b5"];

  useEffect(() => {
    // Fetch data from backend
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:4001/productcountsbycategory'); // Adjust the URL as needed
        const result = await response.json();
        if (result.success) {
          // Transform data to match PieChart requirements
          const formattedData = result.productCounts.map(item => ({
            name: item.category,
            value: item.count
          }));
          setData(formattedData);
        } else {
          console.error("Error fetching data:", result.message);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

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
  );
};

export default Admin;
