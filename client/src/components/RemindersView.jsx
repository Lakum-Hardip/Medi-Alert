import React, { useState } from 'react';
import { Bell, CheckCircle, Clock, Calendar, Check, Filter } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../utils/sound';

export const RemindersView = ({ reminders, onMarkTaken, onRefresh }) => {
  const [filter, setFilter] = useState('ALL');

  const filtered = reminders.filter((r) => {
    if (filter === 'PENDING') return r.status === 'Pending';
    if (filter === 'TAKEN') return r.status === 'Taken';
    return true;
  });

  const handleToggle = (rem) => {
    const nextStatus = rem.status === 'Taken' ? 'Pending' : 'Taken';
    if (nextStatus === 'Taken') {
      sound.playSuccessSound();
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    }
    onMarkTaken(rem._id, nextStatus);
  };

  const total = reminders.length;
  const taken = reminders.filter(r => r.status === 'Taken').length;
  const adherence = total > 0 ? Math.round((taken / total) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Schedule & Reminders</h2>
          <p className="text-xs md:text-sm text-slate-500">
            Real-time adherence timeline and daily medicine dosing schedule.
          </p>
        </div>

        {/* Adherence Badge */}
        <div className="flex items-center space-x-3 bg-white px-4 py-2.5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-right">
            <div className="text-xs font-semibold text-slate-500">Adherence Score</div>
            <div className="text-base font-extrabold text-emerald-700">{adherence}% on track</div>
          </div>
          <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
            {taken}/{total}
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2 border-b border-slate-200 pb-3">
        {['ALL', 'PENDING', 'TAKEN'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filter === tab
                ? 'bg-[#0F3E38] text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {tab === 'ALL' ? `All (${total})` : tab === 'PENDING' ? `Pending (${total - taken})` : `Taken (${taken})`}
          </button>
        ))}
      </div>

      {/* Timeline List */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs divide-y divide-slate-100 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Bell className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            <p className="text-sm">No reminders matching the selected filter.</p>
          </div>
        ) : (
          filtered.map((rem) => {
            const isTaken = rem.status === 'Taken';
            return (
              <div
                key={rem._id}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div
                    onClick={() => handleToggle(rem)}
                    className="cursor-pointer transition-transform active:scale-90"
                  >
                    {isTaken ? (
                      <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center border border-emerald-300">
                        <CheckCircle className="w-5 h-5 text-emerald-600" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200">
                        <Clock className="w-5 h-5 text-amber-500" />
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold text-slate-900">{rem.medicineName}</span>
                      <span className="text-xs text-slate-500 font-medium">• {rem.dosage}</span>
                      <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded-md">
                        Box Slot #{rem.compartment || 1}
                      </span>
                    </div>

                    <div className="text-xs text-slate-500 flex items-center space-x-3 mt-1">
                      <span className="font-bold text-slate-800 font-mono flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" /> {rem.time}
                      </span>
                      {rem.takenAt && (
                        <span className="text-emerald-700 font-medium">
                          Confirmed taken at {new Date(rem.takenAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleToggle(rem)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center space-x-1.5 self-start sm:self-auto ${
                    isTaken
                      ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-300'
                      : 'bg-amber-100 text-amber-800 hover:bg-amber-200 border border-amber-300'
                  }`}
                >
                  {isTaken ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Taken</span>
                    </>
                  ) : (
                    <>
                      <Clock className="w-3.5 h-3.5" />
                      <span>Mark as Taken</span>
                    </>
                  )}
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
