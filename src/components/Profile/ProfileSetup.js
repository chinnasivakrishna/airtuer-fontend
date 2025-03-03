import React, { useState, useEffect } from 'react';
import { Linkedin, FileText, ClipboardList, ArrowRight, Edit, ArrowLeft } from 'lucide-react';
import LinkedInForm from './LinkedInForm';
import ResumeUpload from './ResumeUpload';
import MultiStepForm from './MultiStepForm';
import Cookies from 'js-cookie';

const ProfileSetup = ({ onComplete, onSkip }) => {
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/profile', {
        headers: {
          'Authorization': `Bearer ${Cookies.get('token')}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch profile');
      const data = await response.json();
      setProfileData(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = async () => {
    try {
      setError(null);
      
      const response = await fetch('http://localhost:5000/api/profile/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Cookies.get('token')}`
        },
        body: JSON.stringify({ 
          isComplete: false
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to skip profile setup');
      }

      const data = await response.json();
      
      if (data.success) {
        if (onSkip) {
          onSkip();
        }
      }
    } catch (error) {
      setError(error.message);
      console.error('Error skipping profile setup:', error);
    }
  };

  const handleUpdateProfile = async (formData) => {
    try {
      const response = await fetch('http://localhost:5000/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Cookies.get('token')}`
        },
        body: JSON.stringify({ ...formData, isComplete: true })
      });
      
      if (!response.ok) throw new Error('Failed to update profile');
      
      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const methods = [
    {
      id: 'linkedin',
      title: 'Import from LinkedIn',
      icon: Linkedin,
      description: 'Quick import using your LinkedIn profile',
      color: 'bg-blue-500'
    },
    {
      id: 'resume',
      title: 'Upload Resume',
      icon: ClipboardList,
      description: 'Extract details from your resume',
      color: 'bg-green-500'
    },
    {
      id: 'form',
      title: 'Fill Form Manually',
      icon: FileText,
      description: 'Enter your details step by step',
      color: 'bg-purple-500'
    }
  ];

  const renderSelectedMethod = () => {
    switch (selectedMethod) {
      case 'linkedin':
        return <LinkedInForm onBack={() => setSelectedMethod(null)} onSubmit={handleUpdateProfile} />;
      case 'resume':
        return <ResumeUpload onBack={() => setSelectedMethod(null)} onSubmit={handleUpdateProfile} />;
      case 'form':
        return <MultiStepForm onBack={() => setSelectedMethod(null)} onSubmit={handleUpdateProfile} initialData={profileData} />;
      default:
        return null;
    }
  };

  if (loading) {
    return <div className="text-center p-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-8">Error: {error}</div>;
  }

  if (selectedMethod) {
    return renderSelectedMethod();
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Complete Your Profile</h1>
          <p className="text-gray-600 mt-2">
            Choose how you'd like to set up your AI Recruiter profile
          </p>
        </div>
        <button
          onClick={handleSkip}
          className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          Skip for now
        </button>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        {methods.map((method) => (
          <button
            key={method.id}
            onClick={() => setSelectedMethod(method.id)}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
          >
            <div className={`${method.color} w-12 h-12 rounded-full flex items-center justify-center mb-4`}>
              <method.icon className="text-white" size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2">{method.title}</h3>
            <p className="text-gray-600 mb-4">{method.description}</p>
            <div className="flex items-center text-blue-600">
              <span>Get Started</span>
              <ArrowRight size={16} className="ml-2" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProfileSetup;