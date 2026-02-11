import React, { useEffect, useState } from 'react';
import { FiGithub, FiGlobe, FiPlus } from 'react-icons/fi';
import api from '../../api/axios';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const ProjectPortfolio = () => {
  const [projects, setProjects] = useState([]);
  
  // TODO: Add Form implementation similar to ProblemTracker
  // For brevity, just listing logic here

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get('/projects');
        setProjects(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProjects();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Project Portfolio</h1>
          <p className="text-slate-400 mt-2">Manage your projects and interview readiness.</p>
        </div>
        <Button>
          <FiPlus /> Add Project
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map(project => (
          <Card key={project._id} className="group hover:border-primary/50 transition-colors">
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-bold text-white">{project.title}</h3>
              <div className="flex gap-2">
                {project.githubLink && (
                  <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white">
                    <FiGithub size={20} />
                  </a>
                )}
                {project.liveLink && (
                  <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white">
                    <FiGlobe size={20} />
                  </a>
                )}
              </div>
            </div>
            
            <p className="text-slate-400 mt-3 line-clamp-2">{project.description}</p>
            
            <div className="flex flex-wrap gap-2 mt-4">
              {project.techStack.map(tech => (
                <span key={tech} className="px-2 py-1 rounded bg-slate-800 text-slate-300 text-xs border border-slate-700">
                  {tech}
                </span>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-700/50">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400">Interview Confidence</span>
                <span className="text-primary">{project.confidenceScore}%</span>
              </div>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-500" 
                  style={{ width: `${project.confidenceScore}%` }}
                ></div>
              </div>
            </div>
          </Card>
        ))}
        
        {/* Empty State / Add New Placeholder */}
        <button className="border-2 border-dashed border-slate-800 rounded-xl p-6 flex flex-col items-center justify-center text-slate-500 hover:border-slate-600 hover:text-slate-300 transition-all min-h-[250px]">
          <FiPlus size={40} className="mb-4 opacity-50" />
          <span className="font-medium">Create New Project</span>
        </button>
      </div>
    </div>
  );
};

export default ProjectPortfolio;
