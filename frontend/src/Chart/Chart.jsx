import React from 'react';
import './Chart.css';
import { PieChart, Pie, Tooltip } from 'recharts';

const Chart = () => {
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
  );
};

export default Chart;
