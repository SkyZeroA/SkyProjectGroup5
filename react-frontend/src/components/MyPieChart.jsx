import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28EFF', '#FF6699', '#33CC33'];

function MyPieChart({ transportEmissions, dietEmissions, heatingEmissions, turnOffDevices, recycle, reusable, foodWaste }) {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Adjust radius/height based on screen width
  const outerRadius = windowWidth < 600 ? 60 : 100;
  const height = windowWidth < 600 ? 180 : 300;

  const data = [
    { name: 'Transport', value: transportEmissions },
    { name: 'Diet', value: dietEmissions },
    { name: 'Heating', value: heatingEmissions },
    { name: 'Lack of Turning Off Devices', value: turnOffDevices },
    { name: 'Lack of Recycling', value: recycle },
    { name: 'Lack of Reusables', value: reusable },
    { name: 'Food Waste', value: foodWaste },
  ];

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          dataKey="value"
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={outerRadius}
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}

export default MyPieChart;
