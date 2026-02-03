import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';

const Navbar = () => {
  const { user, loading, logout } = useAuth();
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="h-5 w-5 rounded-lg bg-indigo-600"></span>
          <span className="font-serif text-lg text-slate-900">Placement Tracker</span>
        </div>
        {!loading && (
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <span className="text-sm text-slate-600">Hi, {user.username}</span>
                <button
                  onClick={logout}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-sm hover:bg-slate-800 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <span className="text-sm text-slate-600">Welcome</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
