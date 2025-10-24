 import React from 'react';
    import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

    function MyPieChart({ transportEmissions, dietEmissions, heatingEmissions }) {
      const data = [
        { name: 'Transport', value: transportEmissions },
        { name: 'Diet', value: dietEmissions },
        { name: 'Heating', value: heatingEmissions },
      ];

      return (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              dataKey="value"
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
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