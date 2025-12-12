import React from 'react';
import { 
  BookOpen, LayoutDashboard, MessageCircle, BrainCircuit, 
  Menu, X, Home, Info, Library, Mail, MessageSquare, LogOut, Search, Users, Settings
} from 'lucide-react';
import { View } from '../types';
import { Logo } from './Logo';

interface LayoutProps {
  currentView: View;
  setCurrentView: (view: View) => void;
  onLogout: () => void;
  onOpenSettings: () => void;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ currentView, setCurrentView, onLogout, onOpenSettings, children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const mainNav = [
    { view: View.HOME, label: 'Home', icon: Home },
    { view: View.EXPLORE, label: 'AI Search', icon: Search },
    { view: View.COMMUNITY, label: 'Community', icon: Users },
    { view: View.ABOUT, label: 'About Us', icon: Info },
    { view: View.COURSES, label: 'Courses', icon: Library },
  ];

  const appNav = [
    { view: View.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { view: View.MATERIALS, label: 'Study Materials', icon: BookOpen },
    { view: View.QUIZ, label: 'Quiz Mode', icon: BrainCircuit },
    { view: View.TUTOR, label: 'AI Tutor', icon: MessageCircle },
  ];

  const supportNav = [
    { view: View.CONTACT, label: 'Contact', icon: Mail },
    { view: View.FEEDBACK, label: 'Feedback', icon: MessageSquare },
  ];

  const NavGroup = ({ title, items }: { title: string, items: any[] }) => (
    <div className="mb-6">
      <h3 className="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
        {title}
      </h3>
      <div className="space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.view;
          return (
            <button
              key={item.view}
              onClick={() => {
                setCurrentView(item.view);
                setIsMobileMenuOpen(false);
              }}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 relative overflow-hidden group
                ${isActive 
                  ? 'text-white shadow-lg shadow-primary/20' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'}
              `}
            >
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary opacity-20" />
              )}
              {isActive && (
                 <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-accent" />
              )}
              <Icon className={`w-5 h-5 relative z-10 transition-colors ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-primary'}`} />
              <span className="relative z-10">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="flex h-screen text-gray-100 overflow-hidden bg-transparent">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* Sidebar - Glassmorphism */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-[#020617]/80 backdrop-blur-xl border-r border-white/10 transform transition-transform duration-300 ease-in-out flex flex-col shadow-2xl
        md:relative md:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 border-b border-white/10 bg-gradient-to-r from-white/5 to-transparent">
          <Logo />
          <button className="absolute top-6 right-4 md:hidden" onClick={() => setIsMobileMenuOpen(false)}>
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 custom-scrollbar">
          <NavGroup title="Main" items={mainNav} />
          <NavGroup title="Learning App" items={appNav} />
          <NavGroup title="Support" items={supportNav} />
        </nav>

        <div className="p-4 border-t border-white/10 bg-black/20 space-y-2">
           <button 
             onClick={onOpenSettings}
             className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all group"
           >
             <Settings className="w-5 h-5 group-hover:text-primary transition-colors" />
             Settings
           </button>
           <button 
             onClick={onLogout}
             className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-red-500/10 hover:border hover:border-red-500/20 transition-all group"
           >
             <LogOut className="w-5 h-5 group-hover:text-red-400 transition-colors" />
             Sign Out
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className="h-20 bg-[#020617]/60 backdrop-blur-md border-b border-white/5 flex items-center px-4 md:px-8 justify-between md:justify-end sticky top-0 z-30">
          <button className="md:hidden p-2 -ml-2 text-slate-400 hover:text-white" onClick={() => setIsMobileMenuOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="flex items-center gap-6">
            <div className="hidden sm:flex flex-col items-end">
                <span className="text-sm font-medium text-white">Student Account</span>
                <span className="text-xs text-slate-400">Premium Plan</span>
            </div>
            <div className="relative group cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-full blur opacity-50 group-hover:opacity-100 transition-opacity" />
                <div className="w-10 h-10 rounded-full bg-slate-800 relative ring-2 ring-white/10 overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-sm font-bold">
                        S
                    </div>
                </div>
            </div>
          </div>
        </header>
        
        <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth relative">
            {/* Background ambient glow inside main area */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                 <div className="absolute top-[10%] left-[20%] w-96 h-96 bg-primary/10 rounded-full blur-[100px]" />
                 <div className="absolute bottom-[20%] right-[10%] w-80 h-80 bg-accent/10 rounded-full blur-[100px]" />
            </div>
            <div className="max-w-7xl mx-auto w-full pb-10 relative z-10">
                {children}
            </div>
        </div>
      </main>
    </div>
  );
};