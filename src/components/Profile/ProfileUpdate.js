import React, { useState } from 'react';
import { User, MapPin, Mail, Phone, Briefcase, Plus, X, Calendar, Building, Book, Award, Languages, CheckCircle } from 'lucide-react';

const ProfileUpdateForm = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState(initialData || {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    title: '',
    summary: '',
    skills: [],
    languages: [],
    certifications: [],
    achievements: [],
    education: [],
    experience: []
  });

  const [newSkill, setNewSkill] = useState('');
  const [newAchievement, setNewAchievement] = useState('');
  const [newLanguage, setNewLanguage] = useState('');
  const [newCertification, setCertification] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const addItem = (field, value, setter) => {
    if (value.trim()) {
      setFormData({
        ...formData,
        [field]: [...formData[field], value.trim()]
      });
      setter('');
    }
  };

  const removeItem = (field, index) => {
    setFormData({
      ...formData,
      [field]: formData[field].filter((_, i) => i !== index)
    });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Update Profile</h2>
        
        {/* Personal Information */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">Professional Summary</label>
          <textarea
            value={formData.summary}
            onChange={(e) => setFormData({...formData, summary: e.target.value})}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent h-32"
          />
        </div>

        {/* Skills Section */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <CheckCircle className="text-purple-600 mr-2" size={24} />
            <h3 className="text-lg font-semibold">Skills</h3>
          </div>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Add a skill"
              className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={() => addItem('skills', newSkill, setNewSkill)}
              className="bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Plus size={24} />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.skills.map((skill, index) => (
              <span
                key={index}
                className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full flex items-center gap-2"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => removeItem('skills', index)}
                  className="hover:text-purple-900"
                >
                  <X size={16} />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Achievements Section */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Award className="text-purple-600 mr-2" size={24} />
            <h3 className="text-lg font-semibold">Achievements</h3>
          </div>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newAchievement}
              onChange={(e) => setNewAchievement(e.target.value)}
              placeholder="Add an achievement"
              className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={() => addItem('achievements', newAchievement, setNewAchievement)}
              className="bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Plus size={24} />
            </button>
          </div>
          <div className="space-y-2">
            {formData.achievements.map((achievement, index) => (
              <div
                key={index}
                className="bg-purple-50 text-purple-700 p-3 rounded-lg flex items-center justify-between"
              >
                <span>{achievement}</span>
                <button
                  type="button"
                  onClick={() => removeItem('achievements', index)}
                  className="hover:text-purple-900"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
};

export default ProfileUpdateForm;