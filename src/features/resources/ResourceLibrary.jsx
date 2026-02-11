import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Book, Video, FileText, ExternalLink, Search, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

const ResourceLibrary = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const categories = ['All', 'DSA', 'Web Dev', 'Core Subjects', 'Aptitude', 'Company Specific'];

  useEffect(() => {
    fetchResources();
  }, [filter]);

  const fetchResources = async () => {
    setLoading(true);
    try {
      const url = filter === 'All' ? '/resources' : `/resources?category=${filter}`;
      const { data } = await api.get(url);
      setResources(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredResources = resources.filter(r => 
    r.title.toLowerCase().includes(search.toLowerCase()) ||
    r.description.toLowerCase().includes(search.toLowerCase())
  );

  const getIcon = (type) => {
    switch(type) {
      case 'Video': return <Video className="text-rose-400" />;
      case 'PDF': return <FileText className="text-amber-400" />;
      case 'Cheatsheet': return <Book className="text-emerald-400" />;
      default: return <ExternalLink className="text-blue-400" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Resource Library</h1>
          <p className="text-slate-400 mt-2">Curated study materials, playlists, and cheatsheets.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text"
              placeholder="Search resources..."
              className="pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-300 focus:border-primary outline-none min-w-[250px]"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg px-3">
            <Filter size={18} className="text-slate-500" />
            <select 
              className="bg-transparent text-slate-300 py-2 outline-none cursor-pointer"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-500">Loading resources...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.length > 0 ? (
            filteredResources.map((resource, i) => (
              <motion.div
                key={resource._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="h-full flex flex-col hover:border-primary/30 transition-all group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-slate-800 rounded-xl group-hover:scale-110 transition-transform">
                      {getIcon(resource.type)}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 bg-slate-800 text-slate-400 rounded">
                      {resource.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{resource.title}</h3>
                  <p className="text-sm text-slate-400 line-clamp-2 mb-6 flex-1">{resource.description}</p>
                  
                  <a 
                    href={resource.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 bg-slate-800 hover:bg-primary/10 hover:text-primary rounded-xl transition-all text-sm font-bold"
                  >
                    Access Resource
                    <ExternalLink size={14} />
                  </a>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center bg-slate-900/50 rounded-2xl border border-dashed border-slate-800">
              <Book size={48} className="mx-auto text-slate-700 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No resources found</h3>
              <p className="text-slate-500">Try adjusting your filters or search terms.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ResourceLibrary;
