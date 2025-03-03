import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { MessageCircle, Brain } from 'lucide-react';

// Button Component
const Button = ({ children, onClick, primary = true, className = "" }) => (
  <button
    onClick={onClick}
    className={`relative overflow-hidden px-8 py-3.5 rounded-2xl font-semibold text-base
      transition-all duration-300 ease-in-out transform hover:scale-102
      focus:outline-none focus:ring-4 focus:ring-opacity-50
      ${primary ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg' : 'bg-white text-gray-800 border border-gray-200'}
      ${className}
    `}
  >
    {children}
  </button>
);

// Select Component
const Select = ({ label, options, value, onChange, icon: Icon }) => (
  <div className="relative mb-6">
    <label className="absolute -top-3 left-3 bg-white px-2 text-sm font-medium text-gray-600 transition-all">
      {label}
    </label>
    <div className="relative">
      {Icon && (
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
          <Icon size={20} />
        </div>
      )}
      <select
        value={value}
        onChange={onChange}
        className="w-full p-4 pl-12 pr-10 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 bg-white text-gray-700 font-medium text-lg appearance-none cursor-pointer hover:border-indigo-400"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  </div>
);

// Score Card Component
const ScoreCard = ({ title, score, maxScore = 10, icon: Icon }) => (
  <div className="relative overflow-hidden bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-xl p-8 border border-gray-100">
    <div className="flex items-center space-x-4 mb-6">
      {Icon && <Icon size={28} className="text-indigo-600" />}
      <h3 className="text-xl font-bold text-gray-800">{title}</h3>
    </div>
    <div className="flex items-baseline justify-center">
      <span className="text-6xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{score}</span>
      <span className="text-2xl text-gray-400 ml-2">/ {maxScore}</span>
    </div>
  </div>
);

// Skills Chart Component
const SkillsChart = ({ skills }) => {
  const COLORS = ['#6366F1', '#34D399', '#F59E0B', '#EC4899'];

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
      <h3 className="text-2xl font-bold text-gray-800 mb-8">Skills Analysis</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={skills}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={90}
              fill="#8884d8"
              paddingAngle={8}
              dataKey="value"
            >
              {skills.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                background: 'rgba(255, 255, 255, 0.98)',
                border: 'none',
                borderRadius: '16px',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="grid grid-cols-2 gap-6 mt-8">
          {skills.map((skill, index) => (
            <div key={skill.name} className="flex items-center p-3 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="w-5 h-5 rounded-full mr-4" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
              <span className="text-base font-semibold text-gray-700">{skill.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Interview Detail Component
const InterviewDetail = ({ interview, onClose }) => (
  <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
    <h3 className="text-2xl font-bold text-gray-800 mb-4">Interview Details</h3>
    <p><strong>Programming Language:</strong> {interview.programmingLanguage}</p>
    <p><strong>Difficulty Level:</strong> {interview.difficultyLevel}</p>

    <h4 className="text-lg font-semibold mt-6">Scores</h4>
    <p><strong>Technical Skills:</strong> {interview.scores.technicalSkills}</p>
    <p><strong>Communication:</strong> {interview.scores.communication}</p>

    <h4 className="text-lg font-semibold mt-6">Feedback</h4>
    <p><strong>Weaknesses:</strong></p>
    <ul className="list-disc pl-5">
      {interview.feedback.weaknesses.map((weakness, index) => (
        <li key={index}>{weakness}</li>
      ))}
    </ul>

    <p><strong>Suggestions:</strong></p>
    <ul className="list-disc pl-5">
      {interview.feedback.suggestions.map((suggestion, index) => (
        <li key={index}>{suggestion}</li>
      ))}
    </ul>

    <button onClick={onClose} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg">
      Close
    </button>
  </div>
);

// Main Interview Component
const InterviewComponent = ({ type }) => {
  const [currentStep, setCurrentStep] = useState('form');
  const [selectedInterview, setSelectedInterview] = useState(null);

  const mockSkills = [
    { name: 'Technical Knowledge', value: 8 },
    { name: 'Problem Solving', value: 7 },
    { name: 'Communication', value: 9 },
    { name: 'Code Quality', value: 8 }
  ];

  const pastInterviews = [
    {
      id: 1,
      programmingLanguage: 'JavaScript',
      difficultyLevel: 'Intermediate',
      scores: {
        technicalSkills: 7,
        communication: 6,
      },
      feedback: {
        weaknesses: ['Code Optimization', 'Algorithm Complexity'],
        suggestions: [
          'Practice using built-in methods for optimization.',
          'Study Big O notation and practice solving algorithm problems.',
        ],
      },
    },
    {
      id: 2,
      programmingLanguage: 'Python',
      difficultyLevel: 'Beginner',
      scores: {
        technicalSkills: 8,
        communication: 9,
      },
      feedback: {
        weaknesses: ['Error Handling'],
        suggestions: [
          'Review Python exceptions and how to handle them.',
          'Practice with try-except blocks.',
        ],
      },
    },
  ];

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="mb-16 text-center">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
          {type} Interview
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Complete your technical assessment with our AI-powered interview system
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {currentStep === 'form' && (
            <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-800 mb-8">Interview Setup</h3>
              <form className="space-y-8">
                <Select
                  label="Programming Language"
                  options={[
                    { value: '', label: 'Select Programming Language' },
                    { value: 'javascript', label: 'JavaScript' },
                    { value: 'python', label: 'Python' },
                    { value: 'java', label: 'Java' }
                  ]}
                  icon={Brain}
                />
                <Select
                  label="Difficulty Level"
                  options={[
                    { value: '', label: 'Select Difficulty Level' },
                    { value: 'beginner', label: 'Beginner' },
                    { value: 'intermediate', label: 'Intermediate' },
                    { value: 'advanced', label: 'Advanced' }
                  ]}
                  icon={MessageCircle}
                />
                <div className="flex justify-end mt-8">
                  <Button className="w-full sm:w-auto">
                    Start Interview
                  </Button>
                </div>
              </form>
            </div>
          )}

          {currentStep === 'history' && (
            <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-800 mb-8">Past Interviews</h3>
              <div className="grid grid-cols-1 gap-6">
                {pastInterviews.map(interview => (
                  <div key={interview.id} className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
                    <h4 className="text-lg font-semibold">{interview.programmingLanguage} - {interview.difficultyLevel}</h4>
                    <Button 
                      onClick={() => setSelectedInterview(interview)} 
                      className="mt-2"
                    >
                      View Details
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ScoreCard title="Technical Skills" score={8} icon={Brain} />
            <ScoreCard title="Communication" score={9} icon={MessageCircle} />
          </div>
        </div>
        <div className="lg:col-span-1">
          <SkillsChart skills={mockSkills} />
        </div>
      </div>

      {selectedInterview && (
        <InterviewDetail 
          interview={selectedInterview} 
          onClose={() => setSelectedInterview(null)} 
        />
      )}
    </div>
  );
};

export default InterviewComponent;