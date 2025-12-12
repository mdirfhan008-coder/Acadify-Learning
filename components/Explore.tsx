import React, { useState } from 'react';
import { Search, Loader2, BookOpen, BrainCircuit, Library, ArrowRight, MessageCircle } from 'lucide-react';
import { getSubjectOverview } from '../services/geminiService';
import { SubjectOverview, View } from '../types';

interface ExploreProps {
  onNavigate: (view: View, topic: string) => void;
}

export const Explore: React.FC<ExploreProps> = ({ onNavigate }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SubjectOverview | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setResult(null);
    try {
      const overview = await getSubjectOverview(query);
      setResult(overview);
    } catch (error) {
      alert("Failed to explore subject. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold text-white">AI Knowledge Explorer</h2>
        <p className="text-slate-400 text-lg">
          Search for any subject or topic, and our AI will build a personalized learning path for you.
        </p>
      </div>

      <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
        <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-accent rounded-3xl blur opacity-30 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative flex items-center bg-[#020617] border border-white/10 rounded-2xl p-2 shadow-2xl">
                <div className="pl-4 pr-2 text-slate-400">
                    <Search className="w-6 h-6" />
                </div>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="What do you want to learn? (e.g. Neuroscience, Calculus, Art History)"
                    className="w-full bg-transparent text-white px-4 py-4 focus:outline-none placeholder:text-slate-600 text-lg"
                />
                <button
                    type="submit"
                    disabled={loading || !query}
                    className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-primary/20 shrink-0 m-1"
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Explore'}
                </button>
            </div>
        </div>
      </form>

      {result && (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            <div className="glass-card p-8 rounded-3xl border-l-4 border-l-primary">
                <h3 className="text-3xl font-bold text-white mb-4">{result.subject}</h3>
                <p className="text-slate-300 text-lg leading-relaxed mb-6">{result.description}</p>
                <div className="flex flex-wrap gap-3">
                    <span className="px-3 py-1 bg-white/10 rounded-full text-sm font-medium text-slate-300 border border-white/10">Difficulty: {result.difficulty}</span>
                    {result.relatedFields?.map((field, i) => (
                        <span key={i} className="px-3 py-1 bg-white/5 rounded-full text-sm text-slate-400 border border-white/5">{field}</span>
                    ))}
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="glass-card p-6 rounded-2xl">
                    <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <Library className="w-5 h-5 text-accent" /> Key Topics
                    </h4>
                    <ul className="space-y-3">
                        {result.topics.map((topic, i) => (
                            <li key={i} className="flex items-start gap-3 text-slate-300">
                                <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
                                {topic}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="flex flex-col gap-4">
                    <ActionButton 
                        icon={Library} 
                        title="Generate Course Syllabus" 
                        desc="Create a structured learning plan."
                        onClick={() => onNavigate(View.COURSES, result.subject)}
                    />
                    <ActionButton 
                        icon={BookOpen} 
                        title="Create Study Materials" 
                        desc="Get summaries and flashcards instantly."
                        onClick={() => onNavigate(View.MATERIALS, result.subject)}
                    />
                    <ActionButton 
                        icon={BrainCircuit} 
                        title="Take a Quiz" 
                        desc="Test your knowledge on this subject."
                        onClick={() => onNavigate(View.QUIZ, result.subject)}
                    />
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

const ActionButton = ({ icon: Icon, title, desc, onClick }: any) => (
    <button 
        onClick={onClick}
        className="w-full bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 p-4 rounded-xl flex items-center gap-4 transition-all group text-left"
    >
        <div className="p-3 bg-black/20 rounded-lg group-hover:scale-110 transition-transform">
            <Icon className="w-6 h-6 text-white group-hover:text-primary transition-colors" />
        </div>
        <div className="flex-1">
            <h5 className="text-white font-bold">{title}</h5>
            <p className="text-sm text-slate-400">{desc}</p>
        </div>
        <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
    </button>
);
