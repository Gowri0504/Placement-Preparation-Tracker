import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FaTimes, FaSave, FaCheckCircle, FaRegCircle, FaFire, FaTrophy, FaLightbulb, FaLayerGroup } from 'react-icons/fa';
import clsx from 'clsx';
import confetti from 'canvas-confetti';

export default function RoundDetails({ date, roundId, roundConfig, onClose, onUpdate, currentLog, allTopics }) {
  const [formData, setFormData] = useState({
    completed: false,
    topics: []
  });
  const [isClosing, setIsClosing] = useState(false);
  const contentRef = useRef(null);

  // Filter topics for this round
  const roundNum = parseInt(roundId.replace('round', ''));
  const roundTopics = allTopics.filter(t => t.round === roundNum);
  
  // Group topics by section
  const sections = {};
  roundTopics.forEach(t => {
    if (!sections[t.section]) sections[t.section] = [];
    sections[t.section].push(t);
  });

  useEffect(() => {
    if (currentLog && currentLog.rounds && currentLog.rounds[roundId]) {
      setFormData(currentLog.rounds[roundId]);
    } else {
      setFormData({ completed: false, topics: [] });
    }
  }, [currentLog, roundId]);

  const toggleTopic = (topic) => {
    const exists = formData.topics.find(t => t.name === topic.name);
    let newTopics;
    if (exists) {
      newTopics = formData.topics.filter(t => t.name !== topic.name);
    } else {
      newTopics = [...formData.topics, { 
        topicId: topic._id,
        name: topic.name, 
        category: topic.section,
        timeSpent: 0,
        difficulty: 'Medium'
      }];
    }
    setFormData({ ...formData, topics: newTopics });
  };

  const handleSave = async () => {
    // Trigger confetti if marking as completed
    if ((!currentLog?.rounds?.[roundId]?.completed && formData.completed) || 
        (formData.completed && formData.topics.length === roundTopics.length)) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }

    const updatedLog = {
      ...currentLog,
      date: date,
      rounds: {
        ...(currentLog?.rounds || {}),
        [roundId]: {
          ...formData,
          completed: formData.completed || formData.topics.length > 0
        }
      }
    };

    try {
      const res = await axios.post('http://localhost:5000/api/daylog', updatedLog);
      onUpdate(res.data);
      handleClose();
    } catch (err) {
      console.error(err);
    }
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 300);
  };

  // Calculate progress
  const progress = Math.round((formData.topics.length / (roundTopics.length || 1)) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 pointer-events-none">
      {/* Backdrop */}
      <div 
        className={clsx(
          "absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 pointer-events-auto",
          isClosing ? "opacity-0" : "opacity-100"
        )}
        onClick={handleClose}
      />

      {/* Modal Content */}
      <div 
        className={clsx(
          "bg-white w-full max-w-4xl max-h-[90vh] sm:max-h-[85vh] flex flex-col shadow-2xl overflow-hidden pointer-events-auto",
          "rounded-t-3xl sm:rounded-3xl transform transition-all duration-300",
          isClosing 
            ? "translate-y-full sm:scale-95 sm:opacity-0" 
            : "translate-y-0 sm:scale-100 sm:opacity-100 animate-slide-up sm:animate-scale-in"
        )}
      >
        
        {/* Header */}
        <div className="relative p-6 md:p-8 border-b border-slate-100 bg-white/80 backdrop-blur-md z-10 flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${roundConfig.bg} ${roundConfig.color} border ${roundConfig.border} flex items-center gap-2`}>
                <roundConfig.icon className="text-sm" />
                {roundConfig.label}
              </span>
              <span className="text-slate-400 text-sm font-medium bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                {new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            </div>
            <h2 className="text-2xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              Session Details
            </h2>
          </div>
          <button 
            onClick={handleClose} 
            className="p-3 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600 border border-transparent hover:border-slate-200"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div ref={contentRef} className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8 bg-slate-50/50">
          <div className="max-w-3xl mx-auto space-y-8">
            
            {/* Status Card */}
            <div 
              onClick={() => setFormData({...formData, completed: !formData.completed})}
              className={clsx(
                "relative overflow-hidden rounded-2xl border-2 transition-all duration-300 cursor-pointer group p-6 md:p-8 flex items-center justify-between shadow-sm hover:shadow-md",
                formData.completed 
                  ? "bg-gradient-to-br from-indigo-600 to-violet-600 border-transparent text-white" 
                  : "bg-white border-slate-200 hover:border-indigo-300"
              )}
            >
              {/* Abstract Background Shapes for Completed State */}
              {formData.completed && (
                <>
                  <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-white opacity-10 rounded-full blur-2xl"></div>
                  <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-32 h-32 bg-indigo-400 opacity-20 rounded-full blur-xl"></div>
                </>
              )}

              <div className="relative z-10 flex items-center gap-5">
                <div className={clsx(
                  "w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-transform duration-500",
                  formData.completed ? "bg-white/20 text-white scale-110" : "bg-slate-100 text-slate-300 group-hover:scale-110 group-hover:bg-indigo-50 group-hover:text-indigo-500"
                )}>
                  {formData.completed ? <FaCheckCircle className="text-2xl md:text-3xl" /> : <FaRegCircle className="text-2xl md:text-3xl" />}
                </div>
                <div>
                  <h3 className={clsx("text-lg md:text-xl font-bold mb-1", formData.completed ? "text-white" : "text-slate-800")}>
                    {formData.completed ? "Session Completed!" : "Mark as Completed"}
                  </h3>
                  <p className={clsx("text-sm md:text-base opacity-90", formData.completed ? "text-indigo-100" : "text-slate-500")}>
                    {formData.completed ? "Great job! Keep up the streak." : "Tap here when you're done for the day."}
                  </p>
                </div>
              </div>
              
              {formData.completed && <FaTrophy className="text-white/20 text-6xl absolute right-4 -bottom-4 rotate-12" />}
            </div>

            {/* Topics Grid */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <FaLayerGroup className="text-indigo-500" />
                  <h3 className="text-lg md:text-xl font-bold text-slate-800">Topic Selection</h3>
                </div>
                <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
                  <div className="w-20 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-500" style={{ width: `${progress}%` }}></div>
                  </div>
                  <span className="text-xs font-bold text-slate-600">{progress}%</span>
                </div>
              </div>

              <div className="space-y-8">
                {Object.entries(sections).map(([section, topics], sectionIndex) => (
                  <div key={section} className="animate-fade-in-up" style={{ animationDelay: `${sectionIndex * 100}ms` }}>
                    <h4 className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 pl-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                      {section}
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                      {topics.map((topic, topicIndex) => {
                        const isChecked = formData.topics.some(t => t.name === topic.name);
                        return (
                          <div 
                            key={topic._id} 
                            onClick={() => toggleTopic(topic)}
                            className={clsx(
                              "relative group p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 overflow-hidden",
                              isChecked 
                                ? "bg-white border-indigo-500 shadow-[0_4px_20px_-4px_rgba(99,102,241,0.2)]" 
                                : "bg-white border-slate-100 hover:border-indigo-200 hover:shadow-md"
                            )}
                          >
                            <div className="flex items-start justify-between gap-3 relative z-10">
                              <span className={clsx(
                                "font-bold text-sm md:text-base transition-colors",
                                isChecked ? "text-indigo-700" : "text-slate-600 group-hover:text-slate-800"
                              )}>
                                {topic.name}
                              </span>
                              <div className={clsx(
                                "w-6 h-6 rounded-full border-[2.5px] flex items-center justify-center flex-shrink-0 transition-all duration-300",
                                isChecked 
                                  ? "bg-indigo-600 border-indigo-600 scale-110 shadow-lg shadow-indigo-200" 
                                  : "border-slate-300 group-hover:border-indigo-400 bg-slate-50"
                              )}>
                                {isChecked && <FaCheckCircle className="text-white text-sm" />}
                              </div>
                            </div>
                            
                            {/* Subtle background highlight on check */}
                            {isChecked && (
                              <div className="absolute inset-0 bg-indigo-50/50 z-0"></div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 md:p-6 border-t border-slate-100 bg-white z-20 pb-safe">
          <div className="max-w-3xl mx-auto flex flex-col sm:flex-row gap-4">
            <button 
              onClick={handleClose} 
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave} 
              className="w-full sm:flex-1 px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-3 group"
            >
              <FaSave className="group-hover:scale-110 transition-transform" />
              <span>Save & Update Progress</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}