import React from 'react';

const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }) => {
  const RADIAN = Math.PI / 180;
  // Calculate the x and y positions for the label
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  // Adjust label positions based on index (you can customize this logic)
  const adjustedX = index === 0 ? x + 10 : x - 10; // Example logic for adjusting X position
  const adjustedY = index === 1 ? y + 10 : y - 10; // Example logic for adjusting Y position

  return (
    <text
      x={adjustedX}
      y={adjustedY}
      fill="black"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      style={{ fontSize: '14px', fontWeight: 'bold' }}
    >
      {`${name}`}
    </text>
  );
};

export default CustomLabel;
