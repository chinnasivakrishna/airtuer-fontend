import React, { useState, useEffect } from 'react';
import { Search, MapPin, BriefcaseIcon, Filter } from 'lucide-react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';

const JobListings = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    jobType: '',
    experience: '',
    location: ''
  });
  const navigate = useNavigate();

  const fetchJobs = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/jobs', {
        headers: {
          'Authorization': `Bearer ${Cookies.get('token')}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch jobs');
      const data = await response.json();
      setJobs(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleJobClick = (jobId) => {
    navigate(`/detail/${jobId}`);
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = !filters.jobType || job.type === filters.jobType;
    const matchesLocation = !filters.location || job.location === filters.location;
    const matchesExperience = !filters.experience || (
      job.experience.min <= parseInt(filters.experience) &&
      job.experience.max >= parseInt(filters.experience)
    );

    return matchesSearch && matchesType && matchesLocation && matchesExperience;
  });

  const uniqueLocations = [...new Set(jobs.map(job => job.location))];
  const jobTypes = [...new Set(jobs.map(job => job.type))];

  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* Search and Filter Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Find Your Dream Job</h1>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search jobs or companies..."
              className="pl-10 w-full h-12 rounded-xl border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            />
          </div>
          <div className="flex gap-4">
            <select
              value={filters.jobType}
              onChange={(e) => setFilters(prev => ({ ...prev, jobType: e.target.value }))}
              className="h-12 rounded-xl border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            >
              <option value="">Job Type</option>
              {jobTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <select
              value={filters.location}
              onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
              className="h-12 rounded-xl border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            >
              <option value="">Location</option>
              {uniqueLocations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
            <select
              value={filters.experience}
              onChange={(e) => setFilters(prev => ({ ...prev, experience: e.target.value }))}
              className="h-12 rounded-xl border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            >
              <option value="">Experience</option>
              <option value="0">0-2 years</option>
              <option value="3">3-5 years</option>
              <option value="5">5+ years</option>
            </select>
          </div>
        </div>
      </div>

      {/* Job Listings Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-4">
          {error}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredJobs.map((job) => (
            <div
              key={job._id}
              onClick={() => handleJobClick(job._id)}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer hover:-translate-y-1"
            >
              <div className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-lg font-bold text-purple-600">
                      {job.company.charAt(0)}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">{job.title}</h3>
                    <p className="text-sm text-gray-600 truncate">{job.company}</p>
                  </div>
                </div>

                <div className="mt-3 space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin size={16} className="mr-1 flex-shrink-0" />
                    <span className="truncate">{job.location}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <BriefcaseIcon size={16} className="mr-1 flex-shrink-0" />
                    <span>{job.experience.min}-{job.experience.max} years</span>
                  </div>
                </div>

                <div className="mt-3">
                  <div className="flex flex-wrap gap-1">
                    {job.skills.slice(0, 2).map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                      >
                        {skill}
                      </span>
                    ))}
                    {job.skills.length > 2 && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                        +{job.skills.length - 2}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobListings;