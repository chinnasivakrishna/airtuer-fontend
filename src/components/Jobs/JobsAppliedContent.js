import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Building2, 
  MapPin, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Search,
  Filter,
  Briefcase,
  Calendar,
  ArrowUpRight,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import Cookies from 'js-cookie';

const JobsAppliedContent = () => {
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [expandedItems, setExpandedItems] = useState(new Set());

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/jobs-applied/my-applications', {
        headers: {
          'Authorization': `Bearer ${Cookies.get('token')}`
        }
      });
      const data = await response.json();
      setApplications(data.applications);
      setStats(data.stats);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch applications');
      setLoading(false);
    }
  };

  const toggleDetails = (id) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      accepted: 'bg-green-100 text-green-800 border-green-300',
      rejected: 'bg-red-100 text-red-800 border-red-300',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      reviewed: 'bg-blue-100 text-blue-800 border-blue-300',
      shortlisted: 'bg-purple-100 text-purple-800 border-purple-300'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const getStatusIcon = (status) => {
    const icons = {
      accepted: <CheckCircle className="w-4 h-4" />,
      rejected: <XCircle className="w-4 h-4" />,
      reviewed: <Clock className="w-4 h-4" />,
      shortlisted: <ArrowUpRight className="w-4 h-4" />,
      pending: <AlertCircle className="w-4 h-4" />
    };
    return icons[status] || <AlertCircle className="w-4 h-4" />;
  };

  const filteredApplications = Array.isArray(applications) ? applications
    .filter(app => {
      const matchesSearch = searchTerm === '' || 
        app.job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.job.company.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
      return 0;
    }) : [];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
          <p className="text-gray-600 animate-pulse">Loading your applications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-8 p-4 bg-red-100 border border-red-400 rounded-lg">
        <p className="text-red-800">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
          <p className="text-gray-600 mt-2">Track and manage your job applications</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
        {Object.entries(stats).map(([key, value]) => (
          <div key={key} className="bg-white rounded-lg shadow p-4">
            <div className="py-4">
              <h3 className="text-sm font-medium text-gray-600 capitalize">
                {key.replace('_', ' ')}
              </h3>
            </div>
            <div className="px-4">
              <div className="text-2xl font-bold">{value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search by job title or company..."
            className="pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="w-[180px] border rounded-lg p-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="reviewed">Reviewed</option>
          <option value="shortlisted">Shortlisted</option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
        </select>
        <select
          className="w-[180px] border rounded-lg p-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>

      {/* Applications List */}
      {filteredApplications.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-4 text-lg font-medium text-gray-900">No applications found</p>
          <p className="mt-2 text-gray-600">
            {searchTerm || statusFilter !== 'all' 
              ? "Try adjusting your filters"
              : "You haven't applied to any jobs yet"}
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredApplications.map((application) => (
            <div key={application._id} className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-200">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="space-y-1">
                    <h2 className="text-xl font-semibold text-gray-900">
                      {application.job.title}
                    </h2>
                    <div className="flex items-center text-gray-600">
                      <Building2 className="w-4 h-4 mr-2" />
                      <span>{application.job.company}</span>
                    </div>
                  </div>
                  <div className={`flex items-center px-3 py-1 rounded-full border ${getStatusColor(application.status)}`}>
                    {getStatusIcon(application.status)}
                    <span className="ml-2 text-sm font-medium capitalize">
                      {application.status}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 text-gray-600 mt-4">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{application.job.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>Applied {new Date(application.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center">
                    <Briefcase className="w-4 h-4 mr-2" />
                    <span>{application.job.type}</span>
                  </div>
                </div>

                {/* Expandable Content */}
                <div className={`mt-4 space-y-4 transition-all duration-300 ${expandedItems.has(application._id) ? 'block' : 'hidden'}`}>
                  {application.coverLetter && (
                    <div className="p-4 bg-gray-50 rounded-md">
                      <h3 className="font-medium text-gray-900 mb-2">Cover Letter</h3>
                      <p className="text-gray-600">{application.coverLetter}</p>
                    </div>
                  )}

                  {application.additionalNotes && (
                    <div className="text-gray-600">
                      <h3 className="font-medium text-gray-900 mb-2">Additional Notes</h3>
                      <p>{application.additionalNotes}</p>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t flex justify-end">
                  <button 
                    onClick={() => toggleDetails(application._id)}
                    className="text-purple-600 hover:text-purple-800 font-medium flex items-center gap-1"
                  >
                    {expandedItems.has(application._id) ? (
                      <>
                        Hide Details
                        <ChevronUp className="w-4 h-4" />
                      </>
                    ) : (
                      <>
                        View Details
                        <ChevronDown className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobsAppliedContent;