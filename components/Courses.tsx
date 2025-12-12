import React, { useState, useEffect } from 'react';
import { generateCourseSyllabus } from '../services/geminiService';
import { Course, AppSettings } from '../types';
import { Library, Plus, Loader2, BookOpen, Clock, CheckCircle } from 'lucide-react';

interface CoursesProps {
  initialTopic?: string;
  settings: AppSettings;
  addHistory: (action: string, topic: string) => void;
}

export const Courses: React.FC<CoursesProps> = ({ initialTopic = '', settings, addHistory }) => {
  const [courses, setCourses] = useState<Course[]>([
    {
      id: '1',
      title: 'Introduction to Python',
      description: 'Master the basics of Python programming including variables, loops, and functions.',
      level: 'Beginner',
      duration: '4 Weeks',
      modules: ['Setup & Syntax', 'Control Flow', 'Data Structures', 'Functions & Modules'],
      progress: 25
    },
    {
      id: '2',
      title: 'Modern World History',
      description: 'A deep dive into the major political and social events of the 20th century.',
      level: 'Intermediate',
      duration: '6 Weeks',
      modules: ['World War I', 'The Interwar Period', 'World War II', 'The Cold War'],
      progress: 0
    }
  ]);
  const [newTopic, setNewTopic] = useState(initialTopic);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialTopic) {
        setNewTopic(initialTopic);
    }
  }, [initialTopic]);

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopic.trim()) return;

    setLoading(true);
    try {
      const course = await generateCourseSyllabus(newTopic, settings.language);
      setCourses(prev => [course, ...prev]);
      setNewTopic('');
      addHistory('Created Course', course.title);
    } catch (error) {
      alert("Failed to create course. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white">Course Library</h2>
          <p className="text-slate-400">Browse existing courses or generate a custom adaptive syllabus.</p>
        </div>
      </div>

      {/* Generator */}
      <div className="glass-card p-8 rounded-3xl">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Plus className="w-6 h-6 text-primary" /> Create New Adaptive Path
        </h3>
        <form onSubmit={handleCreateCourse} className="flex gap-4">
            <input 
                type="text" 
                value={newTopic}
                onChange={(e) => setNewTopic(e.target.value)}
                placeholder="What do you want to learn? (e.g. Astrophysics, Digital Marketing)"
                className="flex-1 bg-black/20 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-slate-500"
            />
            <button 
                type="submit" 
                disabled={!newTopic || loading}
                className="bg-primary hover:bg-primary/90 text-white px-8 rounded-2xl font-bold transition-all disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-primary/20"
            >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Generate'}
            </button>
        </form>
      </div>

      {/* Course List */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map((course) => (
            <div key={course.id} className="bg-white/5 backdrop-blur-md rounded-3xl border border-white/5 hover:border-white/20 transition-colors flex flex-col overflow-hidden group hover:bg-white/10">
                <div className="h-32 bg-gradient-to-br from-indigo-900/50 to-purple-900/50 p-6 relative">
                    <div className="absolute inset-0 bg-grid-white/[0.05]" />
                    <Library className="w-10 h-10 text-white/20 absolute bottom-4 right-4 group-hover:text-primary transition-colors group-hover:scale-110 duration-300" />
                    <span className={`
                        inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 border
                        ${course.level === 'Beginner' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 
                          course.level === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' : 
                          'bg-red-500/20 text-red-400 border-red-500/30'}
                    `}>
                        {course.level}
                    </span>
                    <h3 className="text-xl font-bold text-white leading-tight relative z-10">{course.title}</h3>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                    <p className="text-slate-300 text-sm mb-6 flex-1 leading-relaxed">{course.description}</p>
                    
                    {/* Adaptive Learning Path Progress */}
                    <div className="mb-4">
                        <div className="flex justify-between text-xs text-slate-400 mb-1">
                            <span>Progress</span>
                            <span>{course.progress || 0}%</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-1.5">
                            <div className="bg-primary h-1.5 rounded-full" style={{ width: `${course.progress || 0}%` }}></div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-xs text-primary font-bold uppercase tracking-wider">
                            <BookOpen className="w-3 h-3" /> Syllabus Preview
                        </div>
                        <ul className="space-y-2">
                            {course.modules.slice(0, 3).map((mod, i) => (
                                <li key={i} className="flex items-center gap-3 text-sm text-slate-300">
                                    <CheckCircle className={`w-3 h-3 ${i === 0 && (course.progress || 0) > 0 ? 'text-green-400' : 'text-slate-600'}`} />
                                    {mod}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                            <Clock className="w-4 h-4" /> {course.duration}
                        </div>
                        <button className="text-sm font-bold text-white hover:text-primary transition-colors flex items-center gap-1">
                            Continue →
                        </button>
                    </div>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};