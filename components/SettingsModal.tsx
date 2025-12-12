import React, { useState, useEffect } from 'react';
import { X, Globe, Eye, Type, Zap, Key, Save, AlertCircle } from 'lucide-react';
import { AppSettings } from '../types';
import { updateApiKey } from '../services/geminiService';

interface SettingsModalProps {
  settings: AppSettings;
  setSettings: (settings: AppSettings) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ settings, setSettings, onClose }) => {
  const languages = ['English', 'Spanish', 'French', 'German', 'Chinese', 'Hindi', 'Tamil', 'Arabic'];
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('gemini_api_key');
    if (stored) setApiKey(stored);
  }, []);

  const toggleSetting = (key: keyof AppSettings) => {
    if (key === 'language') return;
    setSettings({ ...settings, [key]: !settings[key] });
  };

  const handleLanguageChange = (lang: string) => {
    setSettings({ ...settings, language: lang });
  };

  const handleSaveKey = () => {
    if (apiKey.trim()) {
        updateApiKey(apiKey.trim());
        alert('API Key saved successfully!');
    } else {
        localStorage.removeItem('gemini_api_key');
        updateApiKey(''); // Reset
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-in fade-in p-4">
      <div className="bg-[#0f172a] border border-white/10 rounded-2xl w-full max-w-lg p-6 relative shadow-2xl max-h-[90vh] overflow-y-auto">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold text-white mb-6">Settings & Accessibility</h2>

        <div className="space-y-8">
            {/* API Configuration */}
            <div className="bg-white/5 rounded-xl p-4 border border-white/10 space-y-3">
                <label className="text-sm font-bold text-primary uppercase tracking-wider flex items-center gap-2">
                    <Key className="w-4 h-4" /> API Configuration
                </label>
                <p className="text-xs text-slate-400 leading-relaxed">
                    If AI features are not working, please add your Gemini API Key here. 
                    Your key is stored locally on your device.
                </p>
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <input 
                            type={showKey ? "text" : "password"}
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            placeholder="Paste Gemini API Key here..."
                            className="w-full bg-black/40 border border-white/10 rounded-lg pl-4 pr-10 py-2.5 text-white text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                        />
                        <button 
                            onClick={() => setShowKey(!showKey)}
                            className="absolute right-3 top-2.5 text-slate-500 hover:text-white"
                        >
                            {showKey ? <Eye className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                    <button 
                        onClick={handleSaveKey}
                        className="bg-primary hover:bg-primary/90 text-white px-4 rounded-lg font-bold text-sm transition-colors flex items-center gap-2"
                    >
                        <Save className="w-4 h-4" /> Save
                    </button>
                </div>
            </div>

          {/* Language */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Globe className="w-4 h-4" /> Language
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {languages.map((lang) => (
                <button
                  key={lang}
                  onClick={() => handleLanguageChange(lang)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all text-left truncate ${
                    settings.language === lang 
                      ? 'bg-primary text-white' 
                      : 'bg-white/5 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          <div className="h-px bg-white/10" />

          {/* Accessibility */}
          <div className="space-y-4">
            <label className="text-sm font-bold text-slate-400 uppercase tracking-wider">
              Display & Accessibility
            </label>

            <button 
              onClick={() => toggleSetting('highContrast')}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <Eye className="w-5 h-5 text-accent" />
                <div className="text-left">
                  <span className="block text-white font-medium">High Contrast Mode</span>
                  <span className="text-xs text-slate-400">Increase distinctiveness of UI elements</span>
                </div>
              </div>
              <div className={`w-10 h-5 rounded-full relative transition-colors ${settings.highContrast ? 'bg-primary' : 'bg-slate-700'}`}>
                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-transform ${settings.highContrast ? 'left-6' : 'left-1'}`} />
              </div>
            </button>

            <button 
              onClick={() => toggleSetting('largeText')}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <Type className="w-5 h-5 text-yellow-400" />
                <div className="text-left">
                  <span className="block text-white font-medium">Large Text</span>
                  <span className="text-xs text-slate-400">Enhance readability of content</span>
                </div>
              </div>
              <div className={`w-10 h-5 rounded-full relative transition-colors ${settings.largeText ? 'bg-primary' : 'bg-slate-700'}`}>
                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-transform ${settings.largeText ? 'left-6' : 'left-1'}`} />
              </div>
            </button>

            <button 
              onClick={() => toggleSetting('reduceMotion')}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-cyan-400" />
                <div className="text-left">
                  <span className="block text-white font-medium">Reduce Motion</span>
                  <span className="text-xs text-slate-400">Minimize animations and transitions</span>
                </div>
              </div>
              <div className={`w-10 h-5 rounded-full relative transition-colors ${settings.reduceMotion ? 'bg-primary' : 'bg-slate-700'}`}>
                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-transform ${settings.reduceMotion ? 'left-6' : 'left-1'}`} />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};