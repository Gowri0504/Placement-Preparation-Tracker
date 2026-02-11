import React, { useEffect, useState } from 'react';
import { FiCheckSquare, FiPlus, FiSquare } from 'react-icons/fi';
import api from '../../api/axios';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const CompanyTracker = () => {
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await api.get('/companies');
        setCompanies(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCompanies();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Target Companies</h1>
          <p className="text-slate-400 mt-2">Track your dream jobs and preparation status.</p>
        </div>
        <Button>
          <FiPlus /> Add Target
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {['Target', 'Applied', 'In Progress', 'Offer'].map(status => (
          <div key={status} className="space-y-4">
            <h3 className="text-lg font-bold text-slate-300 uppercase tracking-wider text-sm border-b border-slate-800 pb-2 mb-4">
              {status}
            </h3>
            
            {companies.filter(c => c.status === status).map(company => (
              <Card key={company._id} className="p-4 hover:shadow-lg transition-all cursor-pointer">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-white text-lg">{company.name}</h4>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
                    company.tier === 'Tier 1' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 
                    'bg-slate-700 text-slate-300 border-slate-600'
                  }`}>
                    {company.tier}
                  </span>
                </div>
                
                {company.targetDate && (
                  <p className="text-xs text-slate-500 mt-2">Target: {new Date(company.targetDate).toLocaleDateString()}</p>
                )}
                
                <div className="mt-4 space-y-2">
                  <div className="text-xs font-medium text-slate-400">Preparation Checklist</div>
                  {company.checklist && company.checklist.slice(0, 3).map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                      {item.isCompleted ? <FiCheckSquare className="text-green-500" /> : <FiSquare />}
                      <span className={item.isCompleted ? 'line-through text-slate-500' : ''}>{item.task}</span>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
            
            {companies.filter(c => c.status === status).length === 0 && (
              <div className="h-24 border-2 border-dashed border-slate-800 rounded-lg flex items-center justify-center text-slate-600 text-sm">
                No companies
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompanyTracker;
