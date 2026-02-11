import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import logo from '../assets/logo.svg';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      {/* Decorative background elements */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[120px]"></div>
      </div>

      <Card className="w-full max-w-md p-10 border-slate-800 shadow-2xl">
        <div className="text-center mb-8">
          <img src={logo} alt="Logo" className="w-16 h-16 mx-auto mb-4 object-contain" />
          <h1 className="text-3xl font-display font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-slate-400 text-sm">Sign in to your professional tracker.</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Email Address</label>
            <input 
              type="email" 
              required
              placeholder="name@company.com"
              className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-700 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-slate-600"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Password</label>
            <input 
              type="password" 
              required
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-700 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-slate-600"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full py-4 text-lg"
          >
            Sign In
          </Button>
        </form>

        <div className="mt-8 text-center text-sm text-slate-500">
          Don't have an account? <Link to="/signup" className="text-primary font-bold hover:text-primary-hover transition-colors">Join the Elite</Link>
        </div>
      </Card>
    </div>
  );
}
