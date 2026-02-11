import React, { useEffect, useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar 
} from 'recharts';
import { motion } from 'framer-motion';
import { FiActivity, FiCheckCircle, FiCode, FiTrendingUp } from 'react-icons/fi';
import api from '../../api/axios';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import DailyProgressTracker from './DailyProgressTracker';
import QuoteCard from '../../components/dashboard/QuoteCard';
import InsightsCard from '../../components/dashboard/InsightsCard';

const StatCard = ({ title, value, icon, trend, color }) => (
  <Card className="relative overflow-hidden">
    <div className={`absolute top-0 right-0 p-4 opacity-10 text-6xl ${color}`}>
      {icon}
    </div>
    <div className="relative z-10">
      <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">{title}</p>
      <h3 className="text-3xl font-bold text-white mt-1">{value}</h3>
      {trend && (
        <div className="flex items-center gap-1 mt-2 text-sm text-green-400">
          <FiTrendingUp />
          <span>{trend}</span>
        </div>
      )}
    </div>
  </Card>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [prsData, setPrsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, prsRes] = await Promise.all([
          api.get('/analytics'),
          api.get('/readiness-score')
        ]);
        setStats(statsRes.data);
        setPrsData(prsRes.data);
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Mock data for UI demo if API returns empty/error or while loading
  const mockData = {
    difficultyCounts: [
      { _id: 'Easy', count: 12 },
      { _id: 'Medium', count: 8 },
      { _id: 'Hard', count: 3 }
    ],
    skillsData: [
      { subject: 'DSA', A: 120, fullMark: 150 },
      { subject: 'OS', A: 98, fullMark: 150 },
      { subject: 'DBMS', A: 86, fullMark: 150 },
      { subject: 'Networks', A: 99, fullMark: 150 },
      { subject: 'System Design', A: 85, fullMark: 150 },
      { subject: 'Web Dev', A: 65, fullMark: 150 },
    ]
  };

  const chartData = stats?.difficultyCounts?.length ? stats.difficultyCounts.map(d => ({ name: d._id, value: d.count })) : mockData.difficultyCounts.map(d => ({ name: d._id, value: d.count }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-white">Dashboard</h1>
        <p className="text-slate-400 mt-2">Welcome back! Here's your preparation overview.</p>
      </div>

      <QuoteCard />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Solved" value={stats?.difficultyCounts?.reduce((acc, curr) => acc + curr.count, 0) || 23} icon={<FiCode />} trend="+5 this week" color="text-blue-500" />
        <StatCard title="Placement Readiness" value={prsData ? `${prsData.prs}%` : '78%'} icon={<FiTrendingUp />} trend="Target: 90%+" color="text-emerald-500" />
        <StatCard title="Topics Mastered" value="12" icon={<FiCheckCircle />} trend="+2 this week" color="text-green-500" />
        <StatCard title="Mock Interviews" value="3" icon={<FiTrendingUp />} trend="Next: Tomorrow" color="text-purple-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Readiness Breakdown */}
        <Card className="lg:col-span-1">
          <h3 className="text-xl font-bold text-white mb-6">Readiness Breakdown</h3>
          <div className="space-y-6">
            {prsData?.breakdown ? Object.entries(prsData.breakdown).map(([key, val]) => (
              <div key={key}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                  <span className="text-white font-bold">{val}%</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${val}%` }}
                    className={`h-full bg-gradient-to-r ${
                      val > 80 ? 'from-emerald-500 to-teal-500' : 
                      val > 50 ? 'from-blue-500 to-indigo-500' : 
                      'from-rose-500 to-orange-500'
                    }`}
                  />
                </div>
              </div>
            )) : (
              ['Accuracy', 'Difficulty', 'Consistency', 'Core Coverage', 'Time Efficiency'].map(label => (
                <div key={label}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-400">{label}</span>
                    <span className="text-white font-bold">{Math.floor(Math.random() * 40) + 60}%</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-primary/50 w-3/4" />
                  </div>
                </div>
              ))
            )}
            <div className="pt-4 mt-6 border-t border-slate-800">
              <p className="text-xs text-slate-500 leading-relaxed">
                Score based on: Accuracy (30%), Difficulty (25%), Consistency (20%), Time (15%), Core Coverage (10%).
              </p>
            </div>
          </div>
        </Card>

        {/* AI Insights */}
        <div className="lg:col-span-1">
          <InsightsCard prsData={prsData} stats={stats} />
        </div>

        {/* Radar Chart */}
        <Card className="lg:col-span-1 h-[400px] flex flex-col">
          <h3 className="text-xl font-bold text-white mb-6">Skill Analysis</h3>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={mockData.skillsData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} />
                <Radar
                  name="Skills"
                  dataKey="A"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  fill="#8b5cf6"
                  fillOpacity={0.3}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Main Chart */}
        <Card className="lg:col-span-3 h-[400px] flex flex-col">
          <h3 className="text-xl font-bold text-white mb-6">Problem Solving Distribution</h3>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                  itemStyle={{ color: '#f8fafc' }}
                />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border-indigo-500/30">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-bold text-white">Recommended for You</h3>
              <p className="text-slate-300 mt-2 text-sm">Based on your recent performance, we recommend focusing on <span className="text-white font-semibold">Dynamic Programming</span>.</p>
            </div>
            <Button variant="accent">Start Practice</Button>
          </div>
        </Card>
        
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-white">Recent Activity</h3>
            <Button variant="ghost" className="text-xs">View All</Button>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-800/50 transition-colors">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <div className="flex-1">
                  <p className="text-slate-200 text-sm font-medium">Solved "Merge Intervals"</p>
                  <p className="text-slate-500 text-xs">2 hours ago • LeetCode • Medium</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Daily Progress Tracker */}
      <DailyProgressTracker />
    </div>
  );
};

export default Dashboard;
