import React from 'react';

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = "", showText = true }) => (
  <div className={`flex items-center gap-3 ${className}`}>
    <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-primary via-indigo-600 to-accent shadow-lg shadow-indigo-500/20 ring-1 ring-white/10 group-hover:scale-105 transition-transform duration-300">
       <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-white">
         <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z" />
         <path d="M22 10v6" />
         <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" />
       </svg>
    </div>
    {showText && (
      <span className="text-xl font-bold bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent tracking-tight">
        Acadify
      </span>
    )}
  </div>
);