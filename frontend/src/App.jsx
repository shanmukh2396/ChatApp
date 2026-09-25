import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { ChatProvider } from './context/ChatContext';

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
            background: '#0f172a',
            color: '#f8fafc',
            border: '1px solid #1e293b',
            borderRadius: '14px',
            fontSize: '14px',
            boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.5)',
          },
          success: {
            iconTheme: { primary: '#3b82f6', secondary: '#f8fafc' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#f8fafc' },
          },
        }}
      />

      <AuthProvider>
        <SocketProvider>
          <ChatProvider>
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
          </ChatProvider>
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
