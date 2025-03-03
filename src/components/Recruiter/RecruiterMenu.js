// RecruiterMenu.js
import React from 'react';
import { Home, Briefcase, Users, FileText, MessageSquare, Settings } from 'lucide-react';

const RecruiterMenu = ({ isExpanded, currentPath, handleNavigate }) => {
  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: Briefcase, label: 'Post Jobs', path: '/post-jobs' },
    { icon: FileText, label: 'My Job Listings', path: '/my-listings' },
    { icon: Users, label: 'Candidates', path: '/candidates' },
    { icon: MessageSquare, label: 'Messages', path: '/messages' },
    { icon: Settings, label: 'Settings', path: '/settings' }
  ];

  return (
    <nav className="mt-6">
      {menuItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentPath === item.path;

        return (
          <div
            key={item.path}
            onClick={() => handleNavigate(item.path)}
            className={`
              flex items-center px-4 py-3 cursor-pointer
              transition-colors duration-200
              ${isActive
                ? 'bg-purple-50 border-r-4 border-purple-600 text-purple-600'
                : 'text-gray-600 hover:bg-gray-50'
              }
            `}
          >
            <Icon size={20} />
            {isExpanded && (
              <span className="ml-4 transition-opacity duration-200">
                {item.label}
              </span>
            )}
          </div>
        );
      })}
    </nav>
  );
};

export default RecruiterMenu;