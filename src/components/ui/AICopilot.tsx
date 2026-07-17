// src/components/ui/AICopilot.tsx
// Persistent AI Stadium Copilot with role-aware and location-aware conversational memory

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useUserStore } from '@/store/user-store';
import { useStadiumStore } from '@/store/stadium-store';
import { stadiums } from '@/data/stadiums';
import { GlassCard } from './GlassCard';
import { Sparkles, X, Send, Bot, User, HelpCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function AICopilot() {
  const pathname = usePathname();
  const { role, displayName, language, accessibility } = useUserStore();
  const { selectedStadiumId } = useStadiumStore();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const stadium = stadiums.find((s) => s.id === selectedStadiumId) || stadiums[0];

  // Auto-scroll messages to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Set default initial greeting based on user role and stadium
  useEffect(() => {
    const greetingText = `Hello ${displayName}! I am your FIFA StadiumOS AI Copilot, running on Gemini. I see you are accessing the **${stadium.name}** panel as a **${role}**. How can I assist you with logistics, emergency plans, navigation, or sustainability today?`;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMessages([{ role: 'assistant', content: greetingText }]);
  }, [role, displayName, selectedStadiumId, stadium.name]);

  // Get accessibility list
  const getAccessibilityNeeds = () => {
    const list: string[] = [];
    if (accessibility.mobility.wheelchairUser) list.push('wheelchair-accessible');
    if (accessibility.mobility.requiresElevator) list.push('requires-elevator');
    if (accessibility.visual.blind || accessibility.visual.lowVision) list.push('visual-assistance');
    if (accessibility.auditory.deaf || accessibility.auditory.hardOfHearing) list.push('hearing-assistance');
    return list;
  };

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: Message = { role: 'user', content: query };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          language,
          stadiumId: selectedStadiumId,
          module: 'chat',
          history: messages.map((m) => ({
            role: m.role === 'user' ? 'user' : 'model',
            content: m.content,
          })),
          context: {
            userRole: role,
            accessibilityNeeds: getAccessibilityNeeds(),
            currentZone: pathname,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const contentType = response.headers.get('content-type') ?? '';
      if (!contentType.includes('application/json')) {
        throw new Error('Received non-JSON response from server. The AI service may be unavailable.');
      }
      const data = await response.json();
      setMessages((prev) => [...prev, { role: 'assistant', content: data.message }]);
    } catch (error) {
      console.error('Copilot error:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Oops, I encountered a connection issue. Please check your network and try again.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getSuggestions = () => {
    switch (role) {
      case 'fan':
        return [
          'Where is the nearest restroom?',
          'How do I reach my seat?',
          'Which gate is least crowded?',
          'Where should I park?',
        ];
      case 'volunteer':
        return [
          'Provide visitor guidance translation',
          'Summarize my volunteer shift brief',
          'Emergency stampede evacuation plan',
        ];
      case 'security':
        return [
          'Generate active threat assessment',
          'Stampede crowd mitigation procedure',
          'Security dispatcher status',
        ];
      case 'organizer':
      case 'admin':
        return [
          'Executive sustainability overview',
          'Operations bottleneck summary',
          'AI System Diagnostics status',
        ];
      default:
        return ['Help me navigate', 'Where is the match info?'];
    }
  };

  return (
    <div className="fixed bottom-20 right-4 z-50 md:bottom-6 md:right-6">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-lg transition-transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          aria-label="Open AI Copilot"
        >
          <Sparkles className="h-6 w-6 animate-pulse" />
        </button>
      )}

      {/* Expanded Chat Workspace */}
      {isOpen && (
        <GlassCard
          variant="glass"
          className="flex h-[500px] w-[340px] flex-col border-emerald-500/20 bg-slate-900/95 shadow-2xl sm:w-[380px] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 bg-gradient-to-r from-emerald-600/30 to-teal-500/30">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-emerald-400" />
              <div>
                <h3 className="font-bold text-sm text-white">FIFA StadiumOS Copilot</h3>
                <p className="text-[10px] text-emerald-300 font-medium uppercase tracking-wider">
                  Gemini Active • {role} Mode
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-full p-1 text-slate-400 hover:bg-white/10 hover:text-white"
              aria-label="Close Copilot"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={cn(
                  'flex gap-2.5 max-w-[85%]',
                  msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''
                )}
              >
                <div
                  className={cn(
                    'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold',
                    msg.role === 'user'
                      ? 'bg-emerald-500 text-white'
                      : 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white'
                  )}
                >
                  {msg.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>
                <div
                  className={cn(
                    'rounded-2xl px-3.5 py-2 text-xs leading-relaxed',
                    msg.role === 'user'
                      ? 'bg-emerald-600 text-white rounded-tr-none'
                      : 'bg-white/10 text-slate-200 rounded-tl-none border border-white/5'
                  )}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-2.5 max-w-[85%]">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-emerald-600 to-teal-500 text-white text-xs">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
                <div className="rounded-2xl px-3.5 py-2 text-xs bg-white/5 text-slate-400 rounded-tl-none border border-white/5">
                  Thinking...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions */}
          <div className="px-4 py-2 border-t border-white/5 bg-slate-900/50">
            <p className="text-[10px] text-slate-500 mb-1.5 flex items-center gap-1 font-semibold">
              <HelpCircle className="h-3 w-3 text-emerald-500" /> Suggested Queries:
            </p>
            <div className="flex flex-wrap gap-1.5 max-h-[80px] overflow-y-auto">
              {getSuggestions().map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(s)}
                  disabled={loading}
                  className="rounded-full border border-emerald-500/30 bg-emerald-500/5 px-2.5 py-1 text-[10px] text-emerald-300 hover:bg-emerald-500/20 active:scale-95 disabled:pointer-events-none transition-all"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2 border-t border-white/10 bg-slate-950/80 p-3"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              placeholder={`Ask Gemini about ${stadium.name}...`}
              className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </GlassCard>
      )}
    </div>
  );
}
