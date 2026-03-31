import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout/Layout';
import LoginPage from './pages/Login';
import AdminDashboard from './pages/Admin/Dashboard';
import StaffDashboard from './pages/Staff/Dashboard';
import StudentDashboard from './pages/Student/Dashboard';
import ParentDashboard from './pages/Parent/Dashboard';

// Maps a user role to their home route
const getRoleHome = (role: string) => {
  switch (role) {
    case 'admin': return '/admin';
    case 'staff':
    case 'hod': return '/staff';
    case 'parent': return '/parent';
    default: return '/';
  }
};

const ProtectedRoute: React.FC<{ children: React.ReactNode; roles: string[] }> = ({ children, roles }) => {
  const { user } = useAuth();

  // Not logged in → redirect to the login page for the first allowed role
  if (!user) {
    return <Navigate to={`/login/${roles[0]}`} replace />;
  }

  // Logged in but wrong role → send to their correct home page (prevents loop)
  if (!roles.includes(user.role)) {
    return <Navigate to={getRoleHome(user.role)} replace />;
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Student default home */}
      <Route path="/" element={
        <ProtectedRoute roles={['student']}>
          <Layout><StudentDashboard /></Layout>
        </ProtectedRoute>
      } />

      {/* Admin */}
      <Route path="/admin" element={
        <ProtectedRoute roles={['admin']}>
          <Layout><AdminDashboard /></Layout>
        </ProtectedRoute>
      } />

      {/* Staff + HOD share the same dashboard */}
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

      {/* Login pages – accessible without auth */}
      <Route path="/login/:role" element={<LoginPage />} />

      {/* Catch-all: send unauthenticated users to student login */}
      <Route path="*" element={<Navigate to="/login/student" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
