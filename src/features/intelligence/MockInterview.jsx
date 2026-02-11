import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { MessageSquare, Video, History, Play, Send, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MockInterview = () => {
  const [interviews, setInterviews] = useState([]);
  const [activeInterview, setActiveInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      const { data } = await api.get('/interviews');
      setInterviews(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const startInterview = async (type) => {
    try {
      const { data } = await api.post('/interviews/start', { type, difficulty: 'Medium' });
      setActiveInterview(data);
      setAnswers({});
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const formattedAnswers = activeInterview.questions.map((q, idx) => ({
        questionId: q._id,
        userAnswer: answers[idx] || ''
      }));
      const { data } = await api.post(`/interviews/${activeInterview._id}/submit`, { answers: formattedAnswers });
      setActiveInterview(data);
      fetchInterviews();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-400">Loading Interview Prep...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-white">Interview Preparation</h1>
        <p className="text-slate-400 mt-2">Practice with AI-generated mock interviews for different roles and companies.</p>
      </div>

      <AnimatePresence mode="wait">
        {!activeInterview ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Start New Session */}
            <div className="lg:col-span-2 space-y-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Play className="text-primary" size={20} />
                New Interview Session
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { title: 'Technical Round', desc: 'DSA, System Design, Coding', type: 'Technical', icon: <MessageSquare /> },
                  { title: 'HR & Behavioral', desc: 'Culture fit, soft skills', type: 'HR', icon: <Video /> },
                  { title: 'System Design', desc: 'High-level architecture', type: 'System Design', icon: <Play /> },
                  { title: 'Full Mock', desc: 'Comprehensive simulation', type: 'Technical', icon: <CheckCircle2 /> },
                ].map((session, i) => (
                  <Card key={i} className="group hover:border-primary/50 transition-all cursor-pointer p-6" onClick={() => startInterview(session.type)}>
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                      {session.icon}
                    </div>
                    <h4 className="text-lg font-bold text-white mb-1">{session.title}</h4>
                    <p className="text-sm text-slate-400">{session.desc}</p>
                  </Card>
                ))}
              </div>
            </div>

            {/* History */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <History className="text-primary" size={20} />
                Recent Practice
              </h3>
              <div className="space-y-4">
                {interviews.length > 0 ? (
                  interviews.slice(0, 5).map((interview) => (
                    <Card key={interview._id} className="p-4 flex justify-between items-center">
                      <div>
                        <h4 className="text-sm font-bold text-white">{interview.type}</h4>
                        <p className="text-[10px] text-slate-500">{new Date(interview.date).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-primary">{interview.overallScore}%</div>
                        <div className="text-[10px] text-slate-500 uppercase tracking-widest">{interview.status}</div>
                      </div>
                    </Card>
                  ))
                ) : (
                  <p className="text-center py-8 text-slate-500 text-sm">No past interviews found.</p>
                )}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold text-white">{activeInterview.type} Mock Interview</h3>
                <p className="text-slate-400">Status: {activeInterview.status}</p>
              </div>
              {activeInterview.status === 'Completed' ? (
                <Button variant="secondary" onClick={() => setActiveInterview(null)}>Back to Dashboard</Button>
              ) : (
                <div className="text-slate-400 text-sm">Question {Object.keys(answers).length} / {activeInterview.questions.length}</div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Questions List */}
              <div className="space-y-4">
                {activeInterview.questions.map((q, idx) => (
                  <Card key={idx} className={`p-6 border-l-4 transition-all ${
                    activeInterview.status === 'Completed' 
                      ? (q.score >= 7 ? 'border-l-emerald-500' : 'border-l-amber-500')
                      : (answers[idx] ? 'border-l-primary' : 'border-l-slate-700')
                  }`}>
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-xs font-bold text-primary uppercase tracking-widest">Question {idx + 1}</span>
                      {activeInterview.status === 'Completed' && (
                        <span className="text-lg font-bold text-primary">{q.score}/10</span>
                      )}
                    </div>
                    <p className="text-white font-medium mb-6 text-lg">{q.question}</p>
                    
                    {activeInterview.status === 'Completed' ? (
                      <div className="space-y-4">
                        <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                          <p className="text-xs text-slate-500 mb-2 uppercase font-bold">Your Answer</p>
                          <p className="text-slate-300 italic">{q.userAnswer || 'No answer provided.'}</p>
                        </div>
                        <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                          <p className="text-xs text-primary mb-2 uppercase font-bold">Feedback</p>
                          <p className="text-slate-300">{q.feedback}</p>
                        </div>
                      </div>
                    ) : (
                      <textarea 
                        className="w-full h-32 bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-slate-300 outline-none focus:border-primary/50"
                        placeholder="Type your response here..."
                        value={answers[idx] || ''}
                        onChange={(e) => setAnswers({...answers, [idx]: e.target.value})}
                      />
                    )}
                  </Card>
                ))}
              </div>

              {/* Sidebar: Overall Stats / Controls */}
              <div className="space-y-6">
                {activeInterview.status === 'Completed' ? (
                  <Card className="text-center p-8 sticky top-24">
                    <h4 className="text-slate-400 text-sm uppercase mb-2 tracking-widest">Overall Score</h4>
                    <div className="text-7xl font-display font-black text-primary mb-4">{activeInterview.overallScore}%</div>
                    <p className="text-slate-300 mb-8">{activeInterview.overallFeedback}</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
                        <div className="text-2xl font-bold text-white">{activeInterview.questions.length}</div>
                        <div className="text-[10px] text-slate-500 uppercase">Questions</div>
                      </div>
                      <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
                        <div className="text-2xl font-bold text-white">12m</div>
                        <div className="text-[10px] text-slate-500 uppercase">Duration</div>
                      </div>
                    </div>
                  </Card>
                ) : (
                  <div className="sticky top-24 space-y-4">
                    <Card className="p-6">
                      <h4 className="font-bold text-white mb-4">Interview Guidelines</h4>
                      <ul className="space-y-3 text-sm text-slate-400">
                        <li className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5" />
                          Be as detailed as possible in your answers.
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5" />
                          Use the STAR method for behavioral questions.
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5" />
                          Explain your thought process clearly for technical rounds.
                        </li>
                      </ul>
                    </Card>
                    <Button 
                      className="w-full py-6 text-lg" 
                      onClick={handleSubmit} 
                      disabled={submitting}
                    >
                      {submitting ? 'Evaluating Performance...' : 'Submit Interview'}
                      <Send className="ml-2" size={20} />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MockInterview;
