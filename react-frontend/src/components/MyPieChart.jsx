import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

// Default colors
const DEFAULT_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28EFF', '#FF6699', '#33CC33'];
// Colorblind-friendly palette (high contrast, distinct hues)
const COLORBLIND_COLORS = [
  '#0072B2', // blue
  '#E69F00', // orange
  '#56B4E9', // light blue
  '#009E73', // green
  '#F0E442', // yellow
  '#D55E00', // red-orange
  '#CC79A7'  // pink/magenta
];

function MyPieChart({ transportEmissions, dietEmissions, heatingEmissions, turnOffDevices, recycle, reusable, foodWaste, colorblind }) {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [legendFontSize, setLegendFontSize] = useState(12); // Default font size

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        // For small screens (e.g., phones)
        setLegendFontSize(6);
      } else {
        // For larger screens
        setLegendFontSize(12);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const outerRadius = windowWidth < 600 ? 45 : 100;
  const height = windowWidth < 600 ? 180 : 300;

  const data = [
    { name: 'Transport', value: transportEmissions },
    { name: 'Diet', value: dietEmissions + foodWaste },
    { name: 'Heating', value: heatingEmissions },
    { name: 'Devices On', value: turnOffDevices },
    { name: 'Not Recycling/Reusing', value: recycle + reusable }
    // { name: 'Lack of Reusables', value: reusable },
    // { name: 'Food Waste', value: foodWaste },
  ];

  // Choose palette based on colorblind mode
  const colors = colorblind ? COLORBLIND_COLORS : DEFAULT_COLORS;

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
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend wrapperStyle={{ fontSize: legendFontSize }} />
      </PieChart>
    </ResponsiveContainer>
  );
}

export default MyPieChart;

