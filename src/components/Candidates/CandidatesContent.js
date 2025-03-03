import React, { useState, useEffect } from 'react';
import { Search, Download, Calendar, Clock } from 'lucide-react';
import Cookies from 'js-cookie';
import { Card, CardHeader, CardTitle, CardContent } from '../UI/Card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../UI/Dialog';
import { Alert } from '../Alerts/Alert';
import { AlertDialog as AlertDescription } from '../Alerts/AlertDialog';
import ScoreTooltip from './ScoreTooltip';

const CandidatesContent = () => {
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    reviewed: 0,
    shortlisted: 0,
    rejected: 0
  });
  const [hoveredApplication, setHoveredApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedJobType, setSelectedJobType] = useState('all');
  const [showAnalysisDialog, setShowAnalysisDialog] = useState(false);
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [analysisMap, setAnalysisMap] = useState({});
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [interviewDetails, setInterviewDetails] = useState({
    document: '',
    date: '',
    time: '',
    duration: 30 // Default duration in minutes
  });

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      searchApplications();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, selectedStatus, selectedJobType]);

  const fetchApplications = async () => {
    try {
      setError('');
      const token = Cookies.get('token');
      if (!token) throw new Error('Authentication token not found');

      const response = await fetch('http://localhost:5000/api/applications/company', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data = await response.json();
      setApplications(data.applications);
      setStats(data.stats);

      // Fetch analysis for each application
      await Promise.all(data.applications.map(fetchAnalysis));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalysis = async (application) => {
    try {
      const token = Cookies.get('token');
      const response = await fetch(`http://localhost:5000/api/applications/${application._id}/analysis`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const analysisData = await response.json();
        setAnalysisMap(prev => ({
          ...prev,
          [application._id]: analysisData
        }));
      }
    } catch (error) {
      console.error(`Error fetching analysis for application ${application._id}:`, error);
    }
  };

  const searchApplications = async () => {
    try {
      setError('');
      const token = Cookies.get('token');
      if (!token) throw new Error('Authentication token not found');

      const params = new URLSearchParams({
        ...(searchTerm && { searchTerm }),
        ...(selectedStatus !== 'all' && { status: selectedStatus }),
        ...(selectedJobType !== 'all' && { jobType: selectedJobType })
      });

      const response = await fetch(`http://localhost:5000/api/applications/search?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data = await response.json();
      setApplications(data.applications);
      setStats(data.stats);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      const token = Cookies.get('token');
      const response = await fetch(`http://localhost:5000/api/applications/${applicationId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      await fetchApplications();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleExport = () => {
    const csvContent = [
      ['Name', 'Email', 'Job Title', 'Status', 'Match %', 'Applied Date'],
      ...applications.map(app => [
        app.applicant.name,
        app.applicant.email,
        app.job.title,
        app.status,
        analysisMap[app._id]?.feedback?.[0]?.score || 'N/A',
        new Date(app.createdAt).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'applications.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const renderMatchCell = (application) => {
    const analysis = analysisMap[application._id];

    if (!analysis) {
      return (
        <td className="px-6 py-4">
          <div className="text-sm text-gray-500">Analysis not available</div>
        </td>
      );
    }

    const overallScore = analysis.feedback.find(f => f.category === 'Overall Match')?.score ||
                        analysis.feedback[0]?.score || 0;

    return (
      <td className="px-6 py-4 relative">
        <div
          className="flex items-center cursor-pointer"
          onMouseEnter={() => setHoveredApplication(application._id)}
          onMouseLeave={() => setHoveredApplication(null)}
          onClick={() => {
            setSelectedAnalysis(analysis);
            setShowAnalysisDialog(true);
          }}
        >
          <div className="w-16 text-sm font-medium">
            {Math.round(overallScore)}%
          </div>
          <div className="w-24 h-2 bg-gray-200 rounded">
            <div
              className="h-full bg-green-500 rounded"
              style={{ width: `${overallScore}%` }}
            />
          </div>
          {hoveredApplication === application._id && (
            <ScoreTooltip analysis={analysis} />
          )}
        </div>
      </td>
    );
  };

  const handleSendInterviewLink = (application) => {
    setSelectedApplication(application);
    setShowInterviewModal(true);
  };

  const handleInterviewSubmit = async () => {
    try {
      const token = Cookies.get('token');
      const response = await fetch('http://localhost:5000/api/interview/schedule', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          applicationId: selectedApplication._id,
          document: interviewDetails.document,
          date: interviewDetails.date,
          time: interviewDetails.time,
          duration: interviewDetails.duration
        })
      });

      if (!response.ok) {
        throw new Error('Failed to schedule interview');
      }

      const data = await response.json();
      alert('Interview scheduled successfully!');
      setShowInterviewModal(false);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Applications Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <Card className="p-4">
              <div className="text-lg font-semibold">Total</div>
              <div className="text-3xl font-bold text-purple-600">{stats.total}</div>
            </Card>
            <Card className="p-4">
              <div className="text-lg font-semibold">Pending</div>
              <div className="text-3xl font-bold text-yellow-600">{stats.pending}</div>
            </Card>
            <Card className="p-4">
              <div className="text-lg font-semibold">Reviewed</div>
              <div className="text-3xl font-bold text-blue-600">{stats.reviewed}</div>
            </Card>
            <Card className="p-4">
              <div className="text-lg font-semibold">Shortlisted</div>
              <div className="text-3xl font-bold text-green-600">{stats.shortlisted}</div>
            </Card>
            <Card className="p-4">
              <div className="text-lg font-semibold">Rejected</div>
              <div className="text-3xl font-bold text-red-600">{stats.rejected}</div>
            </Card>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                placeholder="Search applications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-40 px-4 py-2 border border-gray-300 rounded-lg bg-white"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="reviewed">Reviewed</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="rejected">Rejected</option>
            </select>

            <select
              value={selectedJobType}
              onChange={(e) => setSelectedJobType(e.target.value)}
              className="w-40 px-4 py-2 border border-gray-300 rounded-lg bg-white"
            >
              <option value="all">All Types</option>
              <option value="full-time">Full Time</option>
              <option value="part-time">Part Time</option>
              <option value="contract">Contract</option>
              <option value="internship">Internship</option>
            </select>

            <button
              onClick={handleExport}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Download className="mr-2 h-4 w-4" />
              Export
            </button>
          </div>

          {error && (
            <Alert className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Applications Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Candidate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Job
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Match %
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applied Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Send Interview Link
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {applications.map((application) => (
                  <tr key={application._id}>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{application.applicant.name}</div>
                        <div className="text-sm text-gray-500">{application.applicant.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{application.job.title}</div>
                      <div className="text-sm text-gray-500">{application.job.type}</div>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={application.status}
                        onChange={(e) => handleStatusChange(application._id, e.target.value)}
                        className="w-32 px-2 py-1 border border-gray-300 rounded-lg bg-white"
                      >
                        <option value="pending">Pending</option>
                        <option value="reviewed">Reviewed</option>
                        <option value="shortlisted">Shortlisted</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </td>
                    {renderMatchCell(application)}
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(application.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleSendInterviewLink(application)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                      >
                        Send Link
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Interview Scheduling Modal */}
      <Dialog open={showInterviewModal} onOpenChange={setShowInterviewModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule Mock Interview</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Document (URL or Text)</label>
              <textarea
                value={interviewDetails.document}
                onChange={(e) => setInterviewDetails({ ...interviewDetails, document: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg"
                rows={4}
                placeholder="Paste the document URL or text here..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <input
                  type="date"
                  value={interviewDetails.date}
                  onChange={(e) => setInterviewDetails({ ...interviewDetails, date: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Time</label>
                <input
                  type="time"
                  value={interviewDetails.time}
                  onChange={(e) => setInterviewDetails({ ...interviewDetails, time: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Duration (minutes)</label>
              <input
                type="number"
                value={interviewDetails.duration}
                onChange={(e) => setInterviewDetails({ ...interviewDetails, duration: parseInt(e.target.value) })}
                className="w-full p-2 border border-gray-300 rounded-lg"
                min={15}
                max={120}
              />
            </div>
          </div>
          <DialogFooter>
            <button
              onClick={handleInterviewSubmit}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Schedule Interview
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Analysis Dialog */}
      <Dialog open={showAnalysisDialog} onOpenChange={setShowAnalysisDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Resume Analysis</DialogTitle>
          </DialogHeader>
          {selectedAnalysis && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Key Findings</h3>
                <ul className="list-disc pl-5">
                  {selectedAnalysis.keyFindings.map((finding, index) => (
                    <li key={index}>{finding}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Suggestions</h3>
                <ul className="list-disc pl-5">
                  {selectedAnalysis.suggestions.map((suggestion, index) => (
                    <li key={index}>{suggestion}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          <DialogFooter>
            <button
              onClick={() => setShowAnalysisDialog(false)}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
            >
              Close
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CandidatesContent;