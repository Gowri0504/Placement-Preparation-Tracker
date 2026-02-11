import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { FileText, Search, CheckCircle, AlertTriangle, Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';

const ResumeAnalyzer = () => {
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [content, setContent] = useState('');

  useEffect(() => {
    fetchResume();
  }, []);

  const fetchResume = async () => {
    try {
      const { data } = await api.get('/resume');
      setResumeData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!content.trim()) return;
    setAnalyzing(true);
    try {
      const { data } = await api.post('/resume/analyze', { content });
      setResumeData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-400">Loading Resume Intelligence...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-white">Resume Intelligence</h1>
        <p className="text-slate-400 mt-2">ATS Score Prediction & AI-Powered Skill Gap Analysis.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Section */}
        <Card className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="text-primary" />
            <h3 className="text-xl font-bold text-white">Analyze Your Resume</h3>
          </div>
          
          <textarea 
            className="w-full h-96 bg-slate-900/50 border border-slate-700 rounded-xl p-4 text-slate-300 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all resize-none"
            placeholder="Paste your resume text here for instant AI analysis..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <div className="flex justify-end">
            <Button 
              onClick={handleAnalyze} 
              disabled={analyzing || !content.trim()}
              className="px-8"
            >
              {analyzing ? 'Analyzing...' : 'Analyze Now'}
            </Button>
          </div>
        </Card>

        {/* Results Section */}
        <div className="space-y-6">
          {resumeData ? (
            <>
              {/* ATS Score */}
              <Card className="text-center p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl" />
                <h4 className="text-slate-400 text-sm uppercase tracking-wider mb-2">ATS Readiness Score</h4>
                <div className="text-6xl font-display font-black text-primary mb-4">
                  {resumeData.atsScore}%
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${resumeData.atsScore}%` }}
                    className="h-full bg-gradient-to-r from-primary to-accent"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-4 italic">
                  Last analyzed: {new Date(resumeData.lastAnalyzed).toLocaleDateString()}
                </p>
              </Card>

              {/* Strengths & Weaknesses */}
              <Card className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 text-emerald-400 mb-3">
                    <CheckCircle size={18} />
                    <h4 className="font-bold">Key Strengths</h4>
                  </div>
                  <ul className="space-y-2">
                    {resumeData.analysis.strengths.map((s, i) => (
                      <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                        <span className="mt-1.5 w-1 h-1 bg-emerald-500 rounded-full shrink-0" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-rose-400 mb-3">
                    <AlertTriangle size={18} />
                    <h4 className="font-bold">Areas for Improvement</h4>
                  </div>
                  <ul className="space-y-2">
                    {resumeData.analysis.weaknesses.map((w, i) => (
                      <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                        <span className="mt-1.5 w-1 h-1 bg-rose-500 rounded-full shrink-0" />
                        {w}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-amber-400 mb-3">
                    <Lightbulb size={18} />
                    <h4 className="font-bold">Actionable Tips</h4>
                  </div>
                  <ul className="space-y-2">
                    {resumeData.analysis.formattingTips.map((t, i) => (
                      <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                        <span className="mt-1.5 w-1 h-1 bg-amber-500 rounded-full shrink-0" />
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            </>
          ) : (
            <Card className="p-8 text-center flex flex-col items-center justify-center h-full min-h-[400px]">
              <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-600">
                <Search size={32} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No Analysis Yet</h3>
              <p className="text-slate-400 text-sm">
                Paste your resume content and click "Analyze Now" to get your ATS score and AI feedback.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeAnalyzer;
