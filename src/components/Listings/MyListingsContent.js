import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, Eye, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../Alerts/AlertDialog';
import { Card, CardHeader, CardTitle, CardContent } from '../UI/Card';
import Cookies from 'js-cookie';

const MyListingsContent = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteJobId, setDeleteJobId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const token = Cookies.get('token');
      const response = await fetch('http://localhost:5000/api/jobs/my-jobs', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch listings');
      const data = await response.json();
      setListings(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteJobId) return;

    try {
      const token = Cookies.get('token');
      const response = await fetch(`http://localhost:5000/api/jobs/${deleteJobId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to delete job');
      setListings(listings.filter(job => job._id !== deleteJobId));
      setDeleteJobId(null);
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
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold">My Job Listings</h2>
        </div>
        
        {error && (
          <div className="mb-4 p-4 bg-red-50 text-red-800 rounded-lg">
            {error}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicants</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posted Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {listings.map((job) => (
                <tr key={job._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{job.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      job.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button 
                      onClick={() => navigate(`/applications/${job._id}`)}
                      className="flex items-center text-purple-600 hover:text-purple-800"
                    >
                      <Users className="h-4 w-4 mr-1" />
                      View Applicants
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(job.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      <Eye 
                        className="h-5 w-5 text-blue-500 cursor-pointer" 
                        onClick={() => navigate(`/jobs/${job._id}`)}
                      />
                      <Edit2 
                        className="h-5 w-5 text-green-500 cursor-pointer"
                        onClick={() => navigate(`/edit-job/${job._id}`)}
                      />
                      <Trash2 
                        className="h-5 w-5 text-red-500 cursor-pointer"
                        onClick={() => setDeleteJobId(job._id)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AlertDialog open={!!deleteJobId} onOpenChange={() => setDeleteJobId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the job listing
              and remove all associated applications.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MyListingsContent;