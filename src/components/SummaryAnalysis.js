import React from 'react';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const SummaryAnalysis = ({ analysis }) => {
  // Add a check for analysis existence
  if (!analysis) return null;

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreIcon = (score) => {
    if (score >= 80) return <CheckCircle className="h-5 w-5 text-green-600" />;
    if (score >= 60) return <AlertCircle className="h-5 w-5 text-yellow-600" />;
    return <XCircle className="h-5 w-5 text-red-600" />;
  };

  // Create a formatted feedback array that includes all scores
  const formattedFeedback = [
    {
      category: 'Skills Match',
      score: analysis.skillsScore,
      message: analysis.feedback?.find(f => f.category === 'Skills Match')?.message || 
               'Assessment of technical and professional skills'
    },
    {
      category: 'Experience',
      score: analysis.experienceScore,
      message: analysis.feedback?.find(f => f.category === 'Experience')?.message || 
               'Evaluation of relevant work experience'
    },
    {
      category: 'Education',
      score: analysis.educationScore,
      message: 'Assessment of educational qualifications'
    },
    {
      category: 'Keywords Match',
      score: analysis.keywordsScore,
      message: 'Match rate with job-specific keywords'
    },
    {
      category: 'Format & Structure',
      score: analysis.formatScore,
      message: 'Resume formatting and organization'
    }
  ];

  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      {/* Overall Score */}
      <div className="text-center mb-8">
        <div className="text-4xl font-bold mb-2">
          <span className={getScoreColor(analysis.score)}>
            {analysis.score}%
          </span>
        </div>
        <p className="text-gray-600">Overall Match Score</p>
      </div>

      {/* Score Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {formattedFeedback.map((item, index) => (
          <div 
            key={index}
            className="bg-white p-4 rounded-lg shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-gray-700">{item.category}</span>
              <div className="flex items-center gap-2">
                <span className={`font-bold ${getScoreColor(item.score)}`}>
                  {item.score}%
                </span>
                {getScoreIcon(item.score)}
              </div>
            </div>
            <p className="text-sm text-gray-600">{item.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SummaryAnalysis;