import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const DetailedResumeAnalysis = ({ analysis }) => {
  // Add error checking
  if (!analysis || !analysis.skillsScore) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
        <p className="text-gray-600">Analysis data not available</p>
      </div>
    );
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  const pieData = [
    { name: 'Skills Match', value: analysis.skillsScore },
    { name: 'Experience', value: analysis.experienceScore },
    { name: 'Education', value: analysis.educationScore },
    { name: 'Keywords Match', value: analysis.keywordsScore },
    { name: 'Format & Structure', value: analysis.formatScore }
  ];

  // Ensure keyFindings and suggestions exist
  const keyFindings = analysis.keyFindings || [];
  const suggestions = analysis.suggestions || [];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
      <h2 className="text-2xl font-bold mb-6">Detailed Resume Analysis</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-80">
          <h3 className="text-xl font-semibold mb-4">Score Distribution</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Key Findings</h3>
            <ul className="space-y-4">
              {keyFindings.map((finding, index) => (
                <li key={index} className="flex items-start">
                  <span className="w-2 h-2 mt-2 mr-2 bg-blue-500 rounded-full"></span>
                  <span>{finding}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Improvement Suggestions</h3>
            <ul className="space-y-4">
              {suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start">
                  <span className="w-2 h-2 mt-2 mr-2 bg-yellow-500 rounded-full"></span>
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailedResumeAnalysis;