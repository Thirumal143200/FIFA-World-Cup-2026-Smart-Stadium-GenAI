// src/app/fan/chat/page.tsx
// Fan AI Chat — Interactive Multilingual Chat room powered by Gemini
'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { useStadiumStore } from '@/store/stadium-store';
import { useUserStore } from '@/store/user-store';
import { GlassCard } from '@/components/ui/GlassCard';
import { ActionButton } from '@/components/ui/ActionButton';
import { SUPPORTED_LANGUAGES, cn } from '@/lib/utils';
import { Send, Bot } from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function FanChat() {
  const { selectedStadiumId } = useStadiumStore();
  const { role, language, setLanguage } = useUserStore();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Welcome to the Multilingual AI Assistant! I can translate or answer questions about navigation, stadium logistics, transit options, accessibility facilities, or safety protocols. Ask me anything!',
      timestamp: new Date(),
    },
  ]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const historyPayload = messages
      .slice(-10)
      .map((msg) => ({
        role: msg.role === 'user' ? 'user' as const : 'assistant' as const,
        content: msg.content,
      }));

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg.content,
          language,
          stadiumId: selectedStadiumId,
          module: 'chat',
          history: historyPayload,
          context: {
            userRole: role,
          },
        }),
      });

      const contentType = response.headers.get('content-type') ?? '';
      if (!contentType.includes('application/json')) {
        throw new Error(`Server returned ${response.status}. The chat service may be unavailable.`);
      }
      const data = await response.json();

      if (response.ok) {
        setMessages((prev) => [
          ...prev,
          {
            id: `msg-${Date.now()}-ai`,
            role: 'assistant',
            content: data.message,
            timestamp: new Date(),
          },
        ]);
      } else {
        throw new Error(data.error || 'Failed to get response');
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err);
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now()}-err`,
          role: 'assistant',
          content: `Sorry, I encountered an error: ${errMsg}. Please try again.`,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-7rem)] flex flex-col gap-4">
        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">AI Multilingual Assistant</h1>
            <p className="text-xs text-muted-foreground">Real-time answers and translations powered by Gemini</p>
          </div>

          {/* Language Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground">Select Language:</span>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="h-9 rounded-lg border border-border bg-background px-3 py-1 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {Object.entries(SUPPORTED_LANGUAGES).map(([code, name]) => (
                <option key={code} value={code}>
                  {name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Chat Interface Area */}
        <div className="flex-1 flex flex-col min-h-0 bg-card/40 border border-border rounded-2xl overflow-hidden shadow-sm">
          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  'flex gap-3 max-w-[80%]',
                  msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
                )}
              >
                {/* Avatar */}
                <div
                  className={cn(
                    'h-8 w-8 rounded-full flex items-center justify-center shrink-0 border text-xs font-semibold',
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground border-primary/20'
                      : 'bg-muted text-muted-foreground border-border'
                  )}
                >
                  {msg.role === 'user' ? 'U' : <Bot className="h-4 w-4" />}
                </div>

                <div className="space-y-1">
                  {/* Msg Bubble */}
                  <GlassCard
                    variant={msg.role === 'user' ? 'default' : 'glass'}
                    padding="sm"
                    className={cn(
                      'rounded-2xl text-sm leading-relaxed prose dark:prose-invert max-w-none',
                      msg.role === 'user' ? 'bg-primary text-primary-foreground border-primary' : 'bg-card'
                    )}
                  >
                    <p className="whitespace-pre-line">{msg.content}</p>
                  </GlassCard>

                  {/* Timestamp */}
                  <div
                    className={cn(
                      'text-[10px] text-muted-foreground px-2',
                      msg.role === 'user' ? 'text-right' : 'text-left'
                    )}
                  >
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-3 max-w-[80%] mr-auto items-center">
                <div className="h-8 w-8 rounded-full bg-muted border border-border flex items-center justify-center shrink-0">
                  <Bot className="h-4 w-4 text-muted-foreground animate-pulse" />
                </div>
                <div className="bg-card border border-border px-4 py-2.5 rounded-2xl flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce" />
                  <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:0.2s]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSend} className="p-3 border-t border-border bg-card/60 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about the stadium, tickets, transit, or security..."
              className="flex-1 h-10 px-4 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              disabled={loading}
            />
            <ActionButton
              type="submit"
              variant="fifa"
              size="icon"
              disabled={!input.trim() || loading}
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </ActionButton>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
