import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { BookOpen, Trophy, Clock, Target, TrendingUp, Sparkles, History, ArrowRight } from 'lucide-react';
import { StudyStats, ActivityLog, View } from '../types';

interface DashboardProps {
  stats: StudyStats;
  history: ActivityLog[];
  setCurrentView: (view: View) => void;
}

const data = [
  { name: 'Mon', hours: 2.5 },
  { name: 'Tue', hours: 4.0 },
  { name: 'Wed', hours: 1.5 },
  { name: 'Thu', hours: 3.2 },
  { name: 'Fri', hours: 5.0 },
  { name: 'Sat', hours: 2.0 },
  { name: 'Sun', hours: 1.0 },
];

const subjectData = [
    { name: 'Computer Science', value: 40, color: '#a855f7' },
    { name: 'History', value: 25, color: '#06b6d4' },
    { name: 'Mathematics', value: 20, color: '#ec4899' },
    { name: 'Physics', value: 15, color: '#f59e0b' },
];

export const Dashboard: React.FC<DashboardProps> = ({ stats, history, setCurrentView }) => {
  
  // Smart Suggestions based on history (mock logic for now)
  const lastTopic = history.length > 0 ? history[0].topic : 'General Studies';
  const suggestions = [
      { id: 1, title: `Advanced Quiz: ${lastTopic}`, type: 'Quiz', action: View.QUIZ },
      { id: 2, title: `Concept Map: ${lastTopic}`, type: 'Material', action: View.MATERIALS },
      { id: 3, title: 'Join Study Group', type: 'Community', action: View.COMMUNITY },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-end mb-8">
        <div>
            <h2 className="text-3xl font-bold text-white mb-2">Study Dashboard</h2>
            <p className="text-slate-400">Track your progress and keep the momentum going.</p>
        </div>
        <div className="text-right hidden sm:block">
            <span className="text-sm text-slate-400">Current Streak</span>
            <div className="flex items-center gap-2 text-orange-400 font-bold text-xl justify-end">
                <TrendingUp className="w-5 h-5" /> 5 Days
            </div>
        </div>
      </div>

      {/* Smart Suggestions */}
      <div className="glass-card p-6 rounded-3xl border-l-4 border-l-accent relative overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-64 bg-accent/10 blur-[50px] rounded-full pointer-events-none" />
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-accent" /> AI Smart Suggestions
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
              {suggestions.map(s => (
                  <button 
                    key={s.id}
                    onClick={() => setCurrentView(s.action)}
                    className="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 transition-all group text-left"
                  >
                      <div>
                          <span className="text-xs text-primary font-bold uppercase">{s.type}</span>
                          <p className="text-white font-medium">{s.title}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </button>
              ))}
          </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
            icon={BookOpen} 
            label="Topics Studied" 
            value={stats.topicsStudied.toString()} 
            color="text-blue-400" 
            gradient="from-blue-500/20 to-cyan-500/5" 
            border="border-blue-500/20"
        />
        <StatCard 
            icon={Target} 
            label="Quizzes Taken" 
            value={stats.quizzesTaken.toString()} 
            color="text-fuchsia-400" 
            gradient="from-fuchsia-500/20 to-purple-500/5" 
            border="border-fuchsia-500/20"
        />
        <StatCard 
            icon={Trophy} 
            label="Avg. Score" 
            value={`${stats.averageScore}%`} 
            color="text-yellow-400" 
            gradient="from-yellow-500/20 to-orange-500/5" 
            border="border-yellow-500/20"
        />
        <StatCard 
            icon={Clock} 
            label="Hours Spent" 
            value={`${stats.hoursSpent}h`} 
            color="text-emerald-400" 
            gradient="from-emerald-500/20 to-green-500/5" 
            border="border-emerald-500/20"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Charts Column */}
        <div className="lg:col-span-2 space-y-8">
            <div className="glass-card rounded-3xl p-8">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    Study Activity
                </h3>
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <XAxis 
                            dataKey="name" 
                            stroke="#94a3b8" 
                            fontSize={12} 
                            tickLine={false} 
                            axisLine={false} 
                            dy={10}
                        />
                        <YAxis 
                            stroke="#94a3b8" 
                            fontSize={12} 
                            tickLine={false} 
                            axisLine={false} 
                            dx={-10}
                        />
                        <Tooltip 
                        contentStyle={{ 
                            backgroundColor: 'rgba(30, 41, 59, 0.9)', 
                            backdropFilter: 'blur(8px)',
                            border: '1px solid rgba(255,255,255,0.1)', 
                            borderRadius: '12px',
                            color: '#fff'
                        }}
                        cursor={{ fill: 'rgba(255,255,255,0.05)', radius: 8 }}
                        />
                        <Bar dataKey="hours" radius={[8, 8, 8, 8]}>
                        {data.map((entry, index) => (
                            <Cell 
                                key={`cell-${index}`} 
                                fill={`url(#gradient-${index})`} 
                            />
                        ))}
                        </Bar>
                        <defs>
                        {data.map((entry, index) => (
                            <linearGradient key={`gradient-${index}`} id={`gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={entry.hours > 3 ? '#a855f7' : '#64748b'} stopOpacity={1}/>
                                <stop offset="100%" stopColor={entry.hours > 3 ? '#6366f1' : '#475569'} stopOpacity={0.6}/>
                            </linearGradient>
                        ))}
                        </defs>
                    </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="glass-card rounded-3xl p-8">
                <h3 className="text-xl font-bold text-white mb-6">Subject Distribution</h3>
                <div className="h-64 w-full flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={subjectData}
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {subjectData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderRadius: '12px', border: 'none' }} />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="space-y-2">
                        {subjectData.map((s, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm text-slate-300">
                                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }} />
                                {s.name}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>

        {/* History Column */}
        <div className="glass-card rounded-3xl p-8 flex flex-col h-full">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <History className="w-5 h-5 text-slate-400" /> Recent Activity
          </h3>
          <div className="space-y-4 flex-1 overflow-y-auto max-h-[500px] custom-scrollbar pr-2">
            {history.length === 0 ? (
                <p className="text-slate-500 text-center py-8">No activity yet. Start learning!</p>
            ) : (
                history.map((item) => (
                <div key={item.id} className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 transition-colors">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0 shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
                    <div>
                        <p className="text-sm font-semibold text-white">{item.action}</p>
                        <p className="text-xs text-slate-300">{item.topic}</p>
                        {item.meta && <p className="text-xs text-green-400 mt-1">{item.meta}</p>}
                        <p className="text-[10px] text-slate-500 mt-2">{item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                </div>
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, color, gradient, border }: any) => (
  <div className={`rounded-3xl p-6 bg-gradient-to-br ${gradient} border ${border} backdrop-blur-md relative overflow-hidden group transition-transform hover:-translate-y-1`}>
    <div className="relative z-10 flex items-center gap-4">
        <div className={`p-3 rounded-xl bg-black/20 backdrop-blur-sm ${color}`}>
            <Icon className="w-6 h-6" />
        </div>
        <div>
            <p className="text-sm font-medium text-white/70">{label}</p>
            <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
        </div>
    </div>
  </div>
);