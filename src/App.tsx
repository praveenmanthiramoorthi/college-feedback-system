import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout/Layout';
import LandingPage from './pages/Landing';
import LoginPage from './pages/Login';
import AdminDashboard from './pages/Admin/Dashboard';
import StaffDashboard from './pages/Staff/Dashboard';
import StudentDashboard from './pages/Student/Dashboard';
import ParentDashboard from './pages/Parent/Dashboard';
import { NotificationProvider } from './context/NotificationContext';

// Maps a user role to their home route
const getRoleHome = (role: string) => {
  switch (role) {
    case 'admin': return '/admin';
    case 'staff':
    case 'hod': return '/staff';
    case 'student': return '/student';
    case 'parent': return '/parent';
    default: return '/';
  }
};

const ProtectedRoute: React.FC<{ children: React.ReactNode; roles: string[] }> = ({ children, roles }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to={`/login/${roles[0]}`} replace />;
  }

  if (!roles.includes(user.role)) {
    return <Navigate to={getRoleHome(user.role)} replace />;
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Landing Page */}
      <Route path="/" element={<LandingPage />} />

      {/* Admin */}
      <Route path="/admin" element={
        <ProtectedRoute roles={['admin']}>
          <Layout><AdminDashboard /></Layout>
        </ProtectedRoute>
      } />

      {/* Student */}
      <Route path="/student" element={
        <ProtectedRoute roles={['student']}>
          <Layout><StudentDashboard /></Layout>
        </ProtectedRoute>
      } />

      {/* Staff + HOD */}
      <Route path="/staff" element={
        <ProtectedRoute roles={['staff', 'hod']}>
          <Layout><StaffDashboard /></Layout>
        </ProtectedRoute>
      } />

      {/* Parent */}
      <Route path="/parent" element={
        <ProtectedRoute roles={['parent']}>
          <Layout><ParentDashboard /></Layout>
        </ProtectedRoute>
      } />

      {/* Login pages */}
      <Route path="/login/:role" element={<LoginPage />} />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <BrowserRouter>
      <NotificationProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </NotificationProvider>
    </BrowserRouter>
  );
}

export default App;
