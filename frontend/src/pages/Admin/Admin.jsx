import React, { useEffect, useState } from 'react';
import './Admin.css';
import Sidebar from '../../components/Sidebar/Sidebar.jsx';
import { Routes, Route } from 'react-router-dom';
import Addproduct from '../../components/Addproduct/Addproduct';
import Listproduct from '../../components/Listproduct/Listproduct';
import { PieChart, Pie, Tooltip } from 'recharts';

const Admin = () => {
  const [data, setData] = useState([]);

  // Array of colors for the pie chart slices
  const colors = ["#8884d8", "#ff6f61", "#4caf50", "#ffeb3b", "#00bcd4", "#e91e63", "#9c27b0", "#3f51b5"];

  useEffect(() => {
    // Fetch data from backend
    const fetchData = async () => {
      try {
        const response = await fetch('https://backend-beryl-nu-15.vercel.app/productcountsbycategory'); // Adjust the URL as needed
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

        {/* PieChart Section */}
        <div className="chart-container">
          <h2>Product Categories</h2>
          <PieChart width={400} height={400}>
            <Pie
              dataKey="value" // Field for the pie slice size
              isAnimationActive={false}
              data={data}
              cx={200}
              cy={200}
              outerRadius={150}
              fill="#8884d8" // Default color if dynamic colors are not provided
              label={({ name, value }) => `${name}: ${value}`} // Display category name and count
              // Provide colors dynamically based on the index
              colors={colors}
            />
            <Tooltip />
          </PieChart>
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
