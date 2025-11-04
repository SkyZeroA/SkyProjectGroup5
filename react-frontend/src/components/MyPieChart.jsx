import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

function MyPieChart({ transportEmissions, dietEmissions, heatingEmissions }) {
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

// import React, { useState, useEffect } from 'react';
// import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

// // Default colors
// const DEFAULT_COLORS = ['#0088FE', '#00C49F', '#FFBB28'];
// // Colorblind-friendly palette (high contrast, distinct hues)
// const COLORBLIND_COLORS = ['#0072B2', '#E69F00', '#56B4E9'];

// function MyPieChart({ transportEmissions, dietEmissions, heatingEmissions, colorBlindMode = false }) {
//   const [windowWidth, setWindowWidth] = useState(window.innerWidth);

//   useEffect(() => {
//     const handleResize = () => setWindowWidth(window.innerWidth);
//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   const outerRadius = windowWidth < 600 ? 60 : 100;
//   const height = windowWidth < 600 ? 180 : 300;

//   const data = [
//     { name: 'Transport', value: transportEmissions },
//     { name: 'Diet', value: dietEmissions },
//     { name: 'Heating', value: heatingEmissions },
//   ];

//   // Choose palette based on colorblind mode
//   const colors = colorBlindMode ? COLORBLIND_COLORS : DEFAULT_COLORS;

//   return (
//     <ResponsiveContainer width="100%" height={height}>
//       <PieChart>
//         <Pie
//           dataKey="value"
//           data={data}
//           cx="50%"
//           cy="50%"
//           outerRadius={outerRadius}
//           label
//         >
//           {data.map((entry, index) => (
//             <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
//           ))}
//         </Pie>
//         <Tooltip />
//         <Legend />
//       </PieChart>
//     </ResponsiveContainer>
//   );
// }

// export default MyPieChart;

