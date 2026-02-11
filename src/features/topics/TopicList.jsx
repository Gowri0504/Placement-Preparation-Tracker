import React, { useEffect, useState } from 'react';
import { FiBook, FiCheckCircle, FiCircle, FiFilter, FiSearch } from 'react-icons/fi';
import api from '../../api/axios';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const TopicList = () => {
  const [topics, setTopics] = useState([]);
  const [progress, setProgress] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [topicsRes, progressRes] = await Promise.all([
          api.get('/topics'),
          api.get('/topics/progress')
        ]);
        setTopics(topicsRes.data);
        setProgress(progressRes.data);
      } catch (err) {
        console.error("Error fetching topics", err);
      }
    };
    fetchData();
  }, []);

  // Group topics by Category -> SubCategory
  const groupedTopics = topics.reduce((acc, topic) => {
    if (!acc[topic.category]) acc[topic.category] = {};
    if (!acc[topic.category][topic.subCategory || 'General']) acc[topic.category][topic.subCategory || 'General'] = [];
    acc[topic.category][topic.subCategory || 'General'].push(topic);
    return acc;
  }, {});

  const getStatus = (topicId) => {
    const p = progress.find(p => (p.topicId?._id === topicId || p.topicId === topicId));
    return p ? p.status : 'Not Started';
  };

  const handleStatusUpdate = async (topicId, currentStatus) => {
    const newStatus = currentStatus === 'Mastered' ? 'Not Started' : 'Mastered';
    try {
      await api.post('/topics/progress', { topicId, status: newStatus });
      // Optimistic update
      const existing = progress.find(p => p.topicId === topicId || p.topicId._id === topicId);
      if (existing) {
        setProgress(prev => prev.map(p => (p.topicId === topicId || p.topicId._id === topicId) ? { ...p, status: newStatus } : p));
      } else {
        setProgress(prev => [...prev, { topicId: { _id: topicId }, status: newStatus }]);
      }
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const filteredCategories = Object.keys(groupedTopics).filter(cat => 
    filter === 'All' || cat === filter
  ).map(cat => {
    const subCats = groupedTopics[cat];
    const filteredSubCats = {};
    let totalInCat = 0;

    Object.keys(subCats).forEach(subCat => {
      const filteredTopics = subCats[subCat].filter(t => 
        t.name.toLowerCase().includes(search.toLowerCase())
      );
      if (filteredTopics.length > 0) {
        filteredSubCats[subCat] = filteredTopics;
        totalInCat += filteredTopics.length;
      }
    });

    return totalInCat > 0 ? { name: cat, subCats: filteredSubCats } : null;
  }).filter(Boolean);

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Topic Explorer</h1>
          <p className="text-slate-400 mt-2">Master your concepts step by step.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          <div className="relative flex-1 sm:w-64">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search topics..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-slate-200 focus:outline-none focus:border-primary/50"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {['All', 'DSA', 'Core Subjects', 'Web Dev', 'Languages', 'System Design', 'DevOps'].map(f => (
              <Button 
                key={f} 
                variant={filter === f ? 'primary' : 'outline'} 
                onClick={() => setFilter(f)}
                className="text-sm px-3 py-1.5"
              >
                {f}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {filteredCategories.length > 0 ? filteredCategories.map(category => (
        <div key={category.name} className="space-y-6">
          <h2 className="text-2xl font-bold text-primary border-b border-slate-800 pb-2">{category.name}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.keys(category.subCats).map(subCat => (
              <Card key={subCat} className="h-full flex flex-col hover:border-slate-700 transition-colors">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-white">{subCat}</h3>
                  <span className="text-xs bg-slate-800 text-slate-400 px-2.5 py-1 rounded-full border border-slate-700">
                    {category.subCats[subCat].length} Topics
                  </span>
                </div>
                
                <div className="space-y-2 flex-1">
                  {category.subCats[subCat].map(topic => {
                    const status = getStatus(topic._id);
                    return (
                      <div 
                        key={topic._id} 
                        className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-800/50 transition-all group cursor-pointer border border-transparent hover:border-slate-800"
                        onClick={() => handleStatusUpdate(topic._id, status)}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`
                            w-5 h-5 rounded flex items-center justify-center border transition-all duration-300
                            ${status === 'Mastered' ? 'bg-primary border-primary' : 'border-slate-700 group-hover:border-primary/50'}
                          `}>
                            {status === 'Mastered' && <FiCheckCircle className="text-white text-[10px]" />}
                          </div>
                          <span className={`text-sm transition-colors ${status === 'Mastered' ? 'text-slate-500' : 'text-slate-300 group-hover:text-white'}`}>
                            {topic.name}
                          </span>
                        </div>
                        {topic.difficulty && (
                          <span className={`text-[9px] font-bold uppercase tracking-tighter px-1.5 py-0.5 rounded border ${
                            topic.difficulty === 'Beginner' ? 'border-green-500/20 text-green-500/70 bg-green-500/5' :
                            topic.difficulty === 'Intermediate' ? 'border-amber-500/20 text-amber-500/70 bg-amber-500/5' :
                            'border-rose-500/20 text-rose-500/70 bg-rose-500/5'
                          }`}>
                            {topic.difficulty}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )) : (
        <div className="text-center py-20 bg-slate-900/20 rounded-2xl border border-dashed border-slate-800">
          <FiSearch className="mx-auto text-slate-600 mb-4" size={48} />
          <p className="text-slate-400 text-lg">No topics found matching your search.</p>
          <Button variant="ghost" onClick={() => { setSearch(''); setFilter('All'); }} className="mt-4">
            Clear all filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default TopicList;
