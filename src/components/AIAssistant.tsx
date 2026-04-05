"use client";

import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, X, Bot, User, Activity } from 'lucide-react';

export default function AIAssistant({ analysisData, patientName }: { analysisData: any, patientName: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user'|'assistant', content: string}[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-open and send initial context-aware message when analysis completes with HIGH risk
  useEffect(() => {
    if (analysisData && analysisData.riskLevel === 'high') {
      setIsOpen(true);
      setMessages([
        { 
          role: 'assistant', 
          content: `URGENT: I've analyzed the telemetry for ${patientName || 'the patient'}. They are in severe hypoglycemia (${analysisData.happening}). Please follow the exact action plan: ${analysisData.caregiverAction}\n\nDo you need step-by-step instructions on administering Glucagon or 15g of carbs right now?` 
        }
      ]);
    } else if (analysisData && analysisData.riskLevel === 'medium') {
      setIsOpen(true);
      setMessages([
        { 
          role: 'assistant', 
          content: `I've noticed ${patientName || 'the patient'}'s glucose is dropping. Action required: ${analysisData.caregiverAction}\n\nHow can I assist you further?` 
        }
      ]);
    }
  }, [analysisData, patientName]);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    const newMessages = [...messages, { role: 'user' as const, content: userMessage }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          contextData: { ...analysisData, patientName }
        })
      });
      
      const data = await res.json();
      if (data.reply) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Connection error. Please call emergency services if the patient is unresponsive.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 p-4 rounded-full bg-brand-500 hover:bg-brand-400 text-slate-900 shadow-[0_0_20px_rgba(45,212,191,0.4)] transition-all z-40 group print:hidden"
        >
          <MessageSquare size={24} className="group-hover:scale-110 transition-transform" />
          {analysisData?.riskLevel === 'high' && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-slate-900"></span>
            </span>
          )}
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[380px] max-w-[calc(100vw-2rem)] h-[500px] max-h-[80vh] flex flex-col bg-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl z-50 overflow-hidden print:hidden">
          
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-slate-800 to-slate-800/50 border-b border-slate-700/50">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-brand-500/20 flex items-center justify-center border border-brand-500/30">
                  <Bot size={18} className="text-brand-400" />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-slate-900"></div>
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-200">GlucoGuard Support</h3>
                <p className="text-[10px] uppercase tracking-wider text-brand-400 font-medium">Emergency AI Protocol</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-700/50 transition-colors">
              <X size={18} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-slate-500 text-sm mt-10">
                <Activity size={32} className="mx-auto mb-3 opacity-20" />
                <p>AI Assistant is ready.</p>
                <p className="text-xs mt-1">Run an analysis to pre-load patient context.</p>
              </div>
            )}

            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {m.role === 'assistant' && (
                  <div className="w-6 h-6 rounded-full bg-brand-500/20 flex-shrink-0 flex items-center justify-center mt-1 mr-2 border border-brand-500/30">
                    <Bot size={12} className="text-brand-400" />
                  </div>
                )}
                
                <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                  m.role === 'user' 
                    ? 'bg-brand-600 text-white rounded-br-none' 
                    : 'bg-slate-800/80 text-slate-200 border border-slate-700/50 rounded-bl-none shadow-[0_4px_15px_rgba(0,0,0,0.1)] leading-relaxed'
                }`}>
                  {m.content}
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="flex justify-start">
                <div className="w-6 h-6 rounded-full bg-brand-500/20 flex-shrink-0 flex items-center justify-center mt-1 mr-2 border border-brand-500/30">
                  <Bot size={12} className="text-brand-400" />
                </div>
                <div className="max-w-[80%] rounded-2xl px-4 py-3 bg-slate-800/80 border border-slate-700/50 rounded-bl-none flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-bounce"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} className="p-3 bg-slate-800/50 border-t border-slate-700/50">
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 focus-within:border-brand-500/50 rounded-full px-4 py-1.5 transition-colors shadow-inner">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask for guidance..."
                className="flex-1 bg-transparent border-none focus:outline-none text-sm text-slate-200 placeholder-slate-500 py-1"
              />
              <button 
                type="submit" 
                disabled={!input.trim() || loading}
                className="text-brand-400 hover:text-brand-300 disabled:opacity-50 disabled:cursor-not-allowed p-1.5 bg-brand-500/10 hover:bg-brand-500/20 rounded-full transition-colors"
                title="Send Message"
              >
                <Send size={16} />
              </button>
            </div>
          </form>

        </div>
      )}
    </>
  );
}
