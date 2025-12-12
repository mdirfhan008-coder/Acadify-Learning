import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle } from 'lucide-react';

export const Contact: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
        setLoading(false);
        setSubmitted(true);
    }, 1500);
  };

  return (
    <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 animate-fade-in">
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold text-white mb-4">Get in Touch</h2>
                <p className="text-slate-400 text-lg">
                    Have questions about Acadify? We're here to help. Send us a message and we'll respond as soon as possible.
                </p>
            </div>

            <div className="space-y-6">
                <ContactInfo icon={Mail} title="Email" info="acadify.edu@gmail.com" />
                <ContactInfo icon={Phone} title="Phone" info="+91 9080250073 / +91 6385346417" />
                <ContactInfo icon={MapPin} title="Office" info="Nagercoil" />
            </div>
        </div>

        <div className="bg-surface p-8 rounded-3xl border border-slate-700">
            {submitted ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-8 h-8 text-green-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">Message Sent!</h3>
                    <p className="text-slate-400">Thank you for contacting us. We will get back to you shortly.</p>
                    <button 
                        onClick={() => setSubmitted(false)}
                        className="mt-6 text-primary hover:text-white font-medium"
                    >
                        Send another message
                    </button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Full Name</label>
                        <input required type="text" className="w-full bg-background border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary" placeholder="John Doe" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Email Address</label>
                        <input required type="email" className="w-full bg-background border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary" placeholder="john@example.com" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Message</label>
                        <textarea required rows={4} className="w-full bg-background border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary resize-none" placeholder="How can we help you?" />
                    </div>
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Send className="w-5 h-5" /> Send Message</>}
                    </button>
                </form>
            )}
        </div>
    </div>
  );
};

const ContactInfo = ({ icon: Icon, title, info }: any) => (
    <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center shrink-0">
            <Icon className="w-6 h-6 text-primary" />
        </div>
        <div>
            <h4 className="text-white font-medium">{title}</h4>
            <p className="text-slate-400">{info}</p>
        </div>
    </div>
);