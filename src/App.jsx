import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ErrorBoundary from './components/common/ErrorBoundary';

// Feature Components
import Dashboard from './features/dashboard/Dashboard';
import TopicList from './features/topics/TopicList';
import ProblemTracker from './features/problems/ProblemTracker';
import ProjectPortfolio from './features/projects/ProjectPortfolio';
import CompanyTracker from './features/companies/CompanyTracker';
import Leaderboard from './features/ranking/Leaderboard';
import AdminDashboard from './features/admin/AdminDashboard';
import Profile from './features/auth/Profile';
import ResumeAnalyzer from './features/intelligence/ResumeAnalyzer';
import MockInterview from './features/intelligence/MockInterview';
import ResourceLibrary from './features/resources/ResourceLibrary';
import Mentorship from './features/mentorship/Mentorship';
import Forum from './features/forum/Forum';

const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }

  return <Layout />;
};

const AdminRoute = () => {
  const { user, loading } = useAuth();
  
  if (loading) return null;
  
  if (!user || (user.role !== 'admin' && user.role !== 'mentor')) {
    return <Navigate to="/" />;
  }
  
  return <Outlet />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <ErrorBoundary>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route index element={<Dashboard />} />
              <Route path="topics" element={<TopicList />} />
              <Route path="problems" element={<ProblemTracker />} />
              <Route path="projects" element={<ProjectPortfolio />} />
              <Route path="companies" element={<CompanyTracker />} />
              <Route path="leaderboard" element={<Leaderboard />} />
              <Route path="profile" element={<Profile />} />
              <Route path="resume" element={<ResumeAnalyzer />} />
              <Route path="interviews" element={<MockInterview />} />
              <Route path="resources" element={<ResourceLibrary />} />
              <Route path="mentorship" element={<Mentorship />} />
              <Route path="forum" element={<Forum />} />
              
              {/* Admin/Mentor Routes */}
              <Route element={<AdminRoute />}>
                <Route path="admin" element={<AdminDashboard />} />
              </Route>
            </Route>

            {/* 404 Route */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </ErrorBoundary>
      </AuthProvider>
    </Router>
  );
}

export default App;
