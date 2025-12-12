import React, { useState, useRef, useEffect } from 'react';
import { getChatResponse } from '../services/geminiService';
import { ChatMessage, AppSettings } from '../types';
import { Send, Bot, User, Loader2, Sparkles } from 'lucide-react';

interface ChatTutorProps {
  settings?: AppSettings;
}

export const ChatTutor: React.FC<ChatTutorProps> = ({ settings }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      text: "Hello! I'm your AI Tutor. I can help explain concepts, solve problems, or give you study tips. What are we learning today?",
      timestamp: new Date()
    }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = { role: 'user', text: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // Format history for API
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const responseText = await getChatResponse(history, userMsg.text, settings?.language);
      
      const botMsg: ChatMessage = { role: 'model', text: responseText || "I couldn't generate a response.", timestamp: new Date() };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "Sorry, I encountered an error. Please try again.", timestamp: new Date() }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col max-w-5xl mx-auto glass-card rounded-[2rem] shadow-2xl overflow-hidden border border-white/10">
      {/* Header */}
      <div className="p-6 border-b border-white/10 bg-white/5 backdrop-blur flex items-center gap-4">
        <div className="p-3 bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl shadow-lg shadow-green-500/20">
          <Bot className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="font-bold text-xl text-white">AI Tutor Assistant</h2>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
            </span>
            <span className="text-xs text-green-400 font-medium">Online & Ready</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
        {messages.map((msg, idx) => {
          const isUser = msg.role === 'user';
          return (
            <div key={idx} className={`flex gap-4 ${isUser ? 'flex-row-reverse' : ''} animate-in slide-in-from-bottom-2 fade-in duration-300`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-lg ${isUser ? 'bg-gradient-to-br from-primary to-violet-600' : 'bg-gradient-to-br from-slate-700 to-slate-800'}`}>
                {isUser ? <User className="w-5 h-5 text-white" /> : <Sparkles className="w-5 h-5 text-yellow-400" />}
              </div>
              <div className={`flex flex-col gap-1 max-w-[80%] ${isUser ? 'items-end' : 'items-start'}`}>
                <div className={`p-5 rounded-2xl shadow-md ${
                  isUser 
                    ? 'bg-primary text-white rounded-tr-none' 
                    : 'bg-white/10 backdrop-blur-md text-slate-100 rounded-tl-none border border-white/5'
                }`}>
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                </div>
                <span className="text-xs text-slate-500 font-medium px-2">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          );
        })}
        {loading && (
          <div className="flex gap-4">
             <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-yellow-400" />
              </div>
              <div className="bg-white/5 backdrop-blur-md p-5 rounded-2xl rounded-tl-none border border-white/5 flex items-center gap-2">
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-6 bg-black/20 border-t border-white/10 backdrop-blur-md">
        <div className="relative flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about your studies..."
            className="flex-1 bg-white/5 border border-white/10 text-white pl-6 pr-14 py-4 rounded-2xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-slate-500 shadow-inner"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="absolute right-2 p-3 bg-primary hover:bg-primary/90 text-white rounded-xl transition-all disabled:opacity-50 disabled:bg-slate-700 shadow-lg shadow-primary/20 hover:scale-105"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </div>
      </form>
    </div>
  );
};