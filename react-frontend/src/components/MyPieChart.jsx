import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { Card, CardContent } from "../components/Card";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

function MyPieChart({ transportEmissions, dietEmissions, heatingEmissions }) {
  const data = [
    { name: 'Transport', value: transportEmissions },
    { name: 'Diet', value: dietEmissions },
    { name: 'Heating', value: heatingEmissions },
  ];

  return (
    <Card className="flex-1 bg-white border rounded-lg flex-shrink-0 overflow-auto">
      <CardContent className="p-6">
        <h2 className="[font-family:'Sky_Text',Helvetica] text-2xl font-bold text-center text-gray-900">
          Projected Emissions Breakdown
        </h2>
        <div className="flex items-center justify-center">
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
        </div>
      </CardContent>
    </Card>
  );
}

export default MyPieChart;