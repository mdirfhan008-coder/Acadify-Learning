import React from 'react';
import { GraduationCap, Users, Target, Heart } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-fade-in">
      <div className="text-center space-y-4">
        <h2 className="text-3xl md:text-5xl font-bold text-white">Reimagining Education</h2>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto">
          We are on a mission to make high-quality, personalized learning accessible to everyone through the power of Artificial Intelligence.
        </p>
      </div>

      <div className="relative rounded-3xl overflow-hidden aspect-video bg-slate-800 border border-slate-700 flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />
        {/* Placeholder for an image */}
        <div className="text-slate-600 flex flex-col items-center gap-4">
            <GraduationCap className="w-24 h-24 opacity-20" />
            <span className="text-sm font-medium uppercase tracking-widest opacity-50">Acadify Headquarters</span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-white">Our Story</h3>
          <p className="text-slate-400 leading-relaxed">
            Founded in 2024, Acadify started with a simple idea: students spend too much time organizing their study materials and not enough time actually learning. 
            By leveraging state-of-the-art Generative AI, we built a platform that handles the heavy lifting of summarization and quiz creation.
          </p>
          <p className="text-slate-400 leading-relaxed">
            Today, Acadify serves thousands of students worldwide, helping them ace exams, learn new languages, and master complex professional skills.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4">
            <ValueCard icon={Target} title="Precision Learning" desc="Targeted content that adapts to your syllabus." />
            <ValueCard icon={Users} title="Student First" desc="Designed by students, for students." />
            <ValueCard icon={Heart} title="Passion for Knowledge" desc="We believe learning should be exciting, not a chore." />
        </div>
      </div>
    </div>
  );
};

const ValueCard = ({ icon: Icon, title, desc }: any) => (
  <div className="bg-surface p-6 rounded-xl border border-slate-700 flex items-start gap-4">
    <div className="p-3 bg-slate-800 rounded-lg shrink-0">
        <Icon className="w-5 h-5 text-accent" />
    </div>
    <div>
        <h4 className="text-white font-bold mb-1">{title}</h4>
        <p className="text-sm text-slate-400">{desc}</p>
    </div>
  </div>
);