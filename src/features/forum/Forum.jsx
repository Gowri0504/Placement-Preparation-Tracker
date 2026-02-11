import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { MessageSquare, ThumbsUp, MessageCircle, Share2, Plus, Search, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Forum = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', category: 'General' });

  const categories = ['All', 'General', 'DSA', 'Interview Experience', 'Placement News', 'Referrals'];

  useEffect(() => {
    fetchPosts();
  }, [filter]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const url = filter === 'All' ? '/forum/posts' : `/forum/posts?category=${filter}`;
      const { data } = await api.get(url);
      setPosts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpvote = async (postId) => {
    try {
      await api.post(`/forum/posts/${postId}/upvote`);
      fetchPosts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreatePost = async () => {
    try {
      await api.post('/forum/posts', newPost);
      setShowCreateModal(false);
      setNewPost({ title: '', content: '', category: 'General' });
      fetchPosts();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-400">Loading Community Forum...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Community Forum</h1>
          <p className="text-slate-400 mt-2">Share experiences, ask questions, and connect with the community.</p>
        </div>

        <div className="flex gap-4">
          <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
            <select 
              className="bg-transparent text-slate-300 px-4 py-2 outline-none cursor-pointer text-sm"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <Button onClick={() => setShowCreateModal(true)} className="flex items-center gap-2">
            <Plus size={18} />
            New Post
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {posts.map((post, i) => (
            <motion.div
              key={post._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="p-6 hover:border-primary/30 transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-white font-bold border border-slate-700">
                      {post.authorId?.username?.[0].toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-white font-bold group-hover:text-primary transition-colors">{post.title}</h4>
                      <p className="text-xs text-slate-500">
                        Posted by <span className="text-slate-400 font-medium">{post.authorId?.username}</span> • {new Date(post.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 bg-slate-800 text-slate-400 rounded">
                    {post.category}
                  </span>
                </div>
                
                <p className="text-slate-400 text-sm mb-6 line-clamp-3 leading-relaxed">
                  {post.content}
                </p>

                <div className="flex items-center gap-6 border-t border-slate-800 pt-4">
                  <button 
                    onClick={() => handleUpvote(post._id)}
                    className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors text-sm"
                  >
                    <ThumbsUp size={16} />
                    {post.upvotes?.length || 0}
                  </button>
                  <button className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-sm">
                    <MessageCircle size={16} />
                    {post.comments?.length || 0} Comments
                  </button>
                  <button className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-sm ml-auto">
                    <Share2 size={16} />
                  </button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-bold text-white mb-4">Trending Topics</h3>
            <div className="space-y-4">
              {['#MAANG2024', '#SystemDesign', '#MockInterviews', '#DSAChallenge'].map(tag => (
                <div key={tag} className="flex justify-between items-center group cursor-pointer">
                  <span className="text-slate-400 group-hover:text-primary transition-colors">{tag}</span>
                  <span className="text-xs text-slate-600">1.2k posts</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-primary/10 to-transparent">
            <h3 className="text-lg font-bold text-white mb-2">Weekly Spotlight</h3>
            <p className="text-sm text-slate-400 mb-4">"How I cracked Google as a tier-3 college student" - Read the full experience.</p>
            <Button variant="secondary" className="w-full py-2 text-xs">Read More</Button>
          </Card>
        </div>
      </div>

      {/* Create Post Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl"
            >
              <Card className="p-8 space-y-6 border-primary/20">
                <h2 className="text-2xl font-bold text-white">Create New Post</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-slate-400 mb-1 block">Title</label>
                    <input 
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-primary outline-none"
                      placeholder="Enter post title"
                      value={newPost.title}
                      onChange={e => setNewPost({...newPost, title: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-slate-400 mb-1 block">Category</label>
                    <select 
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-primary outline-none"
                      value={newPost.category}
                      onChange={e => setNewPost({...newPost, category: e.target.value})}
                    >
                      {categories.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-slate-400 mb-1 block">Content</label>
                    <textarea 
                      className="w-full h-48 bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-primary outline-none resize-none"
                      placeholder="Share your thoughts..."
                      value={newPost.content}
                      onChange={e => setNewPost({...newPost, content: e.target.value})}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-4 pt-4">
                  <Button variant="ghost" onClick={() => setShowCreateModal(false)}>Cancel</Button>
                  <Button onClick={handleCreatePost} disabled={!newPost.title || !newPost.content}>Publish Post</Button>
                </div>
              </Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Forum;
