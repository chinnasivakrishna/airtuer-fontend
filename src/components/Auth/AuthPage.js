import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, Building, Globe } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import Cookies from 'js-cookie';
import RoleSelection from './RoleSelection';

const AuthPage = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showRoleSelection, setShowRoleSelection] = useState(false);
  const [showCompanyForm, setShowCompanyForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    company: {
      name: '',
      position: '',
      website: ''
    }
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    
    try {
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        }),
        credentials: 'include',
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message);
      }

      if (data.token) {
        Cookies.set('token', data.token, { expires: 7 });
        
        if (!isLogin && data.requiresRole) {
          setShowRoleSelection(true);
        } else {
          onAuthSuccess(data.role);
        }
      }
    } catch (error) {
      setError(error.message || 'An error occurred');
    }
  };

  const handleRoleSelect = async (role) => {
    try {
      if (role === 'recruiter') {
        setShowCompanyForm(true);
        setShowRoleSelection(false);
        return;
      }

      const response = await fetch('http://localhost:5000/api/auth/set-role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Cookies.get('token')}`
        },
        body: JSON.stringify({ role }),
      });

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message);
      }

      onAuthSuccess(role);
    } catch (error) {
      setError(error.message || 'An error occurred');
    }
  };

  const handleCompanySubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/auth/set-role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Cookies.get('token')}`
        },
        body: JSON.stringify({
          role: 'recruiter',
          company: formData.company
        }),
      });

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message);
      }

      onAuthSuccess('recruiter');
    } catch (error) {
      setError(error.message || 'An error occurred');
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:5000/api/auth/google';
  };

  if (showRoleSelection) {
    return <RoleSelection onRoleSelect={handleRoleSelect} />;
  }

  if (showCompanyForm) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-xl p-8">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
              Company Details
            </h2>

            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-600 rounded">
                {error}
              </div>
            )}

            <form onSubmit={handleCompanySubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={formData.company.name}
                    onChange={(e) => setFormData({
                      ...formData,
                      company: { ...formData.company, name: e.target.value }
                    })}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    placeholder="Enter company name"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Position
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={formData.company.position}
                    onChange={(e) => setFormData({
                      ...formData,
                      company: { ...formData.company, position: e.target.value }
                    })}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    placeholder="Enter your position"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Website
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="url"
                    value={formData.company.website}
                    onChange={(e) => setFormData({
                      ...formData,
                      company: { ...formData.company, website: e.target.value }
                    })}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    placeholder="Enter company website"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors duration-200 flex items-center justify-center"
              >
                <span>Complete Registration</span>
                <ArrowRight className="ml-2" size={20} />
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-2xl font-bold">A</span>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-600 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    placeholder="Enter your name"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors duration-200 flex items-center justify-center"
            >
              <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
              <ArrowRight className="ml-2" size={20} />
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center"
            >
              <FcGoogle className="mr-2" size={20} />
              <span>Google</span>
            </button>
          </form>

          <p className="mt-6 text-center text-gray-600">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="ml-1 text-purple-600 hover:underline focus:outline-none"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;