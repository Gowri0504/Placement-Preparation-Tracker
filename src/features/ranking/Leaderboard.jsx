import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import Card from '../../components/ui/Card';
import { Trophy, Medal, Star, Users, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Leaderboard = () => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('Global');

  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        const res = await api.get('/leaderboard');
        setLeaders(res.data);
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaders();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Leaderboard</h1>
          <p className="text-slate-400">Top performers based on consistency and problem-solving</p>
        </div>
        <div className="flex gap-2 bg-slate-900/50 p-1 rounded-lg border border-slate-700">
          {['Global', 'College', 'Batch'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-md text-sm transition-all ${
                filter === f ? 'bg-primary text-white shadow-lg' : 'text-slate-400 hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
        {leaders.slice(0, 3).map((user, index) => {
          const podiumOrder = [1, 0, 2]; // Map 0->Center, 1->Left, 2->Right
          const displayUser = leaders[podiumOrder[index]];
          if (!displayUser) return null;
          
          const rank = podiumOrder[index] + 1;
          const isFirst = rank === 1;

          return (
            <motion.div
              key={displayUser._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative ${isFirst ? 'md:order-2' : podiumOrder[index] === 1 ? 'md:order-1' : 'md:order-3'}`}
            >
              <Card className={`text-center ${isFirst ? 'border-primary/50 bg-primary/5' : ''}`}>
                <div className="relative inline-block mb-4">
                  <div className={`w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center border-4 ${
                    rank === 1 ? 'border-yellow-500' : rank === 2 ? 'border-slate-300' : 'border-amber-600'
                  }`}>
                    <span className="text-2xl font-bold text-white">
                      {displayUser.username[0].toUpperCase()}
                    </span>
                  </div>
                  <div className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center shadow-lg ${
                    rank === 1 ? 'bg-yellow-500' : rank === 2 ? 'bg-slate-300' : 'bg-amber-600'
                  }`}>
                    {rank === 1 ? <Trophy size={16} className="text-slate-900" /> : <Medal size={16} className="text-slate-900" />}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-white">{displayUser.username}</h3>
                <p className="text-sm text-slate-400 mb-3">{displayUser.profile?.college || 'Unknown College'}</p>
                <div className="bg-slate-900/50 rounded-lg p-2 flex justify-around">
                  <div>
                    <p className="text-xs text-slate-500 uppercase">XP</p>
                    <p className="font-bold text-primary">{displayUser.gamification?.xp || 0}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase">Level</p>
                    <p className="font-bold text-white">{displayUser.gamification?.level || 1}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Leaderboard Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-700/50 text-slate-400 text-sm">
                <th className="px-6 py-4 font-medium">Rank</th>
                <th className="px-6 py-4 font-medium">Student</th>
                <th className="px-6 py-4 font-medium">XP</th>
                <th className="px-6 py-4 font-medium">Level</th>
                <th className="px-6 py-4 font-medium">Streak</th>
                <th className="px-6 py-4 font-medium text-right">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/30">
              {leaders.slice(3).map((user, index) => (
                <tr key={user._id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-500">#{index + 4}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-white">
                        {user.username[0].toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium text-white">{user.username}</div>
                        <div className="text-xs text-slate-500">{user.profile?.targetRole}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-primary">
                      <Star size={14} fill="currentColor" />
                      <span className="font-bold">{user.gamification?.xp || 0}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-white font-medium">{user.gamification?.level || 1}</td>
                  <td className="px-6 py-4">
                    <span className="text-orange-500 font-bold">🔥 {user.gamification?.streak || 0}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {index % 2 === 0 ? (
                      <span className="inline-flex items-center text-emerald-500 text-xs">
                        <ArrowUpRight size={14} className="mr-0.5" /> +2
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-rose-500 text-xs">
                        <ArrowDownRight size={14} className="mr-0.5" /> -1
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Leaderboard;
