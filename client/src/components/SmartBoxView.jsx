import React, { useState, useEffect } from 'react';
import { Cpu, Bell, Battery, Wifi, Check, Sparkles, Volume2, ShieldCheck, RefreshCw } from 'lucide-react';
import { api } from '../services/api';
import { sound } from '../utils/sound';
import confetti from 'canvas-confetti';

export const SmartBoxView = ({ onMarkTaken, todayData, onRefresh }) => {
  const [boxData, setBoxData] = useState(null);
  const [dispensingSlot, setDispensingSlot] = useState(null);
  const [alarmActive, setAlarmActive] = useState(false);
  const [currentTime, setCurrentTime] = useState('10:00 AM');

  useEffect(() => {
    const fetchBox = async () => {
      try {
        const res = await api.getSmartBoxStatus();
        setBoxData(res);
      } catch (err) {
        console.error('Failed to load box status:', err);
      }
    };

    fetchBox();
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 1000);

    return () => clearInterval(timer);
  }, [todayData]);

  const handleTestAlarm = async () => {
    setAlarmActive(true);
    sound.playReminderChime();
    setTimeout(() => {
      setAlarmActive(false);
    }, 3500);
  };

  const handleDispense = async (slot) => {
    setDispensingSlot(slot);
    sound.playSuccessSound();
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 }
    });

    try {
      await api.markTakenByBox(slot);
      if (onRefresh) onRefresh();
    } catch (err) {
      console.warn('Could not mark taken via box endpoint:', err);
    } finally {
      setTimeout(() => setDispensingSlot(null), 1500);
    }
  };

  const reminders = todayData?.reminders || [];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            MediBox X8 • Smart Dispenser Simulator
          </h2>
          <p className="text-xs md:text-sm text-slate-500">
            Simulates the real IoT Smart Medicine Reminder Box connected via Wi-Fi.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleTestAlarm}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 shadow-sm ${
              alarmActive
                ? 'bg-red-500 text-white animate-pulse'
                : 'bg-amber-400 hover:bg-amber-300 text-slate-950'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>{alarmActive ? 'Alarm Sounding!' : 'Test Box Alarm'}</span>
          </button>
        </div>
      </div>

      {/* 3D-styled Smart Medicine Box Device Render */}
      <div className="relative bg-gradient-to-b from-slate-100 to-slate-200 border-4 border-slate-300 rounded-[40px] p-8 shadow-2xl overflow-hidden max-w-2xl mx-auto">
        {/* Device Brand & Camera/Sensors */}
        <div className="flex items-center justify-between mb-4 px-2 text-xs font-bold text-slate-500">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>MediAlert IoT v2.4</span>
          </div>
          <div className="flex items-center space-x-3 text-slate-600">
            <span className="flex items-center gap-1 font-mono text-[11px]">
              <Wifi className="w-3.5 h-3.5 text-emerald-600" /> Connected
            </span>
            <span className="flex items-center gap-1 font-mono text-[11px]">
              <Battery className="w-3.5 h-3.5 text-emerald-600" /> 94%
            </span>
          </div>
        </div>

        {/* Device OLED Display Screen (Matching "10:00 AM" with Bell from Image 1 & 2) */}
        <div className="mx-auto w-64 bg-slate-950 rounded-2xl p-4 shadow-inner border border-slate-800 text-center relative mb-6">
          <div className="flex items-center justify-center space-x-3">
            <span className="text-3xl font-extrabold text-emerald-400 font-mono tracking-widest drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]">
              {currentTime}
            </span>
            <div className={`p-1 rounded-full ${alarmActive ? 'bg-amber-400 text-slate-950 animate-bounce' : 'text-amber-400'}`}>
              <Bell className="w-5 h-5 fill-current" />
            </div>
          </div>
          <div className="text-[10px] text-emerald-300/80 font-mono mt-1 tracking-wider uppercase">
            {alarmActive ? '*** MEDICINE DUE NOW ***' : 'NEXT: 12:00 PM VITAMIN D'}
          </div>
        </div>

        {/* Transparent Compartment Window with 6 Slots (Matching Screenshot) */}
        <div className="bg-slate-900/10 backdrop-blur-md rounded-3xl p-4 border-2 border-slate-300/80 shadow-inner">
          <div className="grid grid-cols-6 gap-2">
            {[1, 2, 3, 4, 5, 6].map((slot) => {
              const rem = reminders.find(r => r.compartment === slot);
              const isPending = rem && rem.status === 'Pending';
              const isTaken = rem && rem.status === 'Taken';
              const isDispensing = dispensingSlot === slot;

              // Color capsules per slot
              const pillColors = [
                ['bg-red-400', 'bg-yellow-300'],
                ['bg-amber-400', 'bg-orange-500'],
                ['bg-emerald-400', 'bg-blue-400'],
                ['bg-blue-500', 'bg-purple-400'],
                ['bg-pink-400', 'bg-rose-500'],
                ['bg-teal-400', 'bg-emerald-300']
              ];

              return (
                <div
                  key={slot}
                  className={`relative rounded-2xl p-2.5 flex flex-col justify-between items-center text-center transition-all min-h-[170px] border-2 ${
                    isDispensing
                      ? 'bg-emerald-300 border-emerald-500 scale-105 shadow-xl ring-4 ring-emerald-400'
                      : isPending
                      ? 'bg-amber-50 border-amber-400 shadow-md ring-2 ring-amber-300/80'
                      : isTaken
                      ? 'bg-emerald-50/70 border-emerald-200'
                      : 'bg-white/80 border-slate-200'
                  }`}
                >
                  {/* Slot Number & LED Indicator */}
                  <div className="w-full flex justify-between items-center text-[11px] font-bold">
                    <span className="text-slate-500">#{slot}</span>
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        isPending
                          ? 'bg-amber-400 animate-ping'
                          : isTaken
                          ? 'bg-emerald-500'
                          : 'bg-slate-300'
                      }`}
                    ></span>
                  </div>

                  {/* Visual Pill Capsule inside Transparent Window */}
                  <div className="my-auto py-2 flex flex-col items-center">
                    <div className="flex -space-x-1 mb-1">
                      <div className={`w-3.5 h-7 rounded-full shadow-xs ${pillColors[slot - 1][0]}`}></div>
                      <div className={`w-3.5 h-7 rounded-full shadow-xs ${pillColors[slot - 1][1]}`}></div>
                    </div>
                    <span className="text-[11px] font-bold text-slate-800 truncate max-w-[70px]">
                      {rem ? rem.medicineName : `Slot ${slot}`}
                    </span>
                    <span className="text-[9px] text-slate-500 truncate max-w-[70px]">
                      {rem ? rem.dosage : 'Empty'}
                    </span>
                  </div>

                  {/* Dispense / Take Button */}
                  <button
                    onClick={() => handleDispense(slot)}
                    className={`w-full py-1 rounded-lg text-[10px] font-bold transition shadow-xs ${
                      isPending
                        ? 'bg-[#0F3E38] hover:bg-[#15544c] text-white'
                        : isTaken
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                    }`}
                  >
                    {isDispensing ? 'Opening...' : isPending ? 'Take Now' : isTaken ? 'Taken ✓' : 'Open'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Physical Front Control Buttons */}
        <div className="mt-5 flex items-center justify-center space-x-6">
          <div className="w-3 h-3 rounded-full bg-slate-400"></div>
          <button
            onClick={() => handleDispense(2)}
            className="w-12 h-12 rounded-full bg-white border-2 border-slate-300 shadow-md font-bold text-xs text-slate-700 active:scale-95 flex items-center justify-center hover:bg-slate-50"
          >
            OK
          </button>
          <div className="w-3 h-3 rounded-full bg-slate-400"></div>
        </div>
      </div>
    </div>
  );
};
