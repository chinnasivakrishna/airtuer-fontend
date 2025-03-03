import React from 'react';
import { Briefcase, Users } from 'lucide-react';

const RoleSelection = ({ onRoleSelect }) => {
  const roles = [
    {
      id: 'jobSeeker',
      title: 'Job Seeker',
      icon: Users,
      description: 'Find jobs and connect with employers',
      color: 'bg-purple-600'
    },
    {
      id: 'recruiter',
      title: 'Job Provider/Recruiter',
      icon: Briefcase,
      description: 'Post jobs and find talented candidates',
      color: 'bg-blue-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-md w-full max-w-4xl">
        <div className="p-6">
          <h2 className="text-2xl font-semibold text-center">Choose Your Role</h2>
          <p className="text-gray-600 text-center mt-2">
            Select how you want to use our platform
          </p>
        </div>
        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            {roles.map((role) => (
              <button
                key={role.id}
                onClick={() => onRoleSelect(role.id)}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 text-left"
              >
                <div className={`${role.color} w-12 h-12 rounded-full flex items-center justify-center mb-4`}>
                  <role.icon className="text-white" size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-2">{role.title}</h3>
                <p className="text-gray-600">{role.description}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;