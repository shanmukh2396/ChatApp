import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { ChatProvider } from './context/ChatContext';
import { CallProvider } from './context/CallContext';

// Call Modals
import IncomingCallModal from './components/call/IncomingCallModal';
import CallModal from './components/call/CallModal';

// Route Guards & Pages
import ProtectedRoute from './routes/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import RegisterPage from './pages/RegisterPage';
import ChatDashboard from './pages/ChatDashboard';
import ProfilePage from './pages/ProfilePage';

function App() {
  return (
    <BrowserRouter>
      {/* Global Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: '#FFFFFF',
            color: '#26332B',
            border: '1px solid #C2D1C1',
            borderRadius: '14px',
            fontSize: '14px',
            boxShadow: '0 8px 24px -8px rgba(38, 51, 43, 0.15)',
          },
          success: {
            iconTheme: { primary: '#547A60', secondary: '#FFFFFF' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#FFFFFF' },
          },
        }}
      />

      <AuthProvider>
        <SocketProvider>
          <ChatProvider>
            <CallProvider>
              {/* WebRTC Global Call Modals */}
              <IncomingCallModal />
              <CallModal />

              <Routes>
                {/* Public Auth Routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Protected App Routes */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/" element={<ChatDashboard />} />
                  <Route path="/chat" element={<Navigate to="/" replace />} />
                  <Route path="/profile" element={<ProfilePage />} />
                </Route>

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </CallProvider>
          </ChatProvider>
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
