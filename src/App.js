import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useParams } from 'react-router-dom';
import { HMSRoomProvider } from '@100mslive/react-sdk';
import SidebarLayout from './components/SidebarLayout';
import AuthPage from './components/Auth/AuthPage';
import InterviewRoom from './AI/InterviewRoom';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if the user is authenticated (you can modify this logic if needed)
    setIsAuthenticated(true); // Assume the user is authenticated for simplicity
  }, []);

  return (
    <Router>
      <HMSRoomProvider>
        <div>
          {isAuthenticated ? (
            <Routes>
              {/* Main layout with sidebar */}
              <Route path="/*" element={<SidebarLayout />} />
              
              {/* Interview Room route */}
              <Route path="/interview/:roomId" element={<InterviewRoom />} />
            </Routes>
          ) : (
            <AuthPage />
          )}
        </div>
      </HMSRoomProvider>
    </Router>
  );
};

export default App;