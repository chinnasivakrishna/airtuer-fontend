import React from 'react';
import { Edit2, Mail, Phone, MapPin, Briefcase, Book, Award, Globe, Languages, CheckCircle, Calendar, Building } from 'lucide-react';

const ProfileDisplay = ({ profileData, onUpdateClick }) => {
  return (
    <div className="max-w-7xl mx-auto bg-gray-50 min-h-screen">
      {/* Header/Hero Section */}
      <div className="bg-gradient-to-r from-purple-700 to-purple-900 text-white py-12 px-8 mb-8">
        <div className="max-w-6xl mx-auto flex justify-between items-start">
          <div className="flex items-center gap-8">
            <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-lg">
              <span className="text-5xl font-bold text-purple-700">
                {`${profileData.firstName[0]}${profileData.lastName[0]}`}
              </span>
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">
                {`${profileData.firstName} ${profileData.lastName}`}
              </h1>
              <h2 className="text-2xl text-purple-200 mb-4">{profileData.title}</h2>
              <div className="flex items-center gap-6 text-purple-100">
                <div className="flex items-center gap-2">
                  <MapPin size={18} />
                  <span>{profileData.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={18} />
                  <span>{profileData.email}</span>
                </div>
                {profileData.phone && (
                  <div className="flex items-center gap-2">
                    <Phone size={18} />
                    <span>{profileData.phone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={onUpdateClick}
            className="bg-white text-purple-700 px-6 py-3 rounded-lg hover:bg-purple-50 transition-all duration-200 flex items-center gap-2 font-semibold shadow-lg"
          >
            <Edit2 size={18} />
            Edit Profile
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 pb-12">
        {/* Summary Section */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Professional Summary</h3>
          <p className="text-gray-600 leading-relaxed">{profileData.summary}</p>
        </div>

        <div className="grid grid-cols-3 gap-8">
          {/* Main Content - Experience & Education */}
          <div className="col-span-2 space-y-8">
            {/* Experience Section */}
            <div className="bg-white rounded-xl shadow-md p-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <Briefcase className="text-purple-600" size={24} />
                Work Experience
              </h3>
              <div className="space-y-8">
                {profileData.experience.map((exp, index) => (
                  <div key={index} className={`relative pl-8 ${index !== profileData.experience.length - 1 ? 'pb-8 border-l-2 border-purple-100' : ''}`}>
                    <div className="absolute left-0 -translate-x-1/2 w-4 h-4 rounded-full bg-purple-600"></div>
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h4 className="text-lg font-semibold text-gray-800 mb-1">{exp.position}</h4>
                      <div className="flex items-center gap-2 text-purple-600 mb-2">
                        <Building size={16} />
                        <span>{exp.company}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-500 text-sm mb-3">
                        <Calendar size={16} />
                        <span>
                          {new Date(exp.startDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} - 
                          {exp.endDate ? new Date(exp.endDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Present'}
                        </span>
                      </div>
                      <p className="text-gray-600">{exp.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Education Section */}
            <div className="bg-white rounded-xl shadow-md p-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <Book className="text-purple-600" size={24} />
                Education
              </h3>
              <div className="grid gap-6">
                {profileData.education.map((edu, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-gray-800 mb-1">{edu.degree}</h4>
                    <p className="text-purple-600 mb-2">{edu.institution}</p>
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <Calendar size={16} />
                      <span>{edu.field} • {edu.yearOfCompletion}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar - Skills, Languages, etc. */}
          <div className="space-y-8">
            {/* Skills Section */}
            <div className="bg-white rounded-xl shadow-md p-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <CheckCircle className="text-purple-600" size={24} />
                Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {profileData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-purple-50 text-purple-700 rounded-lg text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Languages Section */}
            <div className="bg-white rounded-xl shadow-md p-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Languages className="text-purple-600" size={24} />
                Languages
              </h3>
              <div className="flex flex-wrap gap-2">
                {profileData.languages.map((language, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium"
                  >
                    {language}
                  </span>
                ))}
              </div>
            </div>

            {/* Certifications Section */}
            <div className="bg-white rounded-xl shadow-md p-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Award className="text-purple-600" size={24} />
                Certifications
              </h3>
              <div className="space-y-3">
                {profileData.certifications.map((cert, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-purple-600 mt-2"></div>
                    <span className="text-gray-700">{cert}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements Section */}
            <div className="bg-white rounded-xl shadow-md p-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Globe className="text-purple-600" size={24} />
                Achievements
              </h3>
              <div className="space-y-3">
                {profileData.achievements.map((achievement, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-purple-600 mt-2"></div>
                    <span className="text-gray-700">{achievement}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDisplay;