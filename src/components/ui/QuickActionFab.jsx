import React, { useState } from 'react';
import { FiPlus, FiCode, FiBook, FiCheckCircle, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const QuickActionFab = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const actions = [
    { icon: <FiCode />, label: 'Log Problem', path: '/problems', color: 'bg-blue-500' },
    { icon: <FiBook />, label: 'Study Topics', path: '/topics', color: 'bg-primary' },
    { icon: <FiCheckCircle />, label: 'Daily Rounds', path: '/', color: 'bg-emerald-500' },
  ];

  return (
    <div className="fixed bottom-8 right-8 z-[60] flex flex-col items-end gap-4">
      <AnimatePresence>
        {isOpen && (
          <div className="flex flex-col items-end gap-3 mb-2">
            {actions.map((action, idx) => (
              <motion.button
                key={action.label}
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.8 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => {
                  navigate(action.path);
                  setIsOpen(false);
                }}
                className="flex items-center gap-3 group"
              >
                <span className="px-3 py-1.5 rounded-lg bg-slate-800 text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity shadow-xl border border-slate-700">
                  {action.label}
                </span>
                <div className={`w-12 h-12 rounded-full ${action.color} text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform active:scale-95`}>
                  {action.icon}
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-2xl transition-all duration-300 active:scale-90 ${
          isOpen ? 'bg-slate-800 rotate-45' : 'bg-primary'
        }`}
      >
        {isOpen ? <FiX size={24} /> : <FiPlus size={28} />}
      </button>
    </div>
  );
};

export default QuickActionFab;
