import React from 'react';
import { View } from '../types';
import { ArrowRight, Sparkles, Zap, Globe, Shield, Star } from 'lucide-react';

interface HomeProps {
  setCurrentView: (view: View) => void;
}

export const Home: React.FC<HomeProps> = ({ setCurrentView }) => {
  return (
    <div className="space-y-16 animate-fade-in">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-[2rem] p-8 md:p-20 text-center border border-white/10 shadow-2xl">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-fuchsia-600 to-indigo-600 opacity-90" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
        
        {/* Decorative Shapes */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-blob" />
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-yellow-400/20 rounded-full blur-xl animate-blob animation-delay-2000" />

        <div className="relative z-10 max-w-4xl mx-auto space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/20 backdrop-blur-md border border-white/20 text-sm font-semibold text-white mb-4">
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span className="tracking-wide">AI-Powered Learning V2.0</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-tight drop-shadow-sm">
            Master Any Subject with <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-white">Intelligent Speed</span>
          </h1>
          
          <p className="text-xl text-white/80 max-w-2xl mx-auto font-light leading-relaxed">
            Acadify combines advanced Generative AI with proven learning techniques to turn chaos into structured knowledge instantly.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
            <button 
              onClick={() => setCurrentView(View.DASHBOARD)}
              className="px-8 py-4 bg-white text-indigo-900 rounded-2xl font-bold text-lg transition-all transform hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.7)] flex items-center gap-2"
            >
              Start Learning Now <ArrowRight className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setCurrentView(View.COURSES)}
              className="px-8 py-4 bg-black/20 hover:bg-black/30 backdrop-blur-md text-white rounded-2xl font-medium border border-white/20 transition-all hover:border-white/40"
            >
              Explore Courses
            </button>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-8">
        <FeatureCard 
          icon={Zap} 
          title="Instant Materials" 
          desc="Turn any topic into a complete study guide with flashcards in seconds using our Flash model." 
          color="text-yellow-400"
          gradient="from-yellow-400/20 to-orange-500/5"
        />
        <FeatureCard 
          icon={Globe} 
          title="Universal Knowledge" 
          desc="Access information on virtually any academic subject, from Quantum Physics to Art History." 
          color="text-cyan-400"
          gradient="from-cyan-400/20 to-blue-500/5"
        />
        <FeatureCard 
          icon={Shield} 
          title="Personalized Tutor" 
          desc="Get 24/7 assistance from an AI tutor that adapts to your unique learning style." 
          color="text-fuchsia-400"
          gradient="from-fuchsia-400/20 to-purple-500/5"
        />
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-y border-white/10 bg-white/5 backdrop-blur-sm rounded-3xl">
        <Stat number="10k+" label="Active Students" />
        <Stat number="50k+" label="Quizzes Generated" />
        <Stat number="99%" label="Satisfaction Rate" />
        <Stat number="24/7" label="AI Availability" />
      </div>
    </div>
  );
};

const FeatureCard = ({ icon: Icon, title, desc, color, gradient }: any) => (
  <div className={`p-8 rounded-3xl bg-white/5 backdrop-blur-lg border border-white/5 hover:border-white/20 transition-all duration-300 group relative overflow-hidden`}>
    <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
    <div className="relative z-10">
        <div className={`w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-white/10`}>
        <Icon className={`w-7 h-7 ${color}`} />
        </div>
        <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
        <p className="text-slate-400 leading-relaxed group-hover:text-slate-200 transition-colors">{desc}</p>
    </div>
  </div>
);

const Stat = ({ number, label }: any) => (
  <div className="text-center group cursor-default">
    <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 mb-2 group-hover:scale-110 transition-transform">{number}</div>
    <div className="text-sm text-primary font-semibold uppercase tracking-wider">{label}</div>
  </div>
);