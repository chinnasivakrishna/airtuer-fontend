import React, { useState } from 'react';
import { FileText, Upload, AlertCircle } from 'lucide-react';
import DetailedAnalysis from './DetailedResumeAnalysis';
import SummaryAnalysis from '../SummaryAnalysis';

const ResumeAnalyzerPage = () => {
  const [formData, setFormData] = useState({
    jobTitle: '',
    keywords: '',
    jobDescription: ''
  });
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showDetailed, setShowDetailed] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setFileName(selectedFile.name);
      setError('');
    } else {
      setError('Please upload a PDF file');
      setFile(null);
      setFileName('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a PDF file');
      return;
    }
  
    setLoading(true);
    setError('');
    
    const formDataToSend = new FormData();
    formDataToSend.append('resume', file, file.name);
    formDataToSend.append('jobTitle', formData.jobTitle);
    formDataToSend.append('keywords', formData.keywords);
    formDataToSend.append('jobDescription', formData.jobDescription);
  
    try {
      const response = await fetch('http://localhost:5000/api/resume/analyze-pdf', {
        method: 'POST',
        body: formDataToSend,
      });
  
      if (!response.ok) {
        throw new Error('Analysis failed');
      }
  
      const result = await response.json();
      // Store only the analysis data, not the entire response
      setAnalysis(result.data);
    } catch (err) {
      setError(err.message || 'Error analyzing resume');
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };
  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-xl p-8">
        <div className="flex items-center gap-3 mb-8">
          <FileText className="h-8 w-8 text-purple-600" />
          <h1 className="text-3xl font-bold text-gray-900">Resume ATS Analyzer</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* File Upload Section */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
            <div className="flex flex-col items-center">
              <Upload className="h-12 w-12 text-gray-400 mb-4" />
              <div className="text-center">
                <label className="cursor-pointer">
                  <span className="text-purple-600 hover:text-purple-500 font-medium">
                    Click to upload
                  </span>
                  <span className="text-gray-500"> or drag and drop</span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    accept=".pdf"
                  />
                </label>
                <p className="text-sm text-gray-500 mt-1">PDF (up to 10MB)</p>
              </div>
              {fileName && (
                <div className="mt-4 text-sm text-gray-600 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  {fileName}
                </div>
              )}
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Title
              </label>
              <input
                type="text"
                value={formData.jobTitle}
                onChange={(e) => setFormData({...formData, jobTitle: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Keywords (comma-separated)
              </label>
              <input
                type="text"
                value={formData.keywords}
                onChange={(e) => setFormData({...formData, keywords: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="python, react, agile, etc."
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Description
            </label>
            <textarea
              value={formData.jobDescription}
              onChange={(e) => setFormData({...formData, jobDescription: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent h-32"
              placeholder="Paste the job description here..."
              required
            />
          </div>

          {/* Progress Bar */}
          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
              <div className="flex items-center">
                <AlertCircle className="h-4 w-4 mr-2" />
                <p>{error}</p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !file}
            className={`w-full bg-purple-600 text-white py-3 px-4 rounded-md hover:bg-purple-700 transition-colors
              ${(loading || !file) ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Analyzing...' : 'Analyze Resume'}
          </button>
        </form>

        {/* Analysis Results */}
        {analysis && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Analysis Results</h2>
            <button
              onClick={() => setShowDetailed(!showDetailed)}
              className="bg-purple-100 text-purple-600 px-4 py-2 rounded-md hover:bg-purple-200 transition-colors"
            >
              {showDetailed ? 'Show Summary' : 'View Detailed Analysis'}
            </button>
          </div>
          
          {showDetailed ? (
            <DetailedAnalysis 
              analysis={analysis} 
            />
          ) : (
            <SummaryAnalysis 
              analysis={analysis}
            />
          )}
        </div>
      )}
      </div>
    </div>
  );
};

export default ResumeAnalyzerPage;