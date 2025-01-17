import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, LogOut, Bell, User, HelpCircle, Settings, Mic } from 'lucide-react';
import Airuter from './airuter_logo.png';
import SidebarMenu from './SidebarMenu';
import JobsContent from './JobsContent';
import AiTelephonic from './AiTelephonic';
import AiVideo from './AiVideo';
import ExpertVideo from './ExpertVideo';
import CoursesContent from './CoursesContent';
import NotificationsContent from './NotificationsContent';
import DashboardContent from './DashboardContent';
import ChatContent from './ChatContent';
import ProfileContent from './ProfileContent';
import SettingsContent from './SettingsContent';
import HelpContent from './HelpContent';
import VoiceInteraction from './VoiceInteraction';
import ResumeAnalyzerPage from './ResumeAnalyzerPage';

const SidebarLayout = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [currentPath, setCurrentPath] = useState('/dashboard');

  const handleNavigate = (path) => {
    setCurrentPath(path);
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
          {isExpanded ? (
            <ChevronLeft size={20} />
          ) : (
            <ChevronRight size={20} />
          )}
        </button>

        {/* Navigation items */}
        <SidebarMenu
          isExpanded={isExpanded}
          currentPath={currentPath}
          handleNavigate={handleNavigate}
        />

        {/* Logout button */}
        <div className="absolute bottom-0 w-full border-t p-4 flex justify-center">
          <div className="cursor-pointer hover:bg-gray-50 transition-colors duration-200 p-2 rounded-full d-flex">
          <span className="ml-4 transition-opacity duration-200">
                Log Out
              </span><LogOut size={20} />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">

{/* Navbar */}
<div className="bg-white shadow-md py-4 px-6 flex items-center justify-between">
  <div className="flex items-center">
    {currentPath !== '/dashboard' && currentPath !== '/jobs' && (
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

{/* Update the content section to include the new VoiceInteraction component */}
<div className="flex-1 overflow-auto p-8">
  {currentPath === '/dashboard' && <DashboardContent />}
  {currentPath === '/resume-analyzer' && <ResumeAnalyzerPage />}
  {currentPath === '/chat' && <ChatContent />}
  {currentPath === '/jobs' && <JobsContent />}
  {currentPath === '/ai-telephonic' && <AiTelephonic />}
  {currentPath === '/ai-video' && <AiVideo />}
  {currentPath === '/expert-video' && <ExpertVideo />}
  {currentPath === '/courses' && <CoursesContent />}
  {currentPath === '/notifications' && <NotificationsContent />}
  {currentPath === '/profile' && <ProfileContent />}
  {currentPath === '/settings' && <SettingsContent />}
  {currentPath === '/help' && <HelpContent />}
  {currentPath === '/voice-assistant' && <VoiceInteraction />}
</div>
      </div>
    </div>
  );
};

export default SidebarLayout;