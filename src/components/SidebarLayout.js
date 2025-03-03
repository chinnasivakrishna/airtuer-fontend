import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, LogOut, Bell, User, HelpCircle, Settings, Mic } from 'lucide-react';
import Airuter from '../assets/airuter_logo.png';
import SidebarMenu from './SidebarMenu';
import RecruiterMenu from './Recruiter/RecruiterMenu';
import JobsContent from './Jobs/JobsContent';
import AiTelephonic from './AI/AiTelephonic';
import AiVideo from './AI/AiVideo';
import ExpertVideo from './AI/ExpertVideo';
import CoursesContent from './Courses/CoursesContent';
import NotificationsContent from './Notifications/NotificationsContent';
import DashboardContent from './Dashboard/DashboardContent';
import ChatContent from './Chat/ChatContent';
import ProfileContent from './Profile/ProfileContent';
import SettingsContent from './Settings/SettingsContent';
import HelpContent from './Help/HelpContent';
import VoiceInteraction from './VoiceInteraction';
import ResumeAnalyzerPage from './Resume/ResumeAnalyzerPage';
import AuthPage from './Auth/AuthPage';
import ProfileSetup from './Profile/ProfileSetup';
import PostJobsContent from './Jobs/PostJobsContent';
import MyListingsContent from './Listings/MyListingsContent';
import CandidatesContent from './Candidates/CandidatesContent';
import MessagesContent from './Messages/MessagesContent';
import JobsAppliedContent from './Jobs/JobsAppliedContent';
import Cookies from "js-cookie"

const SidebarLayout = ({ onLogout }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [currentPath, setCurrentPath] = useState('/dashboard');
  const [userRole, setUserRole] = useState(null);
  const [profileComplete, setProfileComplete] = useState(false);
  const [showProfileSetup, setShowProfileSetup] = useState(false);

  useEffect(() => {
    checkUserRole();
    checkProfileStatus();
  }, []);

  const checkUserRole = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/profile/role', {
        headers: {
          'Authorization': `Bearer ${Cookies.get('token')}`
        }
      });
      const data = await response.json();
      setUserRole(data.role);
    } catch (error) {
      console.error('Error checking user role:', error);
    }
  };

  const checkProfileStatus = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/profile/status', {
        headers: {
          'Authorization': `Bearer ${Cookies.get('token')}`
        }
      });
      const data = await response.json();
      setProfileComplete(data.isComplete);
    } catch (error) {
      console.error('Error checking profile status:', error);
    }
  };

  const handleNavigate = (path) => {
    if (path === '/profile-setup') {
      setShowProfileSetup(true);
    } else {
      setShowProfileSetup(false);
    }
    setCurrentPath(path);
  };

  const handleProfileSetupComplete = () => {
    setProfileComplete(true);
    setShowProfileSetup(false);
    setCurrentPath('/dashboard');
  };

  const handleSkip = () => {
    setShowProfileSetup(false);
    setCurrentPath('/dashboard');
  };

  const handleLogout = () => {
    Cookies.remove('token');
    onLogout();
  };

  const renderContent = () => {
    if (showProfileSetup) {
      return <ProfileSetup onComplete={handleProfileSetupComplete} onSkip={handleSkip} />;
    }

    // Recruiter-specific routes
    if (userRole === 'recruiter') {
      switch (currentPath) {
        case '/post-jobs':
          return <PostJobsContent />;
        case '/my-listings':
          return <MyListingsContent />;
        case '/candidates':
          return <CandidatesContent />;
        case '/messages':
          return <MessagesContent />;
      }
    }

    // Common routes
    switch (currentPath) {
      case '/auth':
        return <AuthPage />;
      case '/dashboard':
        return <DashboardContent />;
      case '/resume-analyzer':
        return <ResumeAnalyzerPage />;
      case '/chat':
        return <ChatContent />;
      case '/jobs':
        return <JobsContent />;
      case '/ai-telephonic':
        return <AiTelephonic />;
      case '/ai-video':
        return <AiVideo />;
      case '/expert-video':
        return <ExpertVideo />;
      case '/courses':
        return <CoursesContent />;
      case '/notifications':
        return <NotificationsContent />;
      case '/profile':
        return <ProfileContent />;
      case '/settings':
        return <SettingsContent />;
      case '/jobs-applied':
          return <JobsAppliedContent />;
      case '/help':
        return <HelpContent />;
      case '/voice-assistant':
        return <VoiceInteraction />;
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`bg-white shadow-lg transition-all duration-300 ease-in-out ${
          isExpanded ? 'w-64' : 'w-20'
        } relative`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center overflow-hidden">
            <img src={Airuter} alt="Logo" className="w-full h-full object-cover" />
          </div>
          {isExpanded && (
            <span className="ml-3 font-semibold text-gray-700 animate-fade-in">
              Airuter
            </span>
          )}
        </div>

        {/* Toggle button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="absolute -right-3 top-20 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors"
        >
          {isExpanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>

        {/* Navigation items based on role */}
        {userRole === 'recruiter' ? (
          <RecruiterMenu
            isExpanded={isExpanded}
            currentPath={currentPath}
            handleNavigate={handleNavigate}
          />
        ) : (
          <SidebarMenu
            isExpanded={isExpanded}
            currentPath={currentPath}
            handleNavigate={handleNavigate}
          />
        )}

        {/* Logout button */}
        <div className="absolute bottom-0 w-full border-t p-4">
          <div 
            onClick={handleLogout}
            className="flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors duration-200 p-2 rounded-full"
          >
            <LogOut size={20} />
            {isExpanded && (
              <span className="ml-4">Log Out</span>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <div className="bg-white shadow-md py-4 px-6 flex items-center justify-between">
          <div className="flex items-center">
            {currentPath !== '/dashboard' && (
              <div className="mr-4 cursor-pointer hover:bg-gray-50 transition-colors duration-200 p-2 rounded-full">
                <span className="text-gray-600 font-semibold">
                  {currentPath.slice(1).split('-').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ')}
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center">
            <div 
              onClick={() => handleNavigate('/voice-assistant')}
              className="mr-4 cursor-pointer hover:bg-gray-50 transition-colors duration-200 p-2 rounded-full"
            >
              <Mic size={20} />
            </div>
            <div 
              onClick={() => handleNavigate('/profile')}
              className="mr-4 cursor-pointer hover:bg-gray-50 transition-colors duration-200 p-2 rounded-full"
            >
              <User size={20} />
            </div>
            <div 
              onClick={() => handleNavigate('/help')}
              className="mr-4 cursor-pointer hover:bg-gray-50 transition-colors duration-200 p-2 rounded-full"
            >
              <HelpCircle size={20} />
            </div>
            <div 
              onClick={() => handleNavigate('/settings')}
              className="mr-4 cursor-pointer hover:bg-gray-50 transition-colors duration-200 p-2 rounded-full"
            >
              <Settings size={20} />
            </div>
            <div 
              onClick={() => handleNavigate('/notifications')}
              className="cursor-pointer hover:bg-gray-50 transition-colors duration-200 p-2 rounded-full"
            >
              <Bell size={20} />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default SidebarLayout;