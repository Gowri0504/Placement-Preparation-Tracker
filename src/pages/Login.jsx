import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err);
    }
  };

  return (
    <div className="min-h-screen pt-14 flex items-center justify-center bg-[#F8FAFC] relative overflow-hidden">
       {/* Background */}
       <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-100/40 via-slate-50 to-slate-50"></div>
       <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-200/20 rounded-full blur-[100px] animate-pulse"></div>

       <div className="bg-white/80 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-white/50 w-full max-w-md animate-scale-in">
         <div className="text-center mb-8">
           <h1 className="text-3xl font-serif font-bold text-slate-900 mb-2">Welcome Back</h1>
           <p className="text-slate-500 text-sm">Sign in to continue your placement journey.</p>
         </div>

         {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4 text-sm text-center">{error}</div>}

         <form onSubmit={handleSubmit} className="space-y-6">
           <div>
             <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Email</label>
             <input 
               type="email" 
               required
               className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
               value={email}
               onChange={(e) => setEmail(e.target.value)}
             />
           </div>
           <div>
             <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Password</label>
             <input 
               type="password" 
               required
               className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
               value={password}
               onChange={(e) => setPassword(e.target.value)}
             />
           </div>
           
           <button 
             type="submit" 
             className="w-full py-3.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
           >
             Sign In
           </button>
         </form>

         <div className="mt-6 text-center text-sm text-slate-500">
           New here? <Link to="/signup" className="text-indigo-600 font-bold hover:underline">Create an account</Link>
         </div>
       </div>
    </div>
  );
}
