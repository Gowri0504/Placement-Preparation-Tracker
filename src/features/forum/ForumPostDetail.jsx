import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { ArrowLeft, Edit, Trash2, MessageSquare, ThumbsUp, Share2, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

const ForumPostDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentContent, setEditCommentContent] = useState('');
  const [showShareMenu, setShowShareMenu] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await api.get(`/forum/posts/${id}`);
        setPost(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleUpvote = async () => {
    try {
      await api.post(`/forum/posts/${id}/upvote`);
      setPost(prev => ({
        ...prev,
        upvotes: prev.upvotes.includes(user._id)
          ? prev.upvotes.filter(uid => uid !== user._id)
          : [...prev.upvotes, user._id]
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    try {
      // Re-fetch post to get updated comments with populated author
      const { data: updatedPost } = await api.get(`/forum/posts/${id}`);
      setPost(updatedPost);
      const { data } = await api.post(`/forum/posts/${id}/comments`, {
        content: newComment
      });
      setNewComment('');
      // Re-fetch post to get updated comments with populated author
      const { data: finalPost } = await api.get(`/forum/posts/${id}`);
      setPost(finalPost);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditComment = async (commentId) => {
    const comment = post.comments.find(c => c._id === commentId);
    setEditingCommentId(commentId);
    setEditCommentContent(comment.content);
  };

  const handleSaveEditComment = async (commentId) => {
    try {
      await api.put(`/forum/posts/${id}/comments/${commentId}`, {
        content: editCommentContent
      });
      setEditingCommentId(null);
      setEditCommentContent('');
      // Re-fetch post to get updated comments
      const { data: updatedPost } = await api.get(`/forum/posts/${id}`);
      setPost(updatedPost);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;
    try {
      await api.delete(`/forum/posts/${id}/comments/${commentId}`);
      setPost(prev => ({
        ...prev,
        comments: prev.comments.filter(c => c._id !== commentId)
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleShare = (platform) => {
    const shareUrl = window.location.href;
    const shareText = `Check out this forum post: ${post.title}`;
    if (platform === 'copy') {
      navigator.clipboard.writeText(shareUrl);
      alert('Link copied to clipboard!');
    } else if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`, '_blank');
    } else if (platform === 'linkedin') {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank');
    }
    setShowShareMenu(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <h2 className="text-2xl text-white">Post not found</h2>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Button
          variant="ghost"
          onClick={() => navigate('/forum')}
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-4"
        >
          <ArrowLeft size={20} />
          Back to Forum
        </Button>

        <Card className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-white font-bold border border-slate-700">
                {post.authorId?.username?.[0]?.toUpperCase()}
              </div>
              <div>
                <h3 className="text-white font-semibold">{post.authorId?.username}</h3>
                <p className="text-xs text-slate-500">
                  {new Date(post.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
            <div className="relative">
              <Button
                variant="ghost"
                onClick={() => setShowShareMenu(!showShareMenu)}
              >
                <Share2 size={20} />
              </Button>
              {showShareMenu && (
                <div className="absolute right-0 top-full mt-2 bg-slate-900 border border-slate-700 rounded-lg shadow-lg p-2 z-10">
                  <Button
                    variant="ghost"
                    onClick={() => handleShare('copy')}
                    className="w-full justify-start text-left"
                  >
                    Copy Link
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => handleShare('twitter')}
                    className="w-full justify-start text-left"
                  >
                    Share on Twitter
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => handleShare('linkedin')}
                    className="w-full justify-start text-left"
                  >
                    Share on LinkedIn
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="mb-6">
            <h1 className="text-3xl font-bold text-white mb-3">{post.title}</h1>
            <span className="inline-block px-3 py-1 bg-slate-800 text-slate-400 rounded-full text-xs font-medium">
              {post.category}
            </span>
          </div>

          <div className="mb-6">
            <p className="text-slate-300 leading-relaxed text-lg">{post.content}</p>
          </div>

          {/* Attachments */}
          {post.files && post.files.length > 0 && (
            <div className="mb-8 space-y-2">
              <h4 className="text-white font-semibold mb-3">Attachments</h4>
              {post.files.map((file, idx) => {
                let apiBaseURL = import.meta.env.VITE_API_URL || window.location.origin;
                if (apiBaseURL.endsWith('/')) apiBaseURL = apiBaseURL.slice(0, -1);
                if (apiBaseURL.endsWith('/api')) apiBaseURL = apiBaseURL.slice(0, -4);
                const fileUrl = `${apiBaseURL}/uploads/${file.filename}`;
                return (
                  <a
                    key={idx}
                    href={fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 p-3 bg-slate-800 rounded-lg border border-slate-700 hover:border-primary/50 transition-colors text-slate-300"
                  >
                    <FileText size={20} className="text-primary" />
                    <span className="truncate">{file.originalName}</span>
                  </a>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 border-t border-slate-800 pt-4 mb-8">
            <button
              onClick={handleUpvote}
              className={`flex items-center gap-2 text-sm transition-colors ${
                post.upvotes.includes(user._id) ? 'text-primary' : 'text-slate-400 hover:text-primary'
              }`}
            >
              <ThumbsUp size={18} />
              {post.upvotes.length}
            </button>
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <MessageSquare size={18} />
              {post.comments.length} Comments
            </div>
          </div>

          {/* Add Comment */}
          <div className="mb-8">
            <h3 className="text-white font-semibold mb-4">Add a Comment</h3>
            <form onSubmit={handleAddComment} className="flex gap-3">
              <textarea
                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-primary outline-none resize-none"
                placeholder="Write your comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={3}
                required
              />
              <Button type="submit" className="self-end">
                Post
              </Button>
            </form>
          </div>

          {/* Comments List */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold mb-4">Comments ({post.comments.length})</h3>
            {post.comments.map((comment) => (
              <Card key={comment._id} className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-white font-bold border border-slate-700 text-sm">
                      {comment.authorId?.username?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-white text-sm font-semibold">{comment.authorId?.username}</h4>
                      <p className="text-xs text-slate-500">
                        {new Date(comment.createdAt).toLocaleString()}
                        {comment.updatedAt > comment.createdAt && (
                        <span className="ml-2">(edited)</span>
                      )}
                      </p>
                    </div>
                  </div>
                  {comment.authorId?._id === user._id && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditComment(comment._id)} className="text-slate-400 hover:text-primary">
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteComment(comment._id)} className="text-slate-400 hover:text-red-400">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                </div>

                {editingCommentId === comment._id ? (
                  <div className="flex gap-3">
                    <textarea
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-primary outline-none resize-none"
                      value={editCommentContent}
                      onChange={(e) => setEditCommentContent(e.target.value)}
                      rows={3}
                    />
                    <div className="flex flex-col gap-2">
                      <Button onClick={() => handleSaveEditComment(comment._id)} size="small">
                        Save
                      </Button>
                      <Button
                        variant="ghost" onClick={() => setEditingCommentId(null)} size="small">
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-slate-300">{comment.content}</p>
                )}
              </Card>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default ForumPostDetail;
