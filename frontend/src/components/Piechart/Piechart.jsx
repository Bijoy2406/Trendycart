// src/components/PieChart/PieChart.jsx

import React from 'react';
import { Pie } from 'react-chartjs-2';

const PieChart = () => {
  const data = {
    labels: ['Men', 'Women', 'Kids'],
    datasets: [
      {
        label: 'Product Categories',
        data: [300, 150, 100], // Example data for Men, Women, and Kids categories
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      <h3>Product Category Distribution</h3>
      <Pie data={data} />
    </div>
  );
}

export default PieChart;
