import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import ProfileDisplay from './ProfileDisplay';
import ProfileUpdateForm from './ProfileUpdate';

const ProfileContent = () => {
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
      
      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }
      
      const data = await response.json();
      setProfileData(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (updatedData) => {
    try {
      setError(null);
      const response = await fetch('http://localhost:5000/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Cookies.get('token')}`
        },
        body: JSON.stringify(updatedData)
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      await fetchProfileData();
      setIsEditing(false);
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <div className="text-red-500 text-lg mb-4">Error: {error}</div>
        <button
          onClick={fetchProfileData}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="text-center p-8">
        <div className="text-gray-600 text-lg mb-4">No profile data found</div>
        <button
          onClick={() => setIsEditing(true)}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          Create Profile
        </button>
      </div>
    );
  }

  if (isEditing) {
    return (
      <ProfileUpdateForm
        initialData={profileData}
        onSubmit={handleProfileUpdate}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <ProfileDisplay
      profileData={profileData}
      onUpdateClick={() => setIsEditing(true)}
    />
  );
};

export default ProfileContent;