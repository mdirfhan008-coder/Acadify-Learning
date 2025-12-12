import React, { useState, useEffect } from 'react';
import { generateQuiz } from '../services/geminiService';
import { QuizQuestion, AppSettings } from '../types';
import { Loader2, BrainCircuit, Check, X, RefreshCcw, Trophy, ArrowRight, FileText, Sparkles, Book, Settings2 } from 'lucide-react';
import { parsePDF, getPDFContext, DocumentId, DOCUMENTS } from '../utils/pdfParser';

interface QuizModeProps {
  initialTopic?: string;
  settings: AppSettings;
  addHistory: (action: string, topic: string, meta?: string) => void;
}

export const QuizMode: React.FC<QuizModeProps> = ({ initialTopic = '', settings, addHistory }) => {
  const [mode, setMode] = useState<'topic' | 'document'>('topic');
  const [selectedDocId, setSelectedDocId] = useState<DocumentId>('cloud-computing');
  const [topic, setTopic] = useState(initialTopic);
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  
  // Customization State
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [questionCount, setQuestionCount] = useState(5);
  const [showOptions, setShowOptions] = useState(false);
  
  // Document state
  const [parsedDoc, setParsedDoc] = useState<ReturnType<typeof parsePDF> | null>(null);

  useEffect(() => {
    if (mode === 'document') {
      setParsedDoc(parsePDF(selectedDocId));
    }
  }, [mode, selectedDocId]);

  useEffect(() => {
    if (initialTopic) {
        setTopic(initialTopic);
        setMode('topic');
    }
  }, [initialTopic]);

  const startQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic) return;
    setLoading(true);
    try {
      const qs = await generateQuiz(topic, undefined, difficulty, questionCount, settings.language);
      setQuestions(qs);
      setCurrentQIndex(0);
      setScore(0);
      setShowResult(false);
      setIsAnswered(false);
      setSelectedOption(null);
    } catch (err) {
      alert("Failed to generate quiz. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const startDocumentQuiz = (unitIndex: number) => {
    if (!parsedDoc) return;
    const qs = parsedDoc.units[unitIndex].questions;
    setQuestions(qs);
    setCurrentQIndex(0);
    setScore(0);
    setShowResult(false);
    setIsAnswered(false);
    setSelectedOption(null);
  };

  const startAIGeneratedDocQuiz = async () => {
    if (!parsedDoc) return;
    setLoading(true);
    try {
      const fullText = getPDFContext(selectedDocId);
      const qs = await generateQuiz(`${parsedDoc.title} concepts from the document`, fullText, difficulty, questionCount, settings.language);
      setQuestions(qs);
      setCurrentQIndex(0);
      setScore(0);
      setShowResult(false);
      setIsAnswered(false);
      setSelectedOption(null);
    } catch (err) {
       alert("Failed to generate AI quiz from document.");
    } finally {
       setLoading(false);
    }
  }

  const handleAnswer = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);
    
    if (index === questions[currentQIndex].correctAnswerIndex) {
      setScore(s => s + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQIndex + 1 < questions.length) {
      setCurrentQIndex(p => p + 1);
      setIsAnswered(false);
      setSelectedOption(null);
    } else {
      setShowResult(true);
      addHistory('Completed Quiz', topic || parsedDoc?.title || 'General', `Score: ${score}/${questions.length}`);
    }
  };

  const resetQuiz = () => {
    setQuestions([]);
    setTopic('');
    setSelectedOption(null);
    setIsAnswered(false);
    setShowResult(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-6">
        <div className="relative">
            <div className="absolute inset-0 bg-primary blur-xl opacity-50 animate-pulse"></div>
            <Loader2 className="w-16 h-16 text-white animate-spin relative z-10" />
        </div>
        <p className="text-white font-medium text-xl">Preparing your exam...</p>
      </div>
    );
  }

  if (showResult) {
    return (
      <div className="max-w-xl mx-auto text-center space-y-8 animate-in zoom-in duration-300 pt-10">
        <div className="glass-card rounded-[2.5rem] p-12 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-accent" />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />
          
          <div className="w-28 h-28 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-yellow-500/30">
            <Trophy className="w-14 h-14 text-white" />
          </div>
          
          <h2 className="text-4xl font-bold text-white mb-2">Quiz Completed!</h2>
          <p className="text-slate-300 text-lg mb-8">You mastered this topic</p>
          
          <div className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent mb-10 drop-shadow-sm">
            {score} / {questions.length}
          </div>
          
          <button
            onClick={resetQuiz}
            className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-2xl font-bold transition-all flex items-center gap-3 mx-auto border border-white/10 hover:border-white/30"
          >
            <RefreshCcw className="w-5 h-5" /> Try Another Topic
          </button>
        </div>
      </div>
    );
  }

  if (questions.length > 0) {
    const question = questions[currentQIndex];
    return (
      <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8">
        <div className="flex justify-between items-center text-sm font-bold text-slate-400 mb-2 uppercase tracking-wider">
          <span>Question {currentQIndex + 1} / {questions.length}</span>
          <span className="bg-white/10 px-3 py-1 rounded-lg text-white">Score: {score}</span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden border border-white/5">
          <div 
            className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500 ease-out shadow-[0_0_10px_rgba(168,85,247,0.5)]"
            style={{ width: `${((currentQIndex + 1) / questions.length) * 100}%` }}
          />
        </div>

        <div className="glass-card p-8 md:p-12 rounded-[2rem] space-y-8">
          <h3 className="text-2xl md:text-3xl font-bold text-white leading-snug">
            {question.question}
          </h3>

          <div className="space-y-4">
            {question.options.map((option, idx) => {
              let stateStyles = "border-white/10 hover:border-white/30 hover:bg-white/5";
              let icon = null;
              
              if (isAnswered) {
                if (idx === question.correctAnswerIndex) {
                  stateStyles = "border-green-500 bg-green-500/20 text-green-100";
                  icon = <Check className="w-6 h-6 text-green-400" />;
                } else if (idx === selectedOption) {
                  stateStyles = "border-red-500 bg-red-500/20 text-red-100";
                  icon = <X className="w-6 h-6 text-red-400" />;
                } else {
                  stateStyles = "border-transparent opacity-40";
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  disabled={isAnswered}
                  className={`w-full text-left p-6 rounded-2xl border-2 transition-all duration-300 flex items-center justify-between group ${stateStyles} ${selectedOption === idx && !isAnswered ? 'border-primary bg-primary/10' : ''}`}
                >
                  <span className="text-lg font-medium">{option}</span>
                  {icon}
                </button>
              );
            })}
          </div>

          {isAnswered && (
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg shrink-0">
                      <BrainCircuit className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-blue-300 uppercase mb-1">Explanation</p>
                    <p className="text-base text-blue-100 leading-relaxed">
                        {question.explanation}
                    </p>
                  </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={nextQuestion}
                  className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg shadow-primary/20 hover:translate-x-1"
                >
                  {currentQIndex + 1 === questions.length ? 'Finish Quiz' : 'Next Question'} <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Initial State
  return (
    <div className="max-w-4xl mx-auto space-y-10 text-center pt-10">
      <div className="inline-flex p-6 rounded-[2rem] bg-gradient-to-br from-white/10 to-white/5 border border-white/10 shadow-2xl mb-4">
        <BrainCircuit className="w-16 h-16 text-accent" />
      </div>
      
      <div className="space-y-4">
        <h2 className="text-5xl font-bold text-white tracking-tight">Test Your Knowledge</h2>
        <p className="text-xl text-slate-300 max-w-lg mx-auto leading-relaxed">
            Choose a mode to start testing your skills.
        </p>
      </div>

      <div className="flex justify-center gap-4 mb-8">
        <button 
          onClick={() => setMode('topic')} 
          className={`px-6 py-3 rounded-xl font-bold transition-all ${mode === 'topic' ? 'bg-white text-black' : 'bg-white/10 text-white hover:bg-white/20'}`}
        >
          AI Generator
        </button>
        <button 
          onClick={() => setMode('document')} 
          className={`px-6 py-3 rounded-xl font-bold transition-all ${mode === 'document' ? 'bg-white text-black' : 'bg-white/10 text-white hover:bg-white/20'}`}
        >
          Question Bank (PDF)
        </button>
      </div>

      {/* Custom Test Settings Toggle */}
      <div className="flex justify-center mb-4">
        <button 
            onClick={() => setShowOptions(!showOptions)}
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
        >
            <Settings2 className="w-4 h-4" /> {showOptions ? 'Hide' : 'Show'} Custom Options
        </button>
      </div>

      {showOptions && (
        <div className="glass-card p-6 rounded-2xl max-w-lg mx-auto mb-8 animate-in slide-in-from-top-4">
            <div className="grid grid-cols-2 gap-4 text-left">
                <div>
                    <label className="text-xs font-bold text-slate-400 uppercase block mb-2">Difficulty</label>
                    <select 
                        value={difficulty} 
                        onChange={(e) => setDifficulty(e.target.value as any)}
                        className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary"
                    >
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                    </select>
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-400 uppercase block mb-2">Questions</label>
                    <input 
                        type="number" 
                        min="1" max="20"
                        value={questionCount}
                        onChange={(e) => setQuestionCount(Number(e.target.value))}
                        className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary"
                    />
                </div>
            </div>
        </div>
      )}

      {mode === 'topic' ? (
        <form onSubmit={startQuiz} className="relative max-w-xl mx-auto mt-8 animate-in fade-in">
          <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-accent to-primary rounded-3xl blur opacity-30 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
              <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter a topic (e.g. World War II)"
              className="relative w-full bg-[#020617] border border-white/10 text-white pl-8 pr-40 py-5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent/50 placeholder:text-slate-600 shadow-2xl text-lg"
              />
              <button
              type="submit"
              disabled={!topic}
              className="absolute right-2 top-2 bottom-2 bg-gradient-to-r from-accent to-pink-600 hover:from-pink-600 hover:to-accent text-white px-8 rounded-xl font-bold transition-all disabled:opacity-50 shadow-lg shadow-accent/20"
              >
              Start Quiz
              </button>
          </div>
        </form>
      ) : (
        <div className="animate-in fade-in max-w-4xl mx-auto space-y-6">
          <div className="flex justify-center gap-2 overflow-x-auto pb-2">
            {Object.entries(DOCUMENTS).map(([key, doc]) => (
                <button
                    key={key}
                    onClick={() => setSelectedDocId(key as DocumentId)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all whitespace-nowrap ${
                        selectedDocId === key 
                        ? 'bg-white text-black border-white' 
                        : 'bg-white/5 text-slate-400 border-white/10 hover:border-white/30 hover:bg-white/10'
                    }`}
                >
                    <Book className="w-4 h-4" />
                    {doc.title}
                </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {parsedDoc ? (
              <>
                {parsedDoc.units.map((unit, index) => (
                  <div key={index} className="glass-card p-6 rounded-2xl text-left hover:bg-white/10 transition-colors group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400">
                          <FileText className="w-6 h-6" />
                        </div>
                        <span className="px-3 py-1 rounded-full bg-white/5 text-xs font-bold uppercase tracking-wider text-slate-400">
                          {unit.questions.length} Questions
                        </span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{parsedDoc.title}</h3>
                    <p className="text-slate-400 text-sm mb-6">{unit.name} - Multiple Choice Questions</p>
                    <button 
                      onClick={() => startDocumentQuiz(index)}
                      className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-colors"
                    >
                      Start {unit.name} Quiz
                    </button>
                  </div>
                ))}
                
                <div className="glass-card p-6 rounded-2xl text-left hover:bg-white/10 transition-colors border-dashed border-2 border-white/20">
                  <div className="flex justify-between items-start mb-4">
                      <div className="p-3 bg-purple-500/20 rounded-xl text-purple-400">
                        <Sparkles className="w-6 h-6" />
                      </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">AI Generated Challenge</h3>
                  <p className="text-slate-400 text-sm mb-6">Create a totally new {difficulty} quiz ({questionCount} questions) based on the deep context of the selected PDF.</p>
                  <button 
                    onClick={startAIGeneratedDocQuiz}
                    className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl font-bold transition-colors"
                  >
                    Generate New Questions
                  </button>
                </div>
              </>
            ) : (
              <div className="col-span-2 py-12 text-slate-400">Loading Document...</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};