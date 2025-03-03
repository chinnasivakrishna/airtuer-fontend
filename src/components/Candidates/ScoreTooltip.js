import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const ScoreTooltip = ({ analysis }) => {
  if (!analysis || !analysis.feedback) return null;

  const data = analysis.feedback.map(item => ({
    name: item.category,
    value: item.score,
    message: item.message
  }));

  const COLORS = ['#4ade80', '#60a5fa', '#f472b6'];

  return (
    <div className="absolute z-50 bg-white rounded-lg shadow-lg p-4 w-64">
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={30}
              outerRadius={60}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              content={({ payload }) => {
                if (payload && payload.length) {
                  const item = payload[0].payload;
                  return (
                    <div className="bg-gray-800 text-white p-2 rounded">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm">{item.value}%</p>
                      <p className="text-xs mt-1">{item.message}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 space-y-1">
        {data.map((item, index) => (
          <div key={index} className="flex items-center text-sm">
            <div 
              className="w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <span className="font-medium">{item.name}:</span>
            <span className="ml-1">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScoreTooltip;