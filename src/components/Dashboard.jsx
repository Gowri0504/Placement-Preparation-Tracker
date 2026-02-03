import { useState, useEffect } from 'react';
import { format, subDays, addDays, isToday, startOfYear, endOfYear, eachDayOfInterval } from 'date-fns';
import axios from 'axios';
import clsx from 'clsx';
import RoundDetails from './RoundDetails';
import { FaCheck, FaChartLine, FaCode, FaLaptopCode, FaUserTie, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { useAuth } from '../context/AuthContext';

const ROUNDS = [
  { id: 'round1', label: 'Aptitude', subLabel: 'Quant, Logical, Verbal', icon: FaChartLine, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', checkBg: 'bg-emerald-600' },
  { id: 'round2', label: 'Coding', subLabel: 'DSA & Algorithms', icon: FaCode, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', checkBg: 'bg-blue-600' },
  { id: 'round3', label: 'Technical', subLabel: 'CS Core Subjects', icon: FaLaptopCode, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200', checkBg: 'bg-purple-600' },
  { id: 'round4', label: 'HR Round', subLabel: 'Behavioral & Projects', icon: FaUserTie, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200', checkBg: 'bg-orange-600' },
];

export default function Dashboard() {
  const [dates, setDates] = useState([]);
  const [logs, setLogs] = useState({});
  const [allLogs, setAllLogs] = useState([]);
  const [selectedCell, setSelectedCell] = useState(null);
  const [topics, setTopics] = useState([]);
  const [startDate, setStartDate] = useState(new Date()); // Start date for the 5-day view (actually end date looking back)
  const { user } = useAuth();

  // Load initial data
  useEffect(() => {
    fetchTopics();
    fetchAllLogs();
  }, []);

  // Update visible dates when startDate changes
  useEffect(() => {
    const days = [];
    for (let i = 4; i >= 0; i--) {
      days.push(subDays(startDate, i));
    }
    setDates(days);
    fetchLogsForRange(days);
  }, [startDate]);

  const fetchTopics = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/topics');
      setTopics(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAllLogs = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/daylogs');
      setAllLogs(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchLogsForRange = async (rangeDates) => {
    try {
      const promises = rangeDates.map(date => 
        axios.get(`http://localhost:5000/api/daylog/${format(date, 'yyyy-MM-dd')}`)
      );
      const results = await Promise.all(promises);
      const newLogs = { ...logs };
      results.forEach(res => {
        if (res.data) newLogs[res.data.date] = res.data;
      });
      setLogs(newLogs);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCellClick = (dateStr, roundId) => {
    setSelectedCell({ date: dateStr, roundId });
  };

  const handleUpdate = (updatedLog) => {
    setLogs(prev => ({ ...prev, [updatedLog.date]: updatedLog }));
    // Also update allLogs for heatmap
    setAllLogs(prev => {
      const index = prev.findIndex(l => l.date === updatedLog.date);
      if (index >= 0) {
        const newLogs = [...prev];
        newLogs[index] = updatedLog;
        return newLogs;
      }
      return [...prev, updatedLog];
    });
  };

  const shiftDate = (days) => {
    setStartDate(prev => addDays(prev, days));
  };

  // Calculate heatmap data
  const heatmapData = allLogs.map(log => {
    let count = 0;
    if (log.rounds) {
      Object.values(log.rounds).forEach(r => {
        if (r.completed) count++;
      });
    }
    return { date: log.date, count };
  });

  return (
    <div className="space-y-8">
      {/* Navigation & Grid */}
      <div className="glass-panel rounded-[2rem] overflow-hidden animate-scale-in relative">
        <div className="absolute top-4 right-4 flex gap-2 z-30">
          <button onClick={() => shiftDate(-5)} className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors">
            <FaChevronLeft className="text-slate-600" />
          </button>
          <button onClick={() => setStartDate(new Date())} className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold uppercase tracking-wider hover:bg-indigo-100 transition-colors">
            Today
          </button>
          <button onClick={() => shiftDate(5)} className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors">
            <FaChevronRight className="text-slate-600" />
          </button>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="p-6 md:p-8 border-b border-slate-100/50 bg-white/80 backdrop-blur-md font-serif font-bold text-slate-800 min-w-[200px] sticky left-0 z-20 shadow-[4px_0_24px_-4px_rgba(0,0,0,0.02)]">
                  <span className="uppercase tracking-widest text-[10px] text-slate-400 font-sans">Focus Areas</span>
                </th>
                {dates.map(date => {
                  const isCurrentDay = isToday(date);
                  return (
                    <th key={date.toString()} className={clsx(
                      "p-4 border-b border-slate-100/50 text-center min-w-[120px] transition-colors",
                      isCurrentDay ? "bg-indigo-50/30" : "bg-transparent"
                    )}>
                      <div className={clsx(
                        "inline-flex flex-col items-center justify-center w-16 h-16 rounded-2xl border transition-all duration-300",
                        isCurrentDay 
                          ? "bg-white border-indigo-100 shadow-[0_8px_16px_-4px_rgba(99,102,241,0.1)] transform -translate-y-1" 
                          : "border-transparent text-slate-400"
                      )}>
                        <span className={clsx("text-[10px] font-bold uppercase tracking-wider mb-1", isCurrentDay ? "text-indigo-600" : "text-slate-400")}>{format(date, 'EEE')}</span>
                        <span className={clsx("text-xl font-serif font-bold", isCurrentDay ? "text-slate-900" : "text-slate-500")}>{format(date, 'dd')}</span>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {ROUNDS.map((round, index) => (
                <tr 
                  key={round.id} 
                  className="group hover:bg-slate-50/50 transition-colors animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <td className="p-6 md:p-8 sticky left-0 bg-white/90 backdrop-blur-sm group-hover:bg-slate-50/90 transition-colors z-20 shadow-[4px_0_24px_-4px_rgba(0,0,0,0.02)]">
                    <div className="flex items-center gap-5">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${round.bg} ${round.color} shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                        <round.icon className="text-2xl" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-slate-900 font-serif font-bold text-lg tracking-tight mb-1">{round.label}</div>
                        <div className="text-slate-500 text-xs font-medium tracking-wide uppercase opacity-70">{round.subLabel}</div>
                      </div>
                    </div>
                  </td>
                  {dates.map(date => {
                    const dateStr = format(date, 'yyyy-MM-dd');
                    const log = logs[dateStr];
                    const isCompleted = log?.rounds?.[round.id]?.completed;
                    
                    return (
                      <td 
                        key={dateStr} 
                        className="p-4 text-center cursor-pointer relative"
                        onClick={() => handleCellClick(dateStr, round.id)}
                      >
                        <div className="absolute inset-2 rounded-2xl group-hover/cell:bg-slate-100/50 transition-colors -z-10"></div>
                        <button className={clsx(
                          "w-16 h-12 rounded-xl flex items-center justify-center transition-all duration-500 mx-auto relative overflow-hidden group/btn",
                          isCompleted 
                            ? `${round.checkBg} text-white shadow-lg shadow-${round.checkBg}/30 border-2 border-white` 
                            : "bg-slate-50 border-2 border-slate-200 text-slate-300 hover:border-slate-300 hover:text-slate-400"
                        )}>
                          {isCompleted && (
                             <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                          )}
                          {isCompleted ? <FaCheck className="text-lg transform scale-100 transition-transform duration-300" /> : <div className="w-2 h-2 rounded-full bg-slate-300 group-hover/btn:bg-slate-400 transition-colors"></div>}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Heatmap Section */}
      <div className="glass-panel p-8 rounded-[2rem]">
        <h3 className="text-xl font-serif font-bold text-slate-800 mb-6">Yearly Consistency</h3>
        <div className="overflow-x-auto custom-scrollbar pb-4">
          <div className="min-w-[800px]">
            <CalendarHeatmap
              startDate={subDays(new Date(), 365)}
              endDate={new Date()}
              values={heatmapData}
              classForValue={(value) => {
                if (!value || value.count === 0) {
                  return 'color-empty';
                }
                return `color-scale-${Math.min(value.count, 4)}`;
              }}
              showWeekdayLabels={true}
            />
          </div>
        </div>
      </div>

      {selectedCell && (
        <RoundDetails 
          date={selectedCell.date} 
          roundId={selectedCell.roundId} 
          roundConfig={ROUNDS.find(r => r.id === selectedCell.roundId)}
          onClose={() => setSelectedCell(null)}
          onUpdate={handleUpdate}
          currentLog={logs[selectedCell.date]}
          allTopics={topics}
        />
      )}
    </div>
  );
}
