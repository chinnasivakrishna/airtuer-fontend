import React, { useState } from 'react';
import { ArrowLeft, Upload, Check, Loader } from 'lucide-react';
import Cookies from 'js-cookie';

const ResumeUpload = ({ onBack }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && (selectedFile.type === 'application/pdf' || 
        selectedFile.type === 'application/msword' || 
        selectedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError('File size exceeds 10MB limit');
        return;
      }
      setFile(selectedFile);
      setError(null);
      setProgress(0);
    } else {
      setError('Please select a valid PDF or Word document');
    }
  };

  const handleUpload = async () => {
    if (!file) return;
  
    setUploading(true);
    setError(null);
    setProgress(0);
    
    const formData = new FormData();
    formData.append('resume', file);
    
    const token = Cookies.get('token');
    if (!token) {
      setError('Authentication token not found. Please log in again.');
      setUploading(false);
      return;
    }
  
    try {
      const response = await fetch('http://localhost:5000/api/profile/resume', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
      });

      const contentType = response.headers.get('content-type');
      let data;
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        throw new Error('Invalid response format from server');
      }

      if (!response.ok) {
        throw new Error(data.message || 'Upload failed');
      }

      if (data.success) {
        setProgress(100);
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1000);
      } else {
        throw new Error(data.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Resume upload error:', error);
      setError(error.message || 'Failed to upload resume. Please try again.');
      setProgress(0);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-8">
      <button
        onClick={onBack}
        className="flex items-center text-gray-600 mb-8 hover:text-gray-800"
      >
        <ArrowLeft size={20} className="mr-2" />
        Back to options
      </button>

      <h2 className="text-2xl font-bold mb-6">Upload Your Resume</h2>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <input
          type="file"
          onChange={handleFileChange}
          accept=".pdf,.doc,.docx"
          className="hidden"
          id="resume-upload"
        />
        
        {!file ? (
          <div>
            <Upload className="mx-auto text-gray-400 mb-4" size={48} />
            <label
              htmlFor="resume-upload"
              className="cursor-pointer text-blue-600 hover:text-blue-700"
            >
              Click to upload
            </label>
            <p className="text-gray-500 mt-2">
              Supported formats: PDF, DOC, DOCX (max 10MB)
            </p>
          </div>
        ) : (
          <div>
            <Check className="mx-auto text-green-500 mb-4" size={48} />
            <p className="text-gray-800 font-medium">{file.name}</p>
            <button
              onClick={() => {
                setFile(null);
                setError(null);
                setProgress(0);
              }}
              className="text-red-600 hover:text-red-700 mt-2"
            >
              Remove
            </button>
          </div>
        )}
      </div>

      {progress > 0 && progress < 100 && (
        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
          <div 
            className="bg-purple-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}

      {file && (
        <button
          onClick={handleUpload}
          disabled={uploading}
          className={`w-full mt-6 ${
            uploading ? 'bg-purple-400' : 'bg-purple-600 hover:bg-purple-700'
          } text-white py-3 rounded-lg transition-colors duration-200 flex items-center justify-center`}
        >
          {uploading ? (
            <>
              <Loader className="animate-spin mr-2" size={20} />
              Processing...
            </>
          ) : (
            'Upload and Continue'
          )}
        </button>
      )}
    </div>
  );
};

export default ResumeUpload;