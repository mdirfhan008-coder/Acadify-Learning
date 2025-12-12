import React, { useState, useEffect } from 'react';
import { View, AppSettings, ActivityLog } from './types';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { Materials } from './components/Materials';
import { QuizMode } from './components/QuizMode';
import { ChatTutor } from './components/ChatTutor';
import { Home } from './components/Home';
import { About } from './components/About';
import { Courses } from './components/Courses';
import { Contact } from './components/Contact';
import { Feedback } from './components/Feedback';
import { Login } from './components/Login';
import { Explore } from './components/Explore';
import { Community } from './components/Community';
import { SettingsModal } from './components/SettingsModal';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState<View>(View.HOME);
  const [activeTopic, setActiveTopic] = useState<string>('');
  
  // App Settings
  const [settings, setSettings] = useState<AppSettings>({
    language: 'English',
    highContrast: false,
    largeText: false,
    reduceMotion: false
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Activity History
  const [history, setHistory] = useState<ActivityLog[]>([]);

  const addHistoryItem = (action: string, topic: string, meta?: string) => {
    const newLog: ActivityLog = {
      id: crypto.randomUUID(),
      action,
      topic,
      timestamp: new Date(),
      meta
    };
    setHistory(prev => [newLog, ...prev]);
  };

  // Mock stats
  const [stats] = useState({
    topicsStudied: 12,
    quizzesTaken: 5,
    averageScore: 84,
    hoursSpent: 19.5
  });

  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentView(View.HOME);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const handleNavigateFromExplore = (view: View, topic: string) => {
    setActiveTopic(topic);
    setCurrentView(view);
    addHistoryItem('Explored Topic', topic);
  };

  const renderView = () => {
    switch (currentView) {
      case View.HOME:
        return <Home setCurrentView={setCurrentView} />;
      case View.EXPLORE:
        return <Explore onNavigate={handleNavigateFromExplore} />;
      case View.COMMUNITY:
        return <Community />;
      case View.ABOUT:
        return <About />;
      case View.COURSES:
        return <Courses initialTopic={activeTopic} settings={settings} addHistory={addHistoryItem} />;
      case View.CONTACT:
        return <Contact />;
      case View.FEEDBACK:
        return <Feedback />;
      case View.DASHBOARD:
        return <Dashboard stats={stats} history={history} setCurrentView={setCurrentView} />;
      case View.MATERIALS:
        return <Materials initialTopic={activeTopic} settings={settings} addHistory={addHistoryItem} />;
      case View.QUIZ:
        return <QuizMode initialTopic={activeTopic} settings={settings} addHistory={addHistoryItem} />;
      case View.TUTOR:
        return <ChatTutor settings={settings} />;
      default:
        return <Home setCurrentView={setCurrentView} />;
    }
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className={`${settings.highContrast ? 'contrast-125' : ''} ${settings.largeText ? 'text-lg' : ''}`}>
      <Layout 
        currentView={currentView} 
        setCurrentView={setCurrentView}
        onLogout={handleLogout}
        onOpenSettings={() => setIsSettingsOpen(true)}
      >
        {renderView()}
      </Layout>

      {isSettingsOpen && (
        <SettingsModal 
          settings={settings} 
          setSettings={setSettings} 
          onClose={() => setIsSettingsOpen(false)} 
        />
      )}
    </div>
  );
};

export default App;