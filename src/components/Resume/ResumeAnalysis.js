import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../UI/Card';
import { Alert, AlertDescription } from '../Alerts/Alert';

const ResumeAnalysis = ({ analysisData, jobRequirements }) => {
  // Transform feedback data for the chart
  const chartData = analysisData.feedback.map(item => ({
    name: item.category,
    score: item.score,
    message: item.message
  }));

  // Custom tooltip component for the bar chart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border rounded-lg shadow-lg">
          <p className="font-semibold">{data.name}</p>
          <p className="text-purple-600 font-bold">{data.score}%</p>
          <p className="text-sm text-gray-600 mt-2">{data.message}</p>
        </div>
      );
    }
    return null;
  };

  // Simple Alert component since we don't have access to the UI library version
  const SimpleAlert = ({ children }) => (
    <div className="flex items-center gap-2 p-4 border rounded-lg bg-gray-50">
      <AlertCircle className="h-4 w-4" />
      <div>{children}</div>
    </div>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Match Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis 
                  dataKey="name" 
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  interval={0}
                />
                <YAxis domain={[0, 100]} />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="score" 
                  fill="#8884d8"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Job Requirements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {jobRequirements.skills && (
                <div>
                  <h3 className="font-semibold mb-2">Required Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {jobRequirements.skills.map((skill, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {jobRequirements.experience && (
                <div>
                  <h3 className="font-semibold mb-2">Experience</h3>
                  <p className="text-gray-700">
                    {jobRequirements.experience.min}-{jobRequirements.experience.max} years
                  </p>
                </div>
              )}
              
              {jobRequirements.requirements && (
                <div>
                  <h3 className="font-semibold mb-2">Key Requirements</h3>
                  <ul className="list-disc pl-4 space-y-1">
                    {jobRequirements.requirements.map((req, index) => (
                      <li key={index} className="text-gray-700">{req}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Analysis Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Key Findings</h3>
                <ul className="list-disc pl-4 space-y-1">
                  {analysisData.keyFindings.map((finding, index) => (
                    <li key={index} className="text-gray-700">{finding}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Improvement Suggestions</h3>
                {analysisData.suggestions.length > 0 ? (
                  <ul className="list-disc pl-4 space-y-1">
                    {analysisData.suggestions.map((suggestion, index) => (
                      <li key={index} className="text-gray-700">{suggestion}</li>
                    ))}
                  </ul>
                ) : (
                  <SimpleAlert>
                    No improvement suggestions - candidate meets requirements well.
                  </SimpleAlert>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResumeAnalysis;