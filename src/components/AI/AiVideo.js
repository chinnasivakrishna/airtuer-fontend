import React, { useState } from 'react';
import InterviewRoom from './InterviewRoom';

const AiVideo = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [customLanguage, setCustomLanguage] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [isCustom, setIsCustom] = useState(false);
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [roomDetails, setRoomDetails] = useState(null);
  const [error, setError] = useState(null);

  const programmingLanguages = [
    'JavaScript',
    'Python',
    'Java',
    'C++',
    'Ruby',
    'Go',
    'Swift',
    'Rust',
    'Other',
  ];

  const difficultyLevels = [
    { value: 'easy', label: 'Easy', color: 'bg-green-500' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-500' },
    { value: 'hard', label: 'Hard', color: 'bg-red-500' },
  ];

  const handleLanguageChange = (e) => {
    const value = e.target.value;
    setSelectedLanguage(value);
    setIsCustom(value === 'Other');
    if (value !== 'Other') {
      setCustomLanguage('');
    }
  };

  const handleStartInterview = async () => {
    setError(null);
    const language = isCustom ? customLanguage : selectedLanguage;

    try {
      const response = await fetch('http://localhost:5000/api/interview/create-room', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          language,
          difficulty,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create interview room');
      }

      setRoomDetails(data);
      setIsInterviewStarted(true);
    } catch (error) {
      console.error('Error starting interview:', error);
      setError(error.message);
    }
  };

  const handleEndInterview = () => {
    setIsInterviewStarted(false);
    setSelectedLanguage('');
    setCustomLanguage('');
    setDifficulty('medium');
    setIsCustom(false);
    setRoomDetails(null);
  };

  if (isInterviewStarted && roomDetails) {
    return (
      <InterviewRoom
        language={isCustom ? customLanguage : selectedLanguage}
        difficulty={difficulty}
        roomDetails={roomDetails}
        onEnd={handleEndInterview}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-6 space-y-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Technical Interview Simulator</h1>
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Select Programming Language
          </label>
          <select
            value={selectedLanguage}
            onChange={handleLanguageChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="">Choose a language</option>
            {programmingLanguages.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>

          {isCustom && (
            <input
              type="text"
              value={customLanguage}
              onChange={(e) => setCustomLanguage(e.target.value)}
              placeholder="Enter programming language"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          )}
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Select Difficulty Level
          </label>
          <div className="flex justify-between gap-4">
            {difficultyLevels.map(({ value, label, color }) => (
              <button
                key={value}
                onClick={() => setDifficulty(value)}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all transform hover:scale-105 ${
                  difficulty === value
                    ? `${color} text-white`
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleStartInterview}
          disabled={!selectedLanguage || (isCustom && !customLanguage)}
          className={`w-full py-3 px-6 rounded-lg font-medium text-white transition-all transform hover:scale-105 ${
            !selectedLanguage || (isCustom && !customLanguage)
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          Start Mock Interview
        </button>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h2 className="text-sm font-medium text-gray-700 mb-2">Selected Options:</h2>
          <p className="text-gray-600">
            Language:{' '}
            <span className="font-medium">
              {isCustom ? customLanguage || 'Not specified' : selectedLanguage || 'Not selected'}
            </span>
          </p>
          <p className="text-gray-600">
            Difficulty:{' '}
            <span className="font-medium capitalize">{difficulty}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AiVideo;