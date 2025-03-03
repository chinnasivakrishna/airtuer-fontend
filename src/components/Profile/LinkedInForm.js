import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import Cookies from 'js-cookie';

const LinkedInForm = ({ onBack }) => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/profile/linkedin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Cookies.get('token')}`
        },
        body: JSON.stringify(credentials)
      });

      const data = await response.json();
      if (data.success) {
        // Handle successful profile import
        window.location.href = '/dashboard';
      }
    } catch (error) {
      console.error('LinkedIn import error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-8">
      <button
        onClick={onBack}
        className="flex items-center text-gray-600 mb-8 hover:text-gray-800"
      >
        <ArrowLeft size={20} className="mr-2" />
        Back to options
      </button>

      <h2 className="text-2xl font-bold mb-6">Connect LinkedIn</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            LinkedIn Email
          </label>
          <input
            type="email"
            value={credentials.email}
            onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            LinkedIn Password
          </label>
          <input
            type="password"
            value={credentials.password}
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center"
        >
          {loading ? 'Importing...' : 'Import Profile'}
        </button>
      </form>
    </div>
  );
};

export default LinkedInForm;