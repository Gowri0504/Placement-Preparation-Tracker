import { useState, useEffect } from 'react';
import api from '../api/axios';
import Dashboard from '../components/Dashboard';
import MotivationCard from '../components/MotivationCard';
import { useAuth } from '../context/AuthContext';
import { FaSignOutAlt, FaUserCircle } from 'react-icons/fa';

export default function Home() {
  const { user, logout } = useAuth();
  const [motivation, setMotivation] = useState('');
  const [greeting, setGreeting] = useState('');
  const [todayProgress, setTodayProgress] = useState(0);

  const fetchMotivation = async () => {
    try {
      const res = await api.get('/api/motivation');
      setMotivation(res.data.quote);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTodayProgress = async () => {
    try {
      const todayStr = new Date().toISOString().split('T')[0];
      const res = await api.get(`/api/daylog/${todayStr}`);
      
      if (res.data && res.data.rounds) {
        let completedRounds = 0;
        const totalRounds = 4; // Total number of rounds
        
        Object.values(res.data.rounds).forEach(round => {
          if (round.completed) completedRounds++;
        });
        
        setTodayProgress(Math.round((completedRounds / totalRounds) * 100));
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMotivation();
    fetchTodayProgress();
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-indigo-500/30 selection:text-indigo-900 relative overflow-x-hidden">
      {/* Sophisticated Background */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-100/40 via-slate-50 to-slate-50"></div>
      <div className="fixed top-0 left-0 w-full h-full opacity-30 pointer-events-none" 
           style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%2364748b\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Executive Header */}
        <header className="mb-12 flex flex-col md:flex-row justify-between items-end gap-6 animate-fade-in">
          <div className="w-full md:w-auto">
            <div className="flex items-center gap-3 mb-2">
              <span className="h-px w-8 bg-indigo-600"></span>
              <p className="text-indigo-900 font-bold tracking-widest uppercase text-xs">{greeting}, {user?.username || 'Future Engineer'}</p>
            </div>
            <h1 className="text-5xl md:text-6xl font-serif font-medium text-slate-900 tracking-tight leading-tight">
              Placement <span className="italic text-indigo-900">Tracker</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
             <div className="hidden md:block text-right mr-4">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Current Session</p>
                <p className="text-sm font-semibold text-slate-700">Spring 2026 Cohort</p>
             </div>
             
             <div className="flex items-center gap-4">
               <div className="glass-panel px-6 py-3 rounded-2xl flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Today</p>
                    <p className="text-lg font-serif font-bold text-slate-800 leading-none">
                      {new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                    </p>
                  </div>
               </div>

               <button 
                 onClick={logout}
                 className="p-4 rounded-2xl bg-white border border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all duration-300"
                 title="Logout"
               >
                 <FaSignOutAlt />
               </button>
             </div>
          </div>
        </header>

        {/* Hero Section: Motivation + Stats Widget */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2 transform hover:-translate-y-1 transition-transform duration-500">
             {motivation && <MotivationCard quote={motivation} onRefresh={fetchMotivation} />}
          </div>
          
          {/* Innovative 'Daily Progress' Widget */}
          <div className="glass-panel rounded-3xl p-6 lg:col-span-1 flex flex-col justify-between animate-slide-up relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-2xl -mr-10 -mt-10 transition-all duration-700 group-hover:bg-indigo-100"></div>
            
            <div className="relative z-10">
              <h3 className="font-serif text-xl text-slate-800 mb-1">Daily Focus</h3>
              <p className="text-sm text-slate-500 mb-6">Track your consistency score.</p>
              
              <div className="flex items-end gap-2 mb-2">
                <span className="text-4xl font-bold text-indigo-900">{todayProgress}</span>
                <span className="text-lg font-medium text-slate-400 mb-1">%</span>
              </div>
              
              <div className="w-full bg-slate-100 rounded-full h-2 mb-4 overflow-hidden">
                <div 
                  className="bg-indigo-900 h-2 rounded-full transition-all duration-1000 ease-out group-hover:bg-indigo-700"
                  style={{ width: `${todayProgress}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between text-xs font-medium text-slate-400">
                <span>Problem Solving</span>
                <span className="text-emerald-600">+12% vs yest.</span>
              </div>
            </div>

            <button className="mt-6 w-full py-3 rounded-xl border border-indigo-100 text-indigo-900 font-semibold text-sm hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2 group/btn">
              View Analytics
              <svg className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
        </div>

        <main className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <Dashboard />
        </main>

        <footer className="mt-20 border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center text-slate-400 text-sm">
          <p className="font-medium">© {new Date().getFullYear()} Placement Tracker Elite.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <span className="hover:text-indigo-900 cursor-pointer transition-colors">Privacy</span>
            <span className="hover:text-indigo-900 cursor-pointer transition-colors">Terms</span>
            <span className="hover:text-indigo-900 cursor-pointer transition-colors">Support</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
