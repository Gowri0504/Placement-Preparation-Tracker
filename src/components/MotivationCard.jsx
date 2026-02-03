import { FaSyncAlt, FaQuoteLeft } from 'react-icons/fa';

export default function MotivationCard({ quote, onRefresh }) {
  return (
    <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 shadow-2xl text-white p-10 md:p-12 group">
      {/* Sophisticated Abstract Elements */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px] transform translate-x-1/3 -translate-y-1/3 group-hover:bg-indigo-500/20 transition-colors duration-700"></div>
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[80px] transform -translate-x-1/3 translate-y-1/3"></div>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>
      
      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-8 h-[2px] bg-indigo-500"></span>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-300">Executive Insight</span>
          </div>
          <blockquote className="text-3xl md:text-4xl lg:text-5xl font-serif leading-tight tracking-tight text-white/90 drop-shadow-md">
            <span className="text-indigo-500 opacity-50 mr-2 absolute -ml-6 -mt-4 text-6xl">“</span>
            {quote}
            <span className="text-indigo-500 opacity-50 ml-2 align-top text-3xl">”</span>
          </blockquote>
        </div>
        
        <button 
          onClick={onRefresh} 
          className="group/btn relative flex items-center justify-center w-14 h-14 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-md transition-all duration-500 active:scale-95"
          title="Refresh Insight"
        >
          <div className="absolute inset-0 rounded-full border border-indigo-500/30 scale-110 opacity-0 group-hover/btn:opacity-100 group-hover/btn:scale-100 transition-all duration-500"></div>
          <FaSyncAlt className="text-indigo-200 text-lg group-hover/btn:rotate-180 transition-transform duration-700 ease-in-out" />
        </button>
      </div>
    </div>
  );
}
