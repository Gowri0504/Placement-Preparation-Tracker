import React, { useState, useEffect, useRef } from 'react';
import api from '../../api/axios';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { MessageSquare, Video, History, Play, Send, CheckCircle2, X, CheckCircle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const QUESTION_TIME = 120; // 2 minutes per question

const MockInterview = () => {
  const [phase, setPhase] = useState('list'); // 'list' | 'instructions' | 'interview' | 'summary'
  const [interviews, setInterviews] = useState([]);
  const [activeInterview, setActiveInterview] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    fetchInterviews();
  }, []);

  useEffect(() => {
    if (phase === 'interview' && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && phase === 'interview') {
      handleNextQuestion();
    }
    return () => clearInterval(timerRef.current);
  }, [phase, currentQuestionIndex]);

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
      setCurrentQuestionIndex(0);
      setTimeLeft(QUESTION_TIME);
      setPhase('instructions');
    } catch (err) {
      console.error(err);
    }
  };

  const handleNextQuestion = () => {
    clearInterval(timerRef.current);
    if (currentQuestionIndex < activeInterview.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setTimeLeft(QUESTION_TIME);
    } else {
      handleSubmit();
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
      setPhase('summary');
    } catch (err) {
        console.error(err);
      } finally {
        setSubmitting(false);
      }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = String(seconds % 60).padStart(2, '0');
    return `${mins}:${secs}`;
  };

  if (loading) return <div className="p-8 text-center text-slate-400">Loading Interview Prep...</div>;

  return (
    <div className="min-h-screen bg-slate-950">
      <AnimatePresence mode="wait">
        {phase === 'list' && (
          <motion.div 
            key="list"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-6xl mx-auto p-6 md:p-12 space-y-8"
          >
            <div>
              <h1 className="text-3xl font-display font-bold text-white">Interview Preparation</h1>
              <p className="text-slate-400 mt-2">Practice with AI-generated mock interviews for different roles and companies.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
            </div>
          </motion.div>
        )}

        {phase === 'instructions' && (
          <motion.div 
            key="instructions"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="min-h-screen flex items-center justify-center p-6"
          >
            <Card className="max-w-2xl w-full p-8 space-y-8 border-primary/20">
              <div className="text-center">
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Play className="w-12 h-12 text-primary" />
                </div>
                <h2 className="text-3xl font-bold text-white">Get Ready!</h2>
                <p className="text-slate-400 mt-4">{activeInterview.type} Interview</p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white">Instructions</h3>
                <ul className="space-y-3 text-sm text-slate-400">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <span>You will have <strong className="text-white">{formatTime(QUESTION_TIME)}</strong> to answer each question.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <span>Once you move to the next question, you cannot go back.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <span>Try to explain your thought process clearly.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <span>The interview will auto-submit when time runs out for each question.</span>
                  </li>
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-8">
                <Card className="p-4 text-center bg-slate-900 border-slate-700">
                  <div className="text-3xl font-bold text-white">{activeInterview.questions.length}</div>
                  <div className="text-xs text-slate-500 uppercase tracking-widest">Questions</div>
                </Card>
                <Card className="p-4 text-center bg-slate-900 border-slate-700">
                  <div className="text-3xl font-bold text-white">{formatTime(QUESTION_TIME * activeInterview.questions.length)}</div>
                  <div className="text-xs text-slate-500 uppercase tracking-widest">Total Time</div>
                </Card>
              </div>

              <div className="flex justify-center gap-4 mt-8">
                <Button variant="ghost" onClick={() => setPhase('list')}>Cancel</Button>
                <Button onClick={() => setPhase('interview')}>Start Interview</Button>
              </div>
            </Card>
          </motion.div>
        )}

        {phase === 'interview' && (
          <motion.div 
            key="interview"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="min-h-screen"
          >
            <div className="fixed top-0 left-0 right-0 h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6">
              <div className="flex items-center gap-4">
                <h3 className="text-white font-semibold">{activeInterview.type} Interview</h3>
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
                  {currentQuestionIndex + 1} / {activeInterview.questions.length}
                </span>
              </div>
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${timeLeft <= 30 ? 'bg-red-500/10 text-red-400' : 'bg-slate-800 text-slate-300'}`}>
                <AlertCircle className="w-4 h-4" />
                <span className="font-mono text-lg font-bold">{formatTime(timeLeft)}</span>
              </div>
            </div>

            <div className="pt-24 pb-16 px-4 md:px-8 max-w-4xl mx-auto">
              <Card className="p-8 border-primary/10">
                <div className="mb-6">
                  <span className="text-xs font-bold text-primary uppercase tracking-widest mb-2 block">
                Question {currentQuestionIndex + 1}
              </span>
                  <h2 className="text-2xl md:text-3xl font-bold text-white">
                    {activeInterview.questions[currentQuestionIndex].question}
                  </h2>
                </div>

                <textarea 
                  className="w-full h-64 bg-slate-900 border border-slate-700 rounded-xl p-4 text-white outline-none focus:border-primary/50 resize-none"
                  placeholder="Type your answer here..."
                  value={answers[currentQuestionIndex] || ''}
                  onChange={(e) => setAnswers({ ...answers, [currentQuestionIndex]: e.target.value })}
                />
              </Card>

              <div className="flex justify-end mt-6">
                <Button 
                  onClick={handleNextQuestion} 
                  disabled={submitting}
                  className="min-w-[200px]"
                >
                  {currentQuestionIndex === activeInterview.questions.length - 1 ? 'Finish Interview' : 'Next Question'}
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {phase === 'summary' && (
          <motion.div 
            key="summary"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="min-h-screen flex items-center justify-center p-6"
          >
            <Card className="max-w-4xl w-full p-8 space-y-8">
              <div className="text-center">
                <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-12 h-12 text-emerald-400" />
                </div>
                <h2 className="text-3xl font-bold text-white">Interview Complete!</h2>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <Card className="p-6 text-center">
                  <div className="text-4xl font-black text-primary">{activeInterview.overallScore}%</div>
                  <div className="text-xs text-slate-500 uppercase tracking-widest mt-2">Overall Score</div>
                </Card>
                <Card className="p-6 text-center">
                  <div className="text-4xl font-black text-white">{activeInterview.questions.length}</div>
                  <div className="text-xs text-slate-500 uppercase tracking-widest mt-2">Questions</div>
                </Card>
                <Card className="p-6 text-center">
                  <div className="text-4xl font-black text-white">{formatTime(QUESTION_TIME * activeInterview.questions.length)}</div>
                  <div className="text-xs text-slate-500 uppercase tracking-widest mt-2">Duration</div>
                </Card>
                <Card className="p-6 text-center">
                  <div className="text-4xl font-black text-white">{activeInterview.type}</div>
                  <div className="text-xs text-slate-500 uppercase tracking-widest mt-2">Type</div>
                </Card>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white">Overall Feedback</h3>
                <Card className="p-6 bg-primary/5 border-primary/20">
                  <p className="text-slate-300">{activeInterview.overallFeedback}</p>
                </Card>
              </div>

              <div className="space-y-4 mt-8">
                <h3 className="text-xl font-semibold text-white">Question Feedback</h3>
                <div className="space-y-4">
                  {activeInterview.questions.map((q, idx) => (
                    <Card key={idx} className={`p-6 border-l-4 ${q.score >=7 ? 'border-l-emerald-500' : 'border-l-amber-500'}`}>
                      <div className="flex justify-between items-start mb-4">
                        <span className="text-xs font-bold text-primary uppercase tracking-widest">Question {idx +1}</span>
                        <span className="text-lg font-bold text-primary">{q.score}/10</span>
                      </div>
                      <p className="text-white font-medium mb-4">{q.question}</p>
                      <div className="space-y-3">
                        <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                          <p className="text-xs text-slate-500 mb-2 uppercase font-bold">Your Answer</p>
                          <p className="text-slate-300 italic">{q.userAnswer || 'No answer provided.'}</p>
                        </div>
                        <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                          <p className="text-xs text-primary mb-2 uppercase font-bold">Feedback</p>
                          <p className="text-slate-300">{q.feedback}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="flex justify-center gap-4 pt-8">
                <Button variant="ghost" onClick={() => setPhase('list')}>Back to Dashboard</Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MockInterview;