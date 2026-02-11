import React, { useEffect, useState } from 'react';
import { FiExternalLink, FiPlus, FiTrash2 } from 'react-icons/fi';
import api from '../../api/axios';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const ProblemTracker = () => {
  const [problems, setProblems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    link: '',
    platform: 'LeetCode',
    difficulty: 'Medium',
    topic: '',
    timeTaken: '',
    status: 'Solved'
  });

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      const res = await api.get('/problems');
      setProblems(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/problems', formData);
      setShowForm(false);
      setFormData({
        title: '', link: '', platform: 'LeetCode', difficulty: 'Medium', topic: '', timeTaken: '', status: 'Solved'
      });
      fetchProblems();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Problem Tracker</h1>
          <p className="text-slate-400 mt-2">Log your daily DSA practice.</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <FiPlus /> Log Problem
        </Button>
      </div>

      {showForm && (
        <Card className="max-w-2xl mx-auto border-primary/30 shadow-primary/10">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Problem Title</label>
                <input 
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:border-primary focus:outline-none"
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  placeholder="e.g. Two Sum"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Link</label>
                <input 
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:border-primary focus:outline-none"
                  value={formData.link}
                  onChange={e => setFormData({...formData, link: e.target.value})}
                  placeholder="https://leetcode.com/..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Platform</label>
                <select 
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:border-primary focus:outline-none"
                  value={formData.platform}
                  onChange={e => setFormData({...formData, platform: e.target.value})}
                >
                  {['LeetCode', 'GFG', 'HackerRank', 'CodeStudio', 'Other'].map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Difficulty</label>
                <select 
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:border-primary focus:outline-none"
                  value={formData.difficulty}
                  onChange={e => setFormData({...formData, difficulty: e.target.value})}
                >
                  {['Easy', 'Medium', 'Hard'].map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Time Taken (mins)</label>
                <input 
                  type="number"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:border-primary focus:outline-none"
                  value={formData.timeTaken}
                  onChange={e => setFormData({...formData, timeTaken: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Topic Tag</label>
                <input 
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:border-primary focus:outline-none"
                  value={formData.topic}
                  onChange={e => setFormData({...formData, topic: e.target.value})}
                  placeholder="e.g. Arrays, DP"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button type="submit">Save Log</Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-4">
        {problems.map(problem => (
          <Card key={problem._id} className="p-4 flex flex-col md:flex-row justify-between items-center gap-4 hover:border-slate-600 transition-colors">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <span className={`w-2 h-2 rounded-full ${
                  problem.difficulty === 'Easy' ? 'bg-green-500' : 
                  problem.difficulty === 'Medium' ? 'bg-yellow-500' : 'bg-red-500'
                }`}></span>
                <h3 className="font-bold text-white text-lg">{problem.title}</h3>
                {problem.link && (
                  <a href={problem.link} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-primary">
                    <FiExternalLink />
                  </a>
                )}
              </div>
              <div className="flex gap-4 mt-2 text-sm text-slate-400">
                <span>{problem.platform}</span>
                <span>•</span>
                <span>{problem.topic || 'General'}</span>
                <span>•</span>
                <span>{new Date(problem.solvedAt).toLocaleDateString()}</span>
                {problem.timeTaken && <span>• {problem.timeTaken} mins</span>}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                problem.status === 'Solved' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 
                'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
              }`}>
                {problem.status}
              </span>
            </div>
          </Card>
        ))}
        {problems.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            No problems logged yet. Start solving!
          </div>
        )}
      </div>
    </div>
  );
};

export default ProblemTracker;
