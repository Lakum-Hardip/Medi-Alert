import React, { useEffect, useState } from 'react';
import { Bell, Check, Clock, Volume2, X, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../utils/sound';

export const NotificationModal = ({ isOpen, onClose, reminder, onMarkTaken }) => {
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setCurrentDate(now.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }));
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isOpen) {
      sound.playReminderChime();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const defaultMedicine = {
    medicineName: 'Vitamin D',
    dosage: '1 capsule',
    time: '12:00 PM',
    compartment: 2
  };

  const activeRem = reminder || defaultMedicine;

  const handleTaken = () => {
    sound.playSuccessSound();
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 }
    });
    if (reminder?._id && onMarkTaken) {
      onMarkTaken(reminder._id);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-700 bg-gradient-to-b from-[#0a2f2b] to-[#041a18] text-white">
        
        {/* Top Phone Status bar simulation */}
        <div className="pt-3 px-6 flex justify-between items-center text-xs text-emerald-200/60 font-medium">
          <span>MediAlert OS</span>
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Box Connected</span>
          </div>
        </div>

        {/* Big Time Header matching Screen 4: "12:00 PM", "Tue, 12 Aug" */}
        <div className="text-center pt-6 pb-6 px-4">
          <div className="text-4xl md:text-5xl font-extrabold tracking-tight text-white font-mono">
            {activeRem.time || currentTime || '12:00 PM'}
          </div>
          <div className="text-sm font-medium text-emerald-200/80 mt-1">
            {currentDate || 'Tue, 12 Aug'}
          </div>
        </div>

        {/* Screen 4 Notification Card */}
        <div className="mx-4 mb-6 bg-white/95 backdrop-blur-md rounded-2xl p-5 text-slate-800 shadow-xl border border-white/20">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              {/* MediAlert App Logo Badge */}
              <div className="w-10 h-10 rounded-xl bg-[#0F3E38] text-white flex items-center justify-center relative shadow-sm">
                <svg className="w-5 h-5 transform -rotate-45" viewBox="0 0 48 48" fill="none">
                  <rect x="6" y="16" width="36" height="16" rx="8" fill="#FFFFFF" />
                  <path d="M24 16H34C38.4183 16 42 19.5817 42 24C42 28.4183 38.4183 32 34 32H24V16Z" fill="#10B981" />
                </svg>
                <div className="absolute -bottom-1 -right-1 bg-amber-400 rounded-full p-0.5">
                  <Bell className="w-2 h-2 text-slate-900" />
                </div>
              </div>

              <div>
                <h4 className="font-bold text-sm text-[#0F3E38]">MediAlert</h4>
                <p className="text-[11px] text-slate-500 font-medium">Smart Box Push</p>
              </div>
            </div>

            <span className="text-[11px] text-slate-400 font-semibold bg-slate-100 px-2 py-0.5 rounded-full">
              Now
            </span>
          </div>

          <div className="mt-3.5 pt-3 border-t border-slate-100">
            <p className="text-sm font-semibold text-slate-800">
              Time for your medicine!
            </p>
            <div className="mt-1 flex items-center justify-between">
              <span className="text-base font-bold text-emerald-800">
                {activeRem.medicineName} - {activeRem.dosage}
              </span>
              <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md border border-emerald-300">
                Box Slot #{activeRem.compartment || 2}
              </span>
            </div>
          </div>

          {/* Compartment visual indicator prompt */}
          <div className="mt-3 bg-amber-50 rounded-xl p-2.5 border border-amber-200 flex items-center space-x-2 text-xs text-amber-900">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping"></div>
            <span>Smart Box compartment #{activeRem.compartment || 2} LED is glowing green!</span>
          </div>

          {/* Action Button: "Mark as Taken" matching reference Screen 4 */}
          <div className="mt-4 flex flex-col space-y-2">
            <button
              onClick={handleTaken}
              className="w-full bg-[#0F3E38] hover:bg-[#165a52] active:scale-[0.98] text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
            >
              <Check className="w-4 h-4" />
              <span>Mark as Taken</span>
            </button>

            <div className="flex space-x-2">
              <button
                onClick={() => {
                  sound.playReminderChime();
                }}
                className="flex-1 text-xs py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg flex items-center justify-center space-x-1"
              >
                <Volume2 className="w-3.5 h-3.5 text-slate-600" />
                <span>Repeat Chime</span>
              </button>
              <button
                onClick={onClose}
                className="flex-1 text-xs py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg"
              >
                Snooze 10 min
              </button>
            </div>
          </div>
        </div>

        {/* Close Modal X button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 rounded-full text-slate-400 hover:text-white bg-slate-800/60"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
