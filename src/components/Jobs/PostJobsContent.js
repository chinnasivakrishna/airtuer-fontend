import React, { useState } from 'react';
import { Plus, X, AlertCircle, CheckCircle2 } from 'lucide-react';
import Cookies from 'js-cookie';

const PostJobsContent = () => {
  const [jobForm, setJobForm] = useState({
    title: '',
    company: '',
    description: '',
    requirements: [''],
    responsibilities: [''],
    location: '',
    type: 'full-time',
    experience: { min: 0, max: 0 },
    salary: { min: 0, max: 0, currency: 'USD' },
    skills: [''],
    benefits: [''],
    applicationDeadline: '',
    status: 'active'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleArrayFieldChange = (field, index, value) => {
    const newArray = [...jobForm[field]];
    newArray[index] = value;
    setJobForm({ ...jobForm, [field]: newArray });
  };

  const addArrayField = (field) => {
    setJobForm({
      ...jobForm,
      [field]: [...jobForm[field], '']
    });
  };

  const removeArrayField = (field, index) => {
    const newArray = jobForm[field].filter((_, i) => i !== index);
    setJobForm({ ...jobForm, [field]: newArray });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Get the token from cookies
      const token = Cookies.get('token');
      
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }

      const response = await fetch('http://localhost:5000/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Add the authorization header
        },
        credentials: 'include',
        body: JSON.stringify(jobForm)
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to post job');
      }

      const data = await response.json();
      setSuccess('Job posted successfully!');
      setError('');
      
      // Reset form after successful submission
      setJobForm({
        title: '',
        company: '',
        description: '',
        requirements: [''],
        responsibilities: [''],
        location: '',
        type: 'full-time',
        experience: { min: 0, max: 0 },
        salary: { min: 0, max: 0, currency: 'USD' },
        skills: [''],
        benefits: [''],
        applicationDeadline: '',
        status: 'active'
      });
    } catch (err) {
      setError(err.message || 'Failed to post job');
      setSuccess('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-t-xl p-8">
        <h2 className="text-3xl font-bold text-white">Post a New Job</h2>
        <p className="text-purple-100 mt-2">Create an attractive job listing to find the perfect candidate</p>
      </div>
      
      <div className="bg-white rounded-b-xl shadow-xl p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Job Title</label>
              <input
                type="text"
                value={jobForm.title}
                onChange={(e) => setJobForm({...jobForm, title: e.target.value})}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Company</label>
              <input
                type="text"
                value={jobForm.company}
                onChange={(e) => setJobForm({...jobForm, company: e.target.value})}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200"
                required
              />
            </div>
          </div>

          {/* Job Type and Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Job Type</label>
              <select
                value={jobForm.type}
                onChange={(e) => setJobForm({...jobForm, type: e.target.value})}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200"
                required
              >
                <option value="full-time">Full Time</option>
                <option value="part-time">Part Time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
                <option value="remote">Remote</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Location</label>
              <input
                type="text"
                value={jobForm.location}
                onChange={(e) => setJobForm({...jobForm, location: e.target.value})}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Description</label>
            <textarea
              value={jobForm.description}
              onChange={(e) => setJobForm({...jobForm, description: e.target.value})}
              rows={4}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200"
              required
            />
          </div>

          {/* Dynamic Fields Section */}
          <div className="space-y-6">
            {['requirements', 'responsibilities', 'skills', 'benefits'].map((field) => (
              <div key={field} className="bg-gray-50 p-6 rounded-xl">
                <label className="block text-sm font-semibold text-gray-700 capitalize mb-4">
                  {field}
                </label>
                <div className="space-y-3">
                  {jobForm[field].map((item, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => handleArrayFieldChange(field, index, e.target.value)}
                        className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200"
                        required
                      />
                      {jobForm[field].length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayField(field, index)}
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200"
                        >
                          <X size={20} />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayField(field)}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors duration-200"
                  >
                    <Plus size={16} className="mr-2" />
                    Add {field.slice(0, -1)}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Experience and Salary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-xl">
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-4">Experience Range</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-gray-600">Minimum</label>
                  <input
                    type="number"
                    value={jobForm.experience.min}
                    onChange={(e) => setJobForm({
                      ...jobForm,
                      experience: { ...jobForm.experience, min: parseInt(e.target.value) }
                    })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200"
                    min="0"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-600">Maximum</label>
                  <input
                    type="number"
                    value={jobForm.experience.max}
                    onChange={(e) => setJobForm({
                      ...jobForm,
                      experience: { ...jobForm.experience, max: parseInt(e.target.value) }
                    })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200"
                    min="0"
                    required
                  />
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-4">Salary Range</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-gray-600">Minimum</label>
                  <input
                    type="number"
                    value={jobForm.salary.min}
                    onChange={(e) => setJobForm({
                      ...jobForm,
                      salary: { ...jobForm.salary, min: parseInt(e.target.value) }
                    })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200"
                    min="0"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-600">Maximum</label>
                  <input
                    type="number"
                    value={jobForm.salary.max}
                    onChange={(e) => setJobForm({
                      ...jobForm,
                      salary: { ...jobForm.salary, max: parseInt(e.target.value) }
                    })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200"
                    min="0"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Application Deadline */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Application Deadline</label>
            <input
              type="date"
              value={jobForm.applicationDeadline}
              onChange={(e) => setJobForm({...jobForm, applicationDeadline: e.target.value})}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200"
              required
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          {/* Status Messages */}
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">
              <AlertCircle size={20} />
              <p>{error}</p>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-lg p-4">
              <CheckCircle2 size={20} />
              <p>{success}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-semibold rounded-lg shadow-lg hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transform transition-all duration-200 hover:scale-[1.02]"
          >
            Post Job
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostJobsContent;