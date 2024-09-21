import React, { useEffect, useState } from 'react';
import {
  PieChart,
  Pie,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
} from 'recharts';
import './CSS/Chart.css';
import CustomLabel from './CustomLabel'; // Ensure the correct path is used

// Custom Tooltip Component
const CustomBarTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { week, count } = payload[0].payload;
    return (
      <div className="custom-tooltip">
        <p>{`Orders: ${count}`}</p>
      </div>
    );
  }
  return null;
};

const Chart = () => {
  const [data, setData] = useState([]);
  const [weeklyOrders, setWeeklyOrders] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [barHoveredIndex, setBarHoveredIndex] = useState(null);
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1); // Months are 0-based, so we add 1
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [noOrdersMessage, setNoOrdersMessage] = useState(''); // State for showing no orders message

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  const colors = [
    '#8884d8',
    '#ff6f61',
    '#4caf50',
    '#ffeb3b',
    '#00bcd4',
    '#e91e63',
    '#9c27b0',
    '#3f51b5',
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://backend-beryl-nu-15.vercel.app/productcountsbycategory');
        const result = await response.json();
        if (result.success) {
          const formattedData = result.productCounts.map((item) => ({
            name: item.category,
            value: item.count,
          }));
          formattedData.sort((a, b) => a.name.localeCompare(b.name));
          setData(formattedData);
        } else {
          console.error('Error fetching data:', result.message);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    const fetchWeeklyOrderData = async () => {
      try {
        const response = await fetch(
          `https://backend-beryl-nu-15.vercel.app/weeklyordercounts?month=${selectedMonth}&year=${selectedYear}`
        );
        const result = await response.json();
        if (result.success) {
          if (result.weeklyCounts.length === 0) {
            setWeeklyOrders([]);
            setNoOrdersMessage('No orders in this month.'); // Set message when no data is found
          } else {
            setWeeklyOrders(result.weeklyCounts);
            setNoOrdersMessage(''); // Clear message when data is found
          }
        } else {
          console.error('Error fetching weekly order data:', result.message);
        }
      } catch (error) {
        console.error('Error fetching weekly order data:', error);
      }
    };

    if (selectedMonth !== null && selectedYear !== null) {
      fetchWeeklyOrderData();
    }

    fetchData();
  }, [selectedMonth, selectedYear]);

  const getAnimationClass = (index) => {
    if (index === hoveredIndex) {
      switch (index) {
        case 0:
          return 'cell-pop-up-upper-right';
        case 1:
          return 'cell-pop-up-lower-right';
        case 2:
          return 'cell-pop-up-left';
        default:
          return 'cell-pop-up-upper-right';
      }
    }
    return 'cell-reset';
  };

  return (
    <div className="chart-container">
      <h2>Product Categories</h2>
      <PieChart width={550} height={550}>
        <Pie
          dataKey="value"
          isAnimationActive={false}
          data={data}
          cx="50%"
          cy="50%"
          outerRadius="60%"
          label={(props) => <CustomLabel {...props} />}
          onMouseEnter={(_, index) => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
          stroke="none"
          strokeWidth={0}
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={index === hoveredIndex ? '#ff9800' : colors[index % colors.length]}
              className={getAnimationClass(index)}
              stroke="none"
              strokeWidth={0}
            />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
      <h2>Weekly Orders</h2>
      <div className="date-input-container">
        <label htmlFor="month">Month:</label>
        <input
          type="number"
          id="month"
          min="1"
          max="12"
          value={selectedMonth }
          onChange={handleMonthChange}
        />

        <label htmlFor="year">Year:</label>
        <input
          type="number"
          id="year"
          min="2000"
          max="2100"
          value={selectedYear}
          onChange={handleYearChange}
        />
      </div>
      {noOrdersMessage ? (
        <h2>{noOrdersMessage}</h2> // Display message when there are no orders
      ) : (
        <BarChart width={600} height={300} data={weeklyOrders}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="week" tickFormatter={(week) => `Week ${week}`} />
          <YAxis />
          <Tooltip content={<CustomBarTooltip />} />
          <Bar
            dataKey="count"
            fill="#8884d8"
            onMouseEnter={(_, index) => setBarHoveredIndex(index)}
            onMouseLeave={() => setBarHoveredIndex(null)}
          >
            {weeklyOrders.map((entry, index) => (
              <Cell
                key={`bar-${index}`}
                fill={index === barHoveredIndex ? '#ff9800' : '#8884d8'}
              />
            ))}
          </Bar>
        </BarChart>
      )}
    </div>
  );
};

export default Chart;
