import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';


const ResumeAnalysis = ({ analysisData }) => {
  const scoreData = [
    { name: 'Overall', score: analysisData.score },
    { name: 'Skills', score: analysisData.skillsScore },
    { name: 'Experience', score: analysisData.experienceScore },
    { name: 'Education', score: analysisData.educationScore },
    { name: 'Keywords', score: analysisData.keywordsScore },
    { name: 'Format', score: analysisData.formatScore }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Resume Analysis Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scoreData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="score" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Key Findings</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-4 space-y-2">
              {analysisData.keyFindings.map((finding, index) => (
                <li key={index} className="text-gray-700">{finding}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Suggestions</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-4 space-y-2">
              {analysisData.suggestions.map((suggestion, index) => (
                <li key={index} className="text-gray-700">{suggestion}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detailed Feedback</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analysisData.feedback.map((item, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-lg">{item.category}</h3>
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full">
                    {item.score}%
                  </span>
                </div>
                <p className="text-gray-700">{item.message}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResumeAnalysis;