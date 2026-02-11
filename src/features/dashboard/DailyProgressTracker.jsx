import React, { useState, useEffect } from 'react';
import { format, subDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import { FiCheckCircle, FiCircle, FiTrendingUp, FiCalendar, FiEdit3, FiSave } from 'react-icons/fi';
import api from '../../api/axios';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const ROUNDS = [
  { id: 'Aptitude', label: 'Aptitude & Verbal' },
  { id: 'DSA', label: 'DSA & Coding' },
  { id: 'Core', label: 'Core Subjects' },
  { id: 'Projects', label: 'Projects & Dev' }
];

const DailyProgressTracker = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('last7'); // last7, last30, month
  const [editingTopics, setEditingTopics] = useState({}); // { date: text }

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await api.get('/daylogs/all');
      setLogs(res.data);
    } catch (err) {
      console.error('Failed to fetch logs', err);
    } finally {
      setLoading(false);
    }
  };

  const getDays = () => {
    const today = new Date();
    if (view === 'last7') {
      return eachDayOfInterval({ start: subDays(today, 6), end: today }).reverse();
    } else if (view === 'last30') {
      return eachDayOfInterval({ start: subDays(today, 29), end: today }).reverse();
    } else {
      return eachDayOfInterval({ start: startOfMonth(today), end: endOfMonth(today) }).reverse();
    }
  };

  const updateDayLog = async (dateStr, data) => {
    const existingLog = logs.find(l => l.date === dateStr);
    try {
      // Update local state optimistically
      const updatedLogs = existingLog 
        ? logs.map(l => l.date === dateStr ? { ...l, ...data } : l)
        : [...logs, { date: dateStr, ...data }];
      setLogs(updatedLogs);

      await api.post('/daylog', {
        date: dateStr,
        ...data
      });
    } catch (err) {
      console.error('Failed to update log', err);
      fetchLogs();
    }
  };

  const toggleRound = async (dateStr, roundId) => {
    const existingLog = logs.find(l => l.date === dateStr);
    let completedRounds = existingLog?.metrics?.completedRounds || [];
    
    if (completedRounds.includes(roundId)) {
      completedRounds = completedRounds.filter(r => r !== roundId);
    } else {
      completedRounds = [...completedRounds, roundId];
    }

    updateDayLog(dateStr, {
      metrics: {
        ...existingLog?.metrics,
        completedRounds
      }
    });
  };

  const saveTopics = async (dateStr) => {
    const topics = editingTopics[dateStr];
    await updateDayLog(dateStr, { notes: topics });
    setEditingTopics(prev => {
      const next = { ...prev };
      delete next[dateStr];
      return next;
    });
  };

  const isCompleted = (dateStr, roundId) => {
    const log = logs.find(l => l.date === dateStr);
    return log?.metrics?.completedRounds?.includes(roundId);
  };

  const getNotes = (dateStr) => {
    const log = logs.find(l => l.date === dateStr);
    return log?.notes || '';
  };

  const getCompletionRate = (roundId) => {
    const days = getDays();
    const completed = days.filter(d => isCompleted(format(d, 'yyyy-MM-dd'), roundId)).length;
    return Math.round((completed / days.length) * 100);
  };

  if (loading) return <div className="text-slate-400 p-8 text-center">Loading progress...</div>;

  const days = getDays();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <FiCalendar className="text-primary" />
            Daily Preparation Rounds
          </h2>
          <p className="text-slate-400 text-sm mt-1">Track your consistency across key placement rounds.</p>
        </div>
        
        <div className="flex bg-slate-900/50 p-1 rounded-lg border border-slate-800">
          {[
            { id: 'last7', label: '7 Days' },
            { id: 'last30', label: '30 Days' },
          ].map(opt => (
            <button
              key={opt.id}
              onClick={() => setView(opt.id)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                view === opt.id ? 'bg-primary text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {ROUNDS.map(round => (
          <Card key={round.id} className="p-4 border-slate-800 bg-slate-900/40">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-slate-400">{round.label}</span>
              <FiTrendingUp className="text-primary" size={16} />
            </div>
            <div className="flex items-end gap-2">
              <span className="text-2xl font-bold text-white">{getCompletionRate(round.id)}%</span>
              <span className="text-xs text-slate-500 mb-1.5">Consistency</span>
            </div>
            <div className="mt-3 w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-primary h-full transition-all duration-500" 
                style={{ width: `${getCompletionRate(round.id)}%` }}
              />
            </div>
          </Card>
        ))}
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/20">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900/60 border-b border-slate-800">
              <th className="p-4 text-sm font-semibold text-slate-300">Date</th>
              {ROUNDS.map(round => (
                <th key={round.id} className="p-4 text-sm font-semibold text-slate-300 text-center">
                  {round.label}
                </th>
              ))}
              <th className="p-4 text-sm font-semibold text-slate-300">Topics Learned</th>
            </tr>
          </thead>
          <tbody>
            {days.map(day => {
              const dateStr = format(day, 'yyyy-MM-dd');
              const isToday = isSameDay(day, new Date());
              const currentNotes = editingTopics[dateStr] !== undefined ? editingTopics[dateStr] : getNotes(dateStr);
              
              return (
                <tr 
                  key={dateStr} 
                  className={`border-b border-slate-800/50 hover:bg-white/5 transition-colors ${
                    isToday ? 'bg-primary/5' : ''
                  }`}
                >
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className={`text-sm font-medium ${isToday ? 'text-primary' : 'text-slate-200'}`}>
                        {format(day, 'EEE, MMM d')}
                      </span>
                      {isToday && <span className="text-[10px] uppercase tracking-wider text-primary font-bold">Today</span>}
                    </div>
                  </td>
                  {ROUNDS.map(round => (
                    <td key={round.id} className="p-4 text-center">
                      <button
                        onClick={() => toggleRound(dateStr, round.id)}
                        className={`group relative inline-flex items-center justify-center w-8 h-8 rounded-lg border-2 transition-all ${
                          isCompleted(dateStr, round.id)
                            ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20'
                            : 'bg-slate-900/50 border-slate-700 text-slate-500 hover:border-slate-500'
                        }`}
                      >
                        {isCompleted(dateStr, round.id) ? (
                          <FiCheckCircle size={18} />
                        ) : (
                          <FiCircle size={18} className="group-hover:scale-110 transition-transform" />
                        )}
                      </button>
                    </td>
                  ))}
                  <td className="p-4 min-w-[200px]">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={currentNotes}
                        placeholder="What did you learn today?"
                        onChange={(e) => setEditingTopics(prev => ({ ...prev, [dateStr]: e.target.value }))}
                        className="bg-slate-950/50 border border-slate-800 rounded px-3 py-1.5 text-sm text-slate-200 focus:outline-none focus:border-primary/50 w-full"
                      />
                      {editingTopics[dateStr] !== undefined && (
                        <button
                          onClick={() => saveTopics(dateStr)}
                          className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                          title="Save topics"
                        >
                          <FiSave size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DailyProgressTracker;
