import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Award, Shield, Target, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

const Badge = ({ name, icon, date, description }) => (
  <div className="group relative bg-slate-800/50 border border-slate-700/50 p-4 rounded-xl flex flex-col items-center text-center hover:border-primary/50 transition-all">
    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary text-2xl mb-2 group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h4 className="text-sm font-bold text-white">{name}</h4>
    <p className="text-[10px] text-slate-500 mt-1">{new Date(date).toLocaleDateString()}</p>
    
    {/* Tooltip */}
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-slate-900 text-xs text-slate-300 p-2 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-xl border border-slate-700 z-10">
      {description}
    </div>
  </div>
);

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(user?.profile || {});
  const [editing, setEditing] = useState(false);

  const handleSave = async () => {
    try {
      await api.put('/user/profile', profile);
      setEditing(false);
      // Ideally update context user here too
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-white">My Profile</h1>
        <p className="text-slate-400 mt-2">Manage your personal information and preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sidebar Info */}
        <Card className="flex flex-col items-center text-center p-8">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-4xl font-bold text-white mb-4">
            {user?.username?.[0].toUpperCase()}
          </div>
          <h2 className="text-2xl font-bold text-white">{user?.username}</h2>
          <p className="text-slate-400">{user?.email}</p>
          
          <div className="mt-6 w-full space-y-2">
            <div className="flex justify-between text-sm py-2 border-b border-slate-700">
              <span className="text-slate-400">Level</span>
              <span className="text-white font-bold">{user?.gamification?.level || 1}</span>
            </div>
            <div className="flex justify-between text-sm py-2 border-b border-slate-700">
              <span className="text-slate-400">XP</span>
              <span className="text-primary font-bold">{user?.gamification?.xp || 0}</span>
            </div>
          </div>
        </Card>

        {/* Edit Form */}
        <div className="md:col-span-2 space-y-8">
          <Card>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Personal Details</h3>
              <Button variant={editing ? 'ghost' : 'secondary'} onClick={() => editing ? setEditing(false) : setEditing(true)}>
                {editing ? 'Cancel' : 'Edit Profile'}
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm text-slate-400">Full Name</label>
                <input 
                  disabled={!editing}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white disabled:opacity-50"
                  value={profile.fullName || ''}
                  onChange={e => setProfile({...profile, fullName: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-400">College</label>
                <input 
                  disabled={!editing}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white disabled:opacity-50"
                  value={profile.college || ''}
                  onChange={e => setProfile({...profile, college: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-400">Target Role</label>
                <input 
                  disabled={!editing}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white disabled:opacity-50"
                  value={profile.targetRole || ''}
                  onChange={e => setProfile({...profile, targetRole: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-400">Graduation Year</label>
                <input 
                  type="number"
                  disabled={!editing}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white disabled:opacity-50"
                  value={profile.graduationYear || ''}
                  onChange={e => setProfile({...profile, graduationYear: e.target.value})}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm text-slate-400">GitHub Profile</label>
                <input 
                  disabled={!editing}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white disabled:opacity-50"
                  value={profile.githubProfile || ''}
                  onChange={e => setProfile({...profile, githubProfile: e.target.value})}
                />
              </div>
            </div>

            {editing && (
              <div className="mt-8 flex justify-end">
                <Button onClick={handleSave}>Save Changes</Button>
              </div>
            )}
          </Card>

          {/* Programming Languages Readiness */}
          <Card>
            <div className="flex items-center gap-2 mb-6">
              <Target className="text-primary" />
              <h3 className="text-xl font-bold text-white">Language Readiness</h3>
            </div>
            <div className="space-y-6">
              {['C', 'C++', 'Java', 'Python', 'JavaScript'].map(lang => {
                const proficiency = profile.languageProficiency?.find(p => p.language === lang) || {
                  confidence: 0,
                  problemSolvingComfort: 0,
                  interviewReadiness: 0
                };
                
                return (
                  <div key={lang} className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-white">{lang}</span>
                      <span className="text-xs text-slate-500 uppercase tracking-wider">Overall: {Math.round((proficiency.confidence + proficiency.problemSolvingComfort + proficiency.interviewReadiness) / 3)}%</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { label: 'Syntax', key: 'confidence' },
                        { label: 'Problem Solving', key: 'problemSolvingComfort' },
                        { label: 'Interview', key: 'interviewReadiness' }
                      ].map(metric => (
                        <div key={metric.key} className="space-y-1">
                          <div className="flex justify-between text-[10px] text-slate-400">
                            <span>{metric.label}</span>
                            <span>{proficiency[metric.key]}%</span>
                          </div>
                          <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${proficiency[metric.key]}%` }}
                              className="h-full bg-primary/50"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Badges & Achievements */}
          <Card>
            <div className="flex items-center gap-2 mb-6">
              <Award className="text-primary" />
              <h3 className="text-xl font-bold text-white">Achievements & Badges</h3>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {user?.gamification?.badges?.length > 0 ? (
                user.gamification.badges.map((badge, idx) => (
                  <Badge 
                    key={idx}
                    name={badge.name}
                    icon={badge.icon || '🏆'}
                    date={badge.earnedDate}
                    description={badge.description}
                  />
                ))
              ) : (
                <div className="col-span-full py-8 text-center bg-slate-900/50 rounded-xl border border-dashed border-slate-700">
                  <p className="text-slate-500">No badges earned yet. Keep practicing!</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
