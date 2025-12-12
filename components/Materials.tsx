import React, { useState, useEffect } from 'react';
import { generateStudyMaterial } from '../services/geminiService';
import { StudySet, AppSettings } from '../types';
import { Sparkles, Loader2, Book, RotateCw, CheckCircle2, FileText, Download, PenTool, Printer } from 'lucide-react';
import { getPDFContext, DocumentId, DOCUMENTS } from '../utils/pdfParser';

interface MaterialsProps {
  initialTopic?: string;
  settings: AppSettings;
  addHistory: (action: string, topic: string) => void;
}

export const Materials: React.FC<MaterialsProps> = ({ initialTopic = '', settings, addHistory }) => {
  const [mode, setMode] = useState<'topic' | 'document'>('topic');
  const [selectedDocId, setSelectedDocId] = useState<DocumentId>('cloud-computing');
  const [topic, setTopic] = useState(initialTopic);
  const [loading, setLoading] = useState(false);
  const [studySet, setStudySet] = useState<StudySet | null>(null);
  const [activeTab, setActiveTab] = useState<'summary' | 'flashcards'>('summary');
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  
  // Interactive Note State
  const [userNotes, setUserNotes] = useState('');
  const [showNotes, setShowNotes] = useState(false);

  useEffect(() => {
    if (initialTopic) {
        setTopic(initialTopic);
        setMode('topic');
    }
  }, [initialTopic]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);
    setStudySet(null);
    try {
      let context = undefined;
      if (mode === 'document') {
         context = getPDFContext(selectedDocId);
      }
      const result = await generateStudyMaterial(topic, context, settings.language);
      setStudySet(result);
      setCurrentCardIndex(0);
      setIsFlipped(false);
      addHistory('Generated Materials', topic);
    } catch (error) {
      alert("Failed to generate content. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const nextCard = () => {
    if (!studySet) return;
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentCardIndex((prev) => (prev + 1) % studySet.flashcards.length);
    }, 200);
  };

  const prevCard = () => {
    if (!studySet) return;
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentCardIndex((prev) => (prev - 1 + studySet.flashcards.length) % studySet.flashcards.length);
    }, 200);
  };

  const handlePrint = () => {
    window.print();
    addHistory('Downloaded/Printed', topic);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold text-white">AI Study Material Generator</h2>
        <p className="text-slate-400 max-w-lg mx-auto text-lg">
          Generate comprehensive study guides and flashcards instantly.
        </p>
      </div>

      <div className="flex flex-col items-center gap-4 mb-2 print:hidden">
         <div className="flex justify-center gap-4">
            <button 
                onClick={() => setMode('topic')} 
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all border ${mode === 'topic' ? 'bg-white text-black border-white' : 'bg-transparent text-slate-400 border-white/20 hover:border-white'}`}
            >
                Generic Topic
            </button>
            <button 
                onClick={() => { setMode('document'); setTopic('Overview'); }} 
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all border ${mode === 'document' ? 'bg-white text-black border-white' : 'bg-transparent text-slate-400 border-white/20 hover:border-white'}`}
            >
                Use Course PDF
            </button>
         </div>

         {mode === 'document' && (
             <div className="flex flex-wrap justify-center gap-2 animate-in fade-in">
                {Object.entries(DOCUMENTS).map(([key, doc]) => (
                    <button
                        key={key}
                        onClick={() => setSelectedDocId(key as DocumentId)}
                        className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                            selectedDocId === key 
                            ? 'bg-primary/20 text-primary border-primary' 
                            : 'bg-white/5 text-slate-400 border-white/10 hover:border-white/30'
                        }`}
                    >
                        {doc.title}
                    </button>
                ))}
             </div>
         )}
      </div>

      <form onSubmit={handleGenerate} className="relative max-w-3xl mx-auto print:hidden">
        <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-accent rounded-3xl blur opacity-30 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative flex items-center bg-[#020617] border border-white/10 rounded-2xl p-2 shadow-2xl">
                {mode === 'document' && (
                    <div className="pl-4 pr-2 text-slate-400 hidden sm:block">
                        <FileText className="w-5 h-5" />
                    </div>
                )}
                <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder={mode === 'document' ? `What specific part of ${DOCUMENTS[selectedDocId].title}?` : "e.g. Quantum Physics, French Revolution..."}
                    className="w-full bg-transparent text-white px-4 py-4 focus:outline-none placeholder:text-slate-600 text-lg"
                />
                <button
                    type="submit"
                    disabled={loading || !topic}
                    className="bg-gradient-to-r from-primary to-indigo-600 hover:from-indigo-600 hover:to-primary text-white px-8 py-3 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-primary/20 shrink-0 m-1"
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Sparkles className="w-4 h-4" /> Generate</>}
                </button>
            </div>
        </div>
        {mode === 'document' && (
            <p className="text-center text-xs text-slate-500 mt-3">
                Using source: {DOCUMENTS[selectedDocId].title}
            </p>
        )}
      </form>

      {studySet && (
        <div className="space-y-8 animate-fade-in">
          {/* Controls */}
          <div className="flex justify-between items-center print:hidden">
             {/* Tabs */}
            <div className="flex gap-6 border-b border-white/10 pb-1">
                <button
                onClick={() => setActiveTab('summary')}
                className={`pb-4 px-6 text-base font-bold transition-all relative ${activeTab === 'summary' ? 'text-white' : 'text-slate-500 hover:text-white'}`}
                >
                Summary & Concepts
                {activeTab === 'summary' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent rounded-t-full shadow-[0_0_10px_rgba(168,85,247,0.5)]" />}
                </button>
                <button
                onClick={() => setActiveTab('flashcards')}
                className={`pb-4 px-6 text-base font-bold transition-all relative ${activeTab === 'flashcards' ? 'text-white' : 'text-slate-500 hover:text-white'}`}
                >
                Flashcards ({studySet.flashcards.length})
                {activeTab === 'flashcards' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent rounded-t-full shadow-[0_0_10px_rgba(168,85,247,0.5)]" />}
                </button>
            </div>
            
            <div className="flex gap-2">
                <button 
                    onClick={() => setShowNotes(!showNotes)}
                    className={`p-2 rounded-lg transition-colors ${showNotes ? 'bg-primary text-white' : 'bg-white/5 text-slate-400 hover:text-white'}`}
                    title="Take Notes"
                >
                    <PenTool className="w-5 h-5" />
                </button>
                <button 
                    onClick={handlePrint}
                    className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-white transition-colors hover:bg-white/10"
                    title="Print / Save as PDF"
                >
                    <Printer className="w-5 h-5" />
                </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="min-h-[400px] flex gap-6">
            <div className="flex-1">
                {activeTab === 'summary' ? (
                <div className="grid gap-8 animate-in slide-in-from-bottom-4 duration-500 print:block">
                    <div className="glass-card rounded-3xl p-10 print:border print:border-black print:text-black print:bg-white">
                    <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3 print:text-black">
                        <Book className="w-6 h-6 text-accent print:text-black" />
                        Overview
                    </h3>
                    <p className="text-slate-300 leading-loose whitespace-pre-wrap text-lg print:text-black">{studySet.summary}</p>
                    </div>
                    
                    <div className="glass-card rounded-3xl p-10 print:border print:border-black print:text-black print:bg-white">
                    <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3 print:text-black">
                        <CheckCircle2 className="w-6 h-6 text-secondary print:text-black" />
                        Key Concepts
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                        {studySet.keyConcepts.map((concept, i) => (
                        <div key={i} className="bg-white/5 p-5 rounded-2xl border border-white/5 flex items-start gap-4 hover:bg-white/10 transition-colors print:border-black print:text-black">
                            <div className="w-2 h-2 rounded-full bg-secondary mt-2.5 shrink-0 shadow-[0_0_8px_rgba(6,182,212,0.5)] print:hidden" />
                            <span className="text-slate-200 font-medium print:text-black">{concept}</span>
                        </div>
                        ))}
                    </div>
                    </div>
                </div>
                ) : (
                <div className="flex flex-col items-center justify-center py-8 animate-in slide-in-from-bottom-4 duration-500">
                    <div 
                    className="w-full max-w-2xl h-96 perspective-1000 cursor-pointer group"
                    onClick={() => setIsFlipped(!isFlipped)}
                    >
                    <div className={`relative w-full h-full transition-all duration-700 preserve-3d transform ${isFlipped ? 'rotate-y-180' : ''}`}>
                        {/* Front */}
                        <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-10 flex flex-col items-center justify-center text-center shadow-2xl group-hover:border-primary/50 transition-colors">
                        <span className="text-sm uppercase tracking-[0.2em] text-primary font-bold mb-6">Question</span>
                        <p className="text-2xl md:text-3xl font-bold text-white leading-tight">
                            {studySet.flashcards[currentCardIndex].front}
                        </p>
                        <span className="absolute bottom-8 text-sm text-slate-400 flex items-center gap-2 bg-black/20 px-4 py-2 rounded-full print:hidden">
                            <RotateCw className="w-4 h-4" /> Click to flip
                        </span>
                        </div>

                        {/* Back */}
                        <div className="absolute inset-0 backface-hidden rotate-y-180 bg-gradient-to-br from-primary/20 to-indigo-900/40 backdrop-blur-xl border border-primary/30 rounded-[2rem] p-10 flex flex-col items-center justify-center text-center shadow-2xl">
                        <span className="text-sm uppercase tracking-[0.2em] text-white/50 font-bold mb-6">Answer</span>
                        <p className="text-xl md:text-2xl text-white leading-relaxed font-medium">
                            {studySet.flashcards[currentCardIndex].back}
                        </p>
                        </div>
                    </div>
                    </div>

                    <div className="flex items-center gap-8 mt-10 print:hidden">
                    <button 
                        onClick={prevCard}
                        className="p-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all hover:scale-110"
                    >
                        ←
                    </button>
                    <span className="text-lg font-bold text-white bg-white/5 px-6 py-2 rounded-full border border-white/10">
                        {currentCardIndex + 1} / {studySet.flashcards.length}
                    </span>
                    <button 
                        onClick={nextCard}
                        className="p-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all hover:scale-110"
                    >
                        →
                    </button>
                    </div>
                </div>
                )}
            </div>

            {/* In-content Interactivity (Notes) */}
            {showNotes && (
                <div className="w-80 shrink-0 bg-white/5 border-l border-white/10 p-6 flex flex-col animate-in slide-in-from-right print:hidden">
                    <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                        <PenTool className="w-4 h-4 text-accent" /> My Notes
                    </h4>
                    <textarea
                        value={userNotes}
                        onChange={(e) => setUserNotes(e.target.value)}
                        placeholder="Type your observations here..."
                        className="flex-1 bg-black/20 rounded-xl p-4 text-slate-300 resize-none focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <div className="mt-4 flex justify-end">
                        <button className="text-xs text-slate-400 hover:text-white">Save to Dashboard</button>
                    </div>
                </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};