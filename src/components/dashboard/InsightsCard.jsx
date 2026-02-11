import React from 'react';
import { FiTrendingUp, FiAlertCircle, FiCheckCircle, FiTarget } from 'react-icons/fi';
import Card from '../ui/Card';
import { motion } from 'framer-motion';

const InsightsCard = ({ prsData, stats }) => {
  const getInsights = () => {
    const insights = [];
    if (!prsData) return [];

    const { breakdown, prs } = prsData;

    // Consistency Insight
    if (breakdown.consistency < 60) {
      insights.push({
        type: 'improvement',
        title: 'Consistency is Low',
        desc: 'You missed a few days of practice recently. Aim for a 5-day streak to boost your readiness by 10%.',
        icon: <FiAlertCircle className="text-rose-400" />,
        color: 'border-rose-500/20 bg-rose-500/5'
      });
    } else {
      insights.push({
        type: 'success',
        title: 'Great Consistency!',
        desc: 'You are maintaining a steady learning pace. Keep it up to solidify your muscle memory.',
        icon: <FiCheckCircle className="text-emerald-400" />,
        color: 'border-emerald-500/20 bg-emerald-500/5'
      });
    }

    // Accuracy vs Difficulty Insight
    if (breakdown.accuracy < 70 && breakdown.difficulty > 50) {
      insights.push({
        type: 'improvement',
        title: 'Focus on Easy/Medium',
        desc: 'Your accuracy is dipping on harder problems. Try solving 5-10 Easy problems to regain confidence.',
        icon: <FiTarget className="text-amber-400" />,
        color: 'border-amber-500/20 bg-amber-500/5'
      });
    }

    // Core Coverage Insight
    if (breakdown.coreCoverage < 40) {
      insights.push({
        type: 'priority',
        title: 'Core Subjects Needed',
        desc: 'Your OS and DBMS coverage is low. These are critical for technical interviews.',
        icon: <FiTrendingUp className="text-blue-400" />,
        color: 'border-blue-500/20 bg-blue-500/5'
      });
    }

    return insights;
  };

  const insights = getInsights();

  if (insights.length === 0) return null;

  return (
    <Card className="h-full">
      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <FiTarget className="text-primary" />
        AI Insights & Suggestions
      </h3>
      <div className="space-y-4">
        {insights.map((insight, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`p-4 rounded-xl border ${insight.color} flex gap-4`}
          >
            <div className="mt-1">{insight.icon}</div>
            <div>
              <h4 className="font-bold text-white text-sm">{insight.title}</h4>
              <p className="text-slate-400 text-xs mt-1 leading-relaxed">{insight.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-8 p-4 rounded-xl bg-primary/10 border border-primary/20">
        <p className="text-primary font-bold text-xs uppercase tracking-wider mb-2">Next Step</p>
        <p className="text-white text-sm">
          Solve 3 <span className="font-bold">Linked List</span> problems today to reach your weekly goal.
        </p>
      </div>
    </Card>
  );
};

export default InsightsCard;
