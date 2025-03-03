import React, { useState, useEffect } from 'react';
import { Search, MapPin, BriefcaseIcon, ArrowLeft, Upload, Building2, Clock, DollarSign } from 'lucide-react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';

const JobDetail = () => {
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [applicationData, setApplicationData] = useState({
    coverLetter: '',
    additionalNotes: '',
    resume: null
  });
  const [submitting, setSubmitting] = useState(false);
  const [applicationError, setApplicationError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const jobId = location.pathname.split('/').pop();

  useEffect(() => {
    const fetchJobDetail = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/jobs/${jobId}`, {
          headers: {
            'Authorization': `Bearer ${Cookies.get('token')}`
          }
        });
        if (!response.ok) throw new Error('Failed to fetch job details');
        const data = await response.json();
        setJob(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetail();
  }, [jobId]);

  const handleApplicationSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setApplicationError('');

    try {
      const formData = new FormData();
      formData.append('resume', applicationData.resume);
      formData.append('coverLetter', applicationData.coverLetter);
      formData.append('additionalNotes', applicationData.additionalNotes);

      const response = await fetch(`http://localhost:5000/api/applications/${jobId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Cookies.get('token')}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to submit application');
      }

      // Success
      setShowApplicationForm(false);
      alert('Application submitted successfully!');
      navigate('/');
    } catch (err) {
      setApplicationError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setApplicationData(prev => ({
        ...prev,
        resume: file
      }));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent shadow-lg"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg shadow-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-red-800">Error</h3>
              <p className="mt-1 text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => navigate('/')}
          className="group flex items-center text-gray-600 hover:text-purple-600 mb-8 transition-colors duration-200"
        >
          <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
          <span className="font-medium">Back to Jobs</span>
        </button>

        {job && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-purple-800 p-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="text-white">
                  <h1 className="text-3xl font-bold">{job.title}</h1>
                  <div className="flex items-center mt-3">
                    <Building2 size={20} className="mr-2" />
                    <p className="text-xl text-purple-100">{job.company}</p>
                  </div>
                </div>
                <span className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-white text-purple-700">
                  {job.type}
                </span>
              </div>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-purple-50 p-6 rounded-xl">
                <div className="flex items-center">
                  <MapPin size={24} className="text-purple-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium text-gray-900">{job.location}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <BriefcaseIcon size={24} className="text-purple-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Experience</p>
                    <p className="font-medium text-gray-900">{job.experience.min}-{job.experience.max} years</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Clock size={24} className="text-purple-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Posted</p>
                    <p className="font-medium text-gray-900">2 days ago</p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Required Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 rounded-full text-sm font-medium bg-purple-100 text-purple-800 hover:bg-purple-200 transition-colors duration-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Job Description</h2>
                <div className="prose max-w-none text-gray-600 leading-relaxed">
                  {job.description}
                </div>
              </div>

              <div className="mt-8">
                {!showApplicationForm ? (
                  <button
                    className="w-full py-4 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-xl font-medium hover:from-purple-700 hover:to-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02]"
                    onClick={() => setShowApplicationForm(true)}
                  >
                    Apply for this position
                  </button>
                ) : (
                  <form onSubmit={handleApplicationSubmit} className="space-y-6 bg-gray-50 p-6 rounded-xl">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Resume
                      </label>
                      <div className="flex items-center justify-center w-full">
                        <label className="w-full flex flex-col items-center px-4 py-6 bg-white text-purple-600 rounded-xl shadow-sm border-2 border-purple-200 cursor-pointer hover:border-purple-400 hover:bg-purple-50 transition-all duration-200">
                          <Upload size={24} />
                          <span className="mt-2 text-base leading-normal">
                            {applicationData.resume ? applicationData.resume.name : 'Select your resume'}
                          </span>
                          <input
                            type="file"
                            className="hidden"
                            accept=".pdf,.doc,.docx"
                            onChange={handleFileChange}
                            required
                          />
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Cover Letter
                      </label>
                      <textarea
                        value={applicationData.coverLetter}
                        onChange={(e) => setApplicationData(prev => ({
                          ...prev,
                          coverLetter: e.target.value
                        }))}
                        rows={4}
                        className="w-full rounded-xl border-purple-200 shadow-sm focus:border-purple-500 focus:ring-purple-500 transition-colors duration-200"
                        placeholder="Write your cover letter here..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Additional Notes
                      </label>
                      <textarea
                        value={applicationData.additionalNotes}
                        onChange={(e) => setApplicationData(prev => ({
                          ...prev,
                          additionalNotes: e.target.value
                        }))}
                        rows={3}
                        className="w-full rounded-xl border-purple-200 shadow-sm focus:border-purple-500 focus:ring-purple-500 transition-colors duration-200"
                        placeholder="Any additional information you'd like to share..."
                      />
                    </div>

                    {applicationError && (
                      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm text-red-700">{applicationError}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => setShowApplicationForm(false)}
                        className="flex-1 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-xl font-medium hover:from-purple-700 hover:to-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 transform hover:scale-[1.02]"
                      >
                        {submitting ? 'Submitting...' : 'Submit Application'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobDetail;