import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Users, Calendar, Video, Star, MessageSquare, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const Mentorship = () => {
  const [mentors, setMentors] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('mentors'); // 'mentors' or 'sessions'

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [mentorsRes, sessionsRes] = await Promise.all([
        api.get('/mentors'),
        api.get('/mentorship/sessions')
      ]);
      setMentors(mentorsRes.data);
      setSessions(sessionsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const bookSession = async (mentorId) => {
    try {
      await api.post('/mentorship/sessions', {
        mentorId,
        type: 'Mock Interview',
        date: new Date(Date.now() + 86400000 * 2) // 2 days from now
      });
      alert('Session requested successfully!');
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-400">Loading Mentorship Module...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Mentorship & Guidance</h1>
          <p className="text-slate-400 mt-2">Connect with industry experts and alumni for guidance.</p>
        </div>

        <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button 
            onClick={() => setActiveTab('mentors')}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'mentors' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Find Mentors
          </button>
          <button 
            onClick={() => setActiveTab('sessions')}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'sessions' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-400 hover:text-slate-200'}`}
          >
            My Sessions
          </button>
        </div>
      </div>

      {activeTab === 'mentors' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mentors.map((mentor, i) => (
            <motion.div
              key={mentor._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="flex flex-col items-center text-center p-8 group hover:border-primary/50 transition-all">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 border-2 border-slate-700 flex items-center justify-center text-3xl font-bold text-white mb-4 group-hover:scale-110 transition-transform overflow-hidden">
                  {mentor.username[0].toUpperCase()}
                </div>
                <h3 className="text-xl font-bold text-white">{mentor.username}</h3>
                <p className="text-primary text-sm font-medium mb-4">{mentor.profile?.targetRole || 'Industry Mentor'}</p>
                
                <div className="flex items-center gap-1 text-amber-400 mb-6">
                  {[1, 2, 3, 4, 5].map(s => <Star key={s} size={14} fill={s <= 4 ? "currentColor" : "none"} />)}
                  <span className="text-xs text-slate-500 ml-2">(12 reviews)</span>
                </div>

                <div className="grid grid-cols-2 gap-4 w-full mb-6">
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <div className="text-white font-bold text-sm">45+</div>
                    <div className="text-[10px] text-slate-500 uppercase">Sessions</div>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <div className="text-white font-bold text-sm">4.9</div>
                    <div className="text-[10px] text-slate-500 uppercase">Rating</div>
                  </div>
                </div>

                <Button className="w-full" onClick={() => bookSession(mentor._id)}>
                  Request Mentorship
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {sessions.length > 0 ? (
            sessions.map((session, i) => (
              <motion.div
                key={session._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="flex flex-col md:flex-row items-center justify-between p-6 gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      {session.type === 'Mock Interview' ? <Video size={24} /> : <MessageSquare size={24} />}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white">{session.type}</h4>
                      <p className="text-sm text-slate-400 flex items-center gap-2">
                        with <span className="text-primary font-medium">{session.mentorId?.username}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-8">
                    <div className="flex items-center gap-2 text-slate-400 text-sm">
                      <Calendar size={16} />
                      {new Date(session.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2 text-slate-400 text-sm">
                      <Clock size={16} />
                      {new Date(session.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      session.status === 'Scheduled' ? 'bg-emerald-500/10 text-emerald-500' :
                      session.status === 'Requested' ? 'bg-amber-500/10 text-amber-500' :
                      'bg-slate-800 text-slate-500'
                    }`}>
                      {session.status}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {session.status === 'Scheduled' && (
                      <Button variant="secondary" className="px-4">Join Room</Button>
                    )}
                    <Button variant="ghost" className="text-slate-400 hover:text-white">Details</Button>
                  </div>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="py-20 text-center bg-slate-900/50 rounded-2xl border border-dashed border-slate-800">
              <Users size={48} className="mx-auto text-slate-700 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No sessions yet</h3>
              <p className="text-slate-500">Book your first mentorship session with one of our experts.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Mentorship;
