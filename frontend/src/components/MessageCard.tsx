'use client';

import type { Scenario } from '@/lib/api';
import { Mail, MessageSquare } from 'lucide-react';

interface MessageCardProps {
  scenario: Scenario;
}

export default function MessageCard({ scenario }: MessageCardProps) {
  const isEmail = scenario.messageType === 'email';

  const displayCategory = scenario.category
    ? scenario.category.charAt(0).toUpperCase() + scenario.category.slice(1)
    : '';

  const urlRegex = /(https?:\/\/[^\s]+)/g;

  const renderContent = (text: string) => {
    if (!text) return null;
    const parts = text.split(urlRegex);
      
    return (
      <>
        {parts.map((part, i) => {
          if (part.match(urlRegex)) {
            return (
              <a key={i} href="#" onClick={e => e.preventDefault()} className="text-blue-600 underline hover:text-blue-800 break-all cursor-pointer">
                {part}
              </a>
            );
          }
          return <span key={i}>{part}</span>;
        })}
      </>
    );
  };

  return (
    <div className="animate-slide-up mx-auto max-w-sm">
      {/* Phone Frame */}
      <div className="relative rounded-[2.5rem] border-[6px] border-slate-900 bg-white shadow-2xl overflow-hidden aspect-[9/18]">
        {/* Phone Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-5 w-24 bg-slate-900 rounded-b-xl z-10" />
        
        {/* Phone Status Bar */}
        <div className="h-10 border-b border-slate-100 flex items-end justify-between px-6 pb-2">
          <span className="text-[10px] font-bold text-slate-400">9:41</span>
          <div className="flex gap-1">
            <div className="h-2 w-2 rounded-full bg-slate-200" />
            <div className="h-2 w-2 rounded-full bg-slate-200" />
          </div>
        </div>

        {/* Message Interface */}
        <div className="h-full flex flex-col bg-slate-50">
          {/* Mock App Header */}
          <div className="flex flex-col items-center pt-6 pb-3 bg-white border-b border-slate-100 shrink-0">
             <div className={`flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold text-white mb-1 shadow-sm ${
                isEmail ? 'bg-blue-500' : 'bg-emerald-500'
              }`}>
                {scenario.senderName?.[0]?.toUpperCase() || '?'}
              </div>
              <p className="text-xs font-semibold text-slate-900">
                {scenario.senderName || 'Unknown Sender'}
              </p>
              <p className="text-[9px] text-slate-400">
                {isEmail ? 'Email' : 'Text Message'}
              </p>
          </div>

          {/* Conversation Area */}
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="mb-4 flex flex-col items-center">
               <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded">Today</span>
            </div>

            {/* Bubble */}
            <div className={`relative max-w-[85%] rounded-2xl p-3 text-sm shadow-sm ${
                isEmail 
                  ? 'bg-white border border-slate-200 text-slate-800' 
                  : 'bg-white border border-slate-200 text-slate-800'
              }`}>
              <div className="leading-relaxed whitespace-pre-wrap">
                {renderContent(scenario.content)}
              </div>
              <div className="mt-1 flex justify-end">
                <span className="text-[8px] text-slate-300">Just now</span>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="p-3 bg-white border-t border-slate-100 shrink-0">
            <div className="h-8 w-full rounded-2xl bg-slate-50 border border-slate-200" />
          </div>
          <div className="h-6 shrink-0" />
        </div>
      </div>

      {/* Type Badge (outside phone for context) */}
      <div className="mt-4 flex justify-center">
         <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
          {displayCategory || 'Security Scenario'}
        </span>
      </div>
    </div>
  );
}
