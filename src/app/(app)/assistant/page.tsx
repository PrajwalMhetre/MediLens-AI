'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useChatMessages, useSendChatMessage } from '@/lib/hooks/use-api';
import {
  Bot,
  Send,
  Sparkles,
  Copy,
  RotateCw,
  ThumbsUp,
  ThumbsDown,
  BookOpen,
  User,
  Plus,
  MessageSquare,
  ShieldAlert,
} from 'lucide-react';
import { toast } from 'sonner';

export default function AssistantPage() {
  const { data: messages } = useChatMessages();
  const sendChatMessageMutation = useSendChatMessage();

  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);

  const suggestedPrompts = [
    'What does a focal lower lobe opacity indicate on a chest radiograph?',
    'Explain the difference between T2 and FLAIR hyperintensity in brain MRI.',
    'How do I interpret TI-RADS category 4 thyroid ultrasound nodules?',
    'Summarize patient PT-88392 radiologist report findings.',
  ];

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    setInput('');
    setSending(true);
    try {
      await sendChatMessageMutation.mutateAsync(query);
    } catch (err) {
      toast.error('Failed to send chat message.');
    } finally {
      setSending(false);
    }
  };

  const copyMessage = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied AI response to clipboard.');
  };

  return (
    <div className="h-[calc(100vh-7rem)] flex flex-col md:flex-row gap-4 animate-in fade-in">
      {/* Sidebar: Conversation Threads & Prompts */}
      <div className="w-full md:w-64 flex-shrink-0 flex flex-col border-r border-slate-200 dark:border-slate-800 pr-0 md:pr-4 space-y-4">
        <Button className="w-full justify-start gap-2 text-xs">
          <Plus className="h-4 w-4" />
          <span>New Conversation</span>
        </Button>

        <div className="flex-1 overflow-y-auto space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Recent Threads</p>
          <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold flex items-center gap-2 cursor-pointer">
            <MessageSquare className="h-4 w-4" />
            <span className="truncate">Radiology & Clinical QA</span>
          </div>
        </div>

        {/* Clinical Disclaimer */}
        <div className="p-3 rounded-xl border border-purple-500/30 bg-purple-950/20 text-[10px] text-purple-300/80 leading-relaxed">
          <ShieldAlert className="h-4 w-4 text-purple-400 mb-1" />
          MediLens Assistant provides clinical decision support. Always verify guidelines.
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900/90 overflow-hidden shadow-xl">
        {/* Chat Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 p-0.5 flex-shrink-0">
              <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center text-purple-400">
                <Bot className="h-5 w-5" />
              </div>
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">MediLens Assistant</h3>
              <p className="text-[10px] text-slate-400">Trained on ACR Criteria, PubMed & Diagnostic Radiology Guidelines</p>
            </div>
          </div>

          <Badge variant="accent" className="gap-1 text-[10px]">
            <Sparkles className="h-3 w-3" />
            <span>LLM v4.2</span>
          </Badge>
        </div>

        {/* Message Stream Scroll Container */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages?.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'assistant' && (
                <div className="h-8 w-8 rounded-full bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 flex-shrink-0 mt-0.5">
                  <Bot className="h-4 w-4" />
                </div>
              )}

              <div className={`max-w-xl space-y-2 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                <div
                  className={`p-4 rounded-2xl text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-cyan-500 text-white font-medium rounded-tr-none shadow-md shadow-cyan-500/20'
                      : 'bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-tl-none'
                  }`}
                >
                  {msg.content}
                </div>

                {/* Sources & Citations if available */}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <BookOpen className="h-3 w-3 text-cyan-400" />
                      Clinical Sources & Citations
                    </p>
                    <div className="space-y-1">
                      {msg.sources.map((src, i) => (
                        <div key={i} className="p-2 rounded-lg bg-slate-950/60 border border-slate-800 text-[10px] space-y-0.5">
                          <p className="font-semibold text-cyan-300">{src.title}</p>
                          <p className="text-slate-400 leading-tight">{src.snippet}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Assistant Action Buttons */}
                {msg.sender === 'assistant' && (
                  <div className="flex items-center gap-2 text-slate-400 text-[10px] pt-1">
                    <button onClick={() => copyMessage(msg.content)} className="hover:text-cyan-400 flex items-center gap-1">
                      <Copy className="h-3 w-3" />
                      <span>Copy</span>
                    </button>
                    <button onClick={() => handleSend(msg.content)} className="hover:text-cyan-400 flex items-center gap-1">
                      <RotateCw className="h-3 w-3" />
                      <span>Regenerate</span>
                    </button>
                    <button onClick={() => toast.success('Feedback recorded')} className="hover:text-emerald-400">
                      <ThumbsUp className="h-3 w-3" />
                    </button>
                    <button onClick={() => toast.info('Feedback recorded')} className="hover:text-rose-400">
                      <ThumbsDown className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </div>

              {msg.sender === 'user' && (
                <div className="h-8 w-8 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 flex-shrink-0 mt-0.5 text-xs font-bold">
                  DR
                </div>
              )}
            </div>
          ))}

          {sending && (
            <div className="flex items-center gap-2 text-xs text-purple-400">
              <Bot className="h-4 w-4 animate-bounce" />
              <span>Synthesizing response from clinical knowledge base...</span>
            </div>
          )}
        </div>

        {/* Suggested Quick Prompts Grid */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 space-y-2">
          <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            <Sparkles className="h-3 w-3 text-cyan-400" />
            <span>Suggested Clinical Questions</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {suggestedPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-cyan-500/40 hover:text-cyan-400 transition-colors text-[11px]"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 bg-white dark:bg-slate-950"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask MediLens Assistant about imaging criteria, findings, or guidelines..."
            className="flex-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
          />
          <Button type="submit" disabled={sending || !input.trim()} size="sm" className="gap-1.5 text-xs">
            <Send className="h-3.5 w-3.5" />
            <span>Send</span>
          </Button>
        </form>
      </div>
    </div>
  );
}
