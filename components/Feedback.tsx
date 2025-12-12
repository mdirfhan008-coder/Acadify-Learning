import React, { useState } from 'react';
import { Star, MessageSquare, Send } from 'lucide-react';

export const Feedback: React.FC = () => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
        <div className="max-w-2xl mx-auto text-center py-12 animate-fade-in">
            <h2 className="text-3xl font-bold text-white mb-4">Thank You!</h2>
            <p className="text-slate-400">Your feedback helps us make Acadify better for everyone.</p>
        </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-white">We Value Your Feedback</h2>
        <p className="text-slate-400">
            Tell us about your experience with Acadify. We read every message.
        </p>
      </div>

      <div className="bg-surface p-8 rounded-3xl border border-slate-700">
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex flex-col items-center gap-4">
                <label className="text-sm font-medium text-slate-300">How would you rate your experience?</label>
                <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoveredRating(star)}
                            onMouseLeave={() => setHoveredRating(0)}
                            className="p-1 transition-transform hover:scale-110 focus:outline-none"
                        >
                            <Star 
                                className={`w-8 h-8 ${
                                    star <= (hoveredRating || rating) 
                                        ? 'text-yellow-400 fill-yellow-400' 
                                        : 'text-slate-600'
                                }`} 
                            />
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" /> Your Feedback
                </label>
                <textarea 
                    className="w-full bg-background border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary resize-none h-40" 
                    placeholder="What do you like? What can we improve?"
                    required
                />
            </div>

            <button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-xl font-bold transition-all"
            >
                Submit Feedback
            </button>
        </form>
      </div>
    </div>
  );
};