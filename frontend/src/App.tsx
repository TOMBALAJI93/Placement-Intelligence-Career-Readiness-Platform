import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { DashboardLayout } from './components/layout/DashboardLayout';

import { LandingPage } from './pages/LandingPage';
import { Login } from './pages/auth/Login';
import { Signup } from './pages/auth/Signup';
import { FacultyLogin } from './pages/auth/FacultyLogin';
import { AdminLogin } from './pages/auth/AdminLogin';

import { Dashboard } from './pages/Dashboard';
import { CompanyPrediction } from './pages/CompanyPrediction';
import { CompanyDetail } from './pages/CompanyDetail';
import { AllCompanyMatches } from './pages/AllCompanyMatches';
import { Profile } from './pages/Profile';
import { Certifications } from './pages/Certifications';
import { Internships } from './pages/Internships';
import { AITools } from './pages/AITools';
import { FacultyDashboard } from './pages/FacultyDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { CommunicationTest } from './pages/CommunicationTest';
import { CSVUploadPage } from './pages/CSVUploadPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/faculty-login" element={<FacultyLogin />} />
          <Route path="/admin-login" element={<AdminLogin />} />

          {/* Student Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute allowedRoles={['student']}>
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/csv-upload" element={
            <ProtectedRoute allowedRoles={['student', 'faculty', 'admin']}>
              <DashboardLayout>
                <CSVUploadPage />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute allowedRoles={['student']}>
              <DashboardLayout>
                <Profile />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/certifications" element={
            <ProtectedRoute allowedRoles={['student']}>
              <DashboardLayout>
                <Certifications />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/internships" element={
            <ProtectedRoute allowedRoles={['student']}>
              <DashboardLayout>
                <Internships />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/company/:companyName" element={
            <ProtectedRoute allowedRoles={['student']}>
              <DashboardLayout>
                <CompanyDetail />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/all-company-matches" element={
            <ProtectedRoute allowedRoles={['student']}>
              <DashboardLayout>
                <AllCompanyMatches />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/ai-tools" element={
            <ProtectedRoute allowedRoles={['student']}>
              <DashboardLayout>
                <AITools />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/role-analyzer" element={
            <ProtectedRoute allowedRoles={['student']}>
              <DashboardLayout>
                <CompanyPrediction />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/communication-test" element={
            <ProtectedRoute allowedRoles={['student']}>
              <DashboardLayout>
                <CommunicationTest />
              </DashboardLayout>
            </ProtectedRoute>
          } />

          {/* Faculty Protected Routes */}
          <Route path="/faculty-dashboard" element={
            <ProtectedRoute allowedRoles={['faculty']}>
              <DashboardLayout>
                <FacultyDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          } />

          {/* Admin Protected Routes */}
          <Route path="/admin-dashboard" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />

          {/* Fallback for other routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
