import React from 'react';
import { Bell, Sparkles } from 'lucide-react';

export const HeaderBanner = ({ activeView, setActiveView }) => {
  return (
    <header className="bg-[#0F3E38] text-white px-4 md:px-8 py-3.5 shadow-md flex flex-wrap items-center justify-between border-b border-[#1b5850] sticky top-0 z-40">
      {/* Brand & Subtitle */}
      <div className="flex items-center space-x-3.5 cursor-pointer" onClick={() => setActiveView('landing')}>
        {/* Pill with Bell Icon matching Reference Logo */}
        <div className="relative flex items-center justify-center w-11 h-11 bg-white/10 rounded-2xl border border-emerald-400/30 backdrop-blur-sm shadow-inner group">
          <svg className="w-7 h-7 transform -rotate-45" viewBox="0 0 48 48" fill="none">
            <rect x="6" y="16" width="36" height="16" rx="8" fill="#FFFFFF" />
            <path d="M24 16H34C38.4183 16 42 19.5817 42 24C42 28.4183 38.4183 32 34 32H24V16Z" fill="#10B981" />
            <line x1="24" y1="16" x2="24" y2="32" stroke="#0F3E38" strokeWidth="2" />
          </svg>
          <div className="absolute -bottom-1 -right-1 bg-amber-400 text-slate-900 rounded-full p-1 shadow-md animate-bounce">
            <Bell className="w-3.5 h-3.5 fill-slate-900 text-slate-900" />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-baseline sm:space-x-3">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold tracking-tight text-white font-['Plus_Jakarta_Sans']">
              Medi<span className="text-emerald-400">Alert</span>
            </span>
            <span className="hidden sm:inline-block text-emerald-400/50 text-xl font-light">|</span>
          </div>
          <span className="text-sm md:text-base font-medium text-emerald-100 tracking-wide">
            Smart Medicine Reminder Box
          </span>
        </div>
      </div>

      {/* Right Taglines & Quick Navigation */}
      <div className="flex items-center space-x-4 mt-2 sm:mt-0">
        <div className="hidden lg:flex items-center space-x-2 text-xs md:text-sm font-serif-italic text-emerald-200/90 tracking-wider bg-white/5 px-3 py-1 rounded-full border border-emerald-500/20">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Better Reminders • Healthier Tomorrow</span>
        </div>

        <div className="flex items-center space-x-2 bg-emerald-950/60 p-1 rounded-xl border border-emerald-800/60 text-xs font-medium">
          <button
            onClick={() => setActiveView('landing')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeView === 'landing'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow'
                : 'text-emerald-200 hover:text-white hover:bg-white/5'
            }`}
          >
            Landing
          </button>
          <button
            onClick={() => setActiveView('dashboard')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeView === 'dashboard'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow'
                : 'text-emerald-200 hover:text-white hover:bg-white/5'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveView('smartbox')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeView === 'smartbox'
                ? 'bg-amber-400 text-slate-950 font-bold shadow'
                : 'text-amber-200 hover:text-white hover:bg-white/5'
            }`}
          >
            Smart Box
          </button>
        </div>
      </div>
    </header>
  );
};
