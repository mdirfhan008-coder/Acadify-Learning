import React, { useState } from 'react';
import { Users, MessageSquare, ThumbsUp, Share2, Plus, Search } from 'lucide-react';

export const Community: React.FC = () => {
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: 'Sarah Chen',
      avatar: 'SC',
      role: 'Student',
      topic: 'Machine Learning',
      content: 'Has anyone found a good visualization tool for Neural Networks? I am struggling to understand backpropagation intuitively.',
      likes: 24,
      liked: false,
      comments: 5,
      time: '2h ago',
      tags: ['AI', 'DeepLearning']
    },
    {
      id: 2,
      author: 'Dr. James Wilson',
      avatar: 'JW',
      role: 'Professor',
      topic: 'Exam Prep Tips',
      content: 'Just uploaded a new set of practice problems for the Calculus II final. Focus on integration techniques!',
      likes: 156,
      liked: false,
      comments: 42,
      time: '5h ago',
      tags: ['Calculus', 'StudyTips']
    },
    {
      id: 3,
      author: 'Marcus J',
      avatar: 'MJ',
      role: 'Student',
      topic: 'Python Pandas',
      content: 'Check out this cheat sheet I made for Pandas dataframes. It covers all the basic merging and filtering operations.',
      likes: 89,
      liked: false,
      comments: 12,
      time: '1d ago',
      tags: ['Python', 'DataScience', 'Resources']
    }
  ]);

  const handleLike = (e: React.MouseEvent, postId: number) => {
    e.stopPropagation();
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          liked: !post.liked,
          likes: post.liked ? post.likes - 1 : post.likes + 1
        };
      }
      return post;
    }));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Learning Community</h2>
          <p className="text-slate-400">Connect, share, and learn with students worldwide.</p>
        </div>
        <button className="px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-primary/20">
          <Plus className="w-5 h-5" /> New Post
        </button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2">
        <button className="px-4 py-2 rounded-full bg-white text-black font-medium text-sm whitespace-nowrap">All Topics</button>
        <button className="px-4 py-2 rounded-full bg-white/5 text-slate-300 hover:bg-white/10 font-medium text-sm border border-white/10 whitespace-nowrap">Computer Science</button>
        <button className="px-4 py-2 rounded-full bg-white/5 text-slate-300 hover:bg-white/10 font-medium text-sm border border-white/10 whitespace-nowrap">Mathematics</button>
        <button className="px-4 py-2 rounded-full bg-white/5 text-slate-300 hover:bg-white/10 font-medium text-sm border border-white/10 whitespace-nowrap">Study Tips</button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {posts.map((post) => (
            <div key={post.id} className="glass-card p-6 rounded-2xl hover:border-white/20 transition-all cursor-pointer">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                    {post.avatar}
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm">{post.author}</h4>
                    <span className="text-xs text-slate-400">{post.role} • {post.time}</span>
                  </div>
                </div>
                <button className="text-slate-400 hover:text-white transition-colors">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>

              <h3 className="text-lg font-bold text-white mb-2">{post.topic}</h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">{post.content}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map(tag => (
                  <span key={tag} className="px-2 py-1 rounded bg-blue-500/10 text-blue-400 text-xs font-medium border border-blue-500/20">#{tag}</span>
                ))}
              </div>

              <div className="flex items-center gap-6 pt-4 border-t border-white/5">
                <button 
                  onClick={(e) => handleLike(e, post.id)}
                  className={`flex items-center gap-2 text-sm group transition-colors ${post.liked ? 'text-accent' : 'text-slate-400 hover:text-white'}`}
                >
                  <ThumbsUp className={`w-4 h-4 transition-transform duration-300 ${post.liked ? 'fill-current scale-125' : 'group-hover:scale-110'}`} />
                  {post.likes}
                </button>
                <button className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm">
                  <MessageSquare className="w-4 h-4" />
                  {post.comments} Comments
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <div className="glass-card p-6 rounded-2xl">
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-green-400" /> Top Contributors
            </h3>
            <div className="space-y-4">
              {['Dr. James Wilson', 'Sarah Chen', 'Mike Ross'].map((name, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs text-white">
                    {name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-white font-medium">{name}</p>
                    <p className="text-xs text-slate-400">{1200 - (i * 200)} points</p>
                  </div>
                  <div className="text-yellow-400 text-xs font-bold">#{i + 1}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl bg-gradient-to-br from-indigo-900/40 to-purple-900/40">
            <h3 className="text-white font-bold mb-2">Join Study Groups</h3>
            <p className="text-sm text-slate-300 mb-4">Find peers studying the same subjects as you.</p>
            <button className="w-full py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg text-sm text-white transition-all">
              Discover Groups
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};