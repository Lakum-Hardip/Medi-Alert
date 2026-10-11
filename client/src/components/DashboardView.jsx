import React from 'react';
import { Pill, CheckCircle, Clock, ChevronRight, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../utils/sound';

export const DashboardView = ({
  todayData,
  onMarkTaken,
  onTriggerAlert,
  onViewAll,
  onAddMedicine,
  onRefresh,
  loading
}) => {
  const stats = todayData?.stats || { total: 3, taken: 1, pending: 2 };
  const reminders = todayData?.reminders || [];

  const handleToggleStatus = (reminder) => {
    const nextStatus = reminder.status === 'Taken' ? 'Pending' : 'Taken';
    if (nextStatus === 'Taken') {
      sound.playSuccessSound();
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    }
    onMarkTaken(reminder._id, nextStatus);
  };

  return (
    <div className="space-y-6">
      {/* 3 Summary Cards Matching Reference Screen 2 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Card 1: Medicines Today */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-[#EBF5F3] text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-100">
            <Pill className="w-7 h-7 transform rotate-45 text-emerald-600" />
          </div>
          <div>
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {stats.total}
            </div>
            <div className="text-sm font-semibold text-slate-500 mt-0.5">
              Medicines Today
            </div>
          </div>
        </div>

        {/* Card 2: Taken */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
            <CheckCircle className="w-7 h-7 text-emerald-500" />
          </div>
          <div>
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {stats.taken}
            </div>
            <div className="text-sm font-semibold text-slate-500 mt-0.5">
              Taken
            </div>
          </div>
        </div>

        {/* Card 3: Pending */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
            <Clock className="w-7 h-7 text-amber-500" />
          </div>
          <div>
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {stats.pending}
            </div>
            <div className="text-sm font-semibold text-slate-500 mt-0.5">
              Pending
            </div>
          </div>
        </div>
      </div>

      {/* Today's Reminders Section Matching Screen 2 */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Section Header */}
        <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
              Today's Reminders
            </h3>
            <span className="text-xs bg-slate-100 text-slate-600 font-semibold px-2 py-0.5 rounded-full">
              {reminders.length} scheduled
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onRefresh}
              disabled={loading}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              title="Refresh from MongoDB"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onViewAll}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center space-x-1"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Reminders List Table matching layout */}
        <div className="divide-y divide-slate-100">
          {reminders.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              <p className="text-sm font-medium">No reminders for today yet.</p>
              <button
                onClick={onAddMedicine}
                className="mt-3 text-xs bg-[#0F3E38] text-white px-4 py-2 rounded-xl font-bold"
              >
                Add Your First Medicine
              </button>
            </div>
          ) : (
            reminders.map((item) => {
              const isTaken = item.status === 'Taken';
              return (
                <div
                  key={item._id}
                  className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 transition-colors"
                >
                  {/* Left: Status icon, Time & Medicine Details */}
                  <div className="flex items-center space-x-4">
                    {/* Circle icon matching reference screenshot */}
                    <button
                      onClick={() => handleToggleStatus(item)}
                      title={`Click to mark as ${isTaken ? 'Pending' : 'Taken'}`}
                      className="shrink-0 transition-transform active:scale-90"
                    >
                      {isTaken ? (
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center border border-emerald-300">
                          <CheckCircle className="w-5 h-5 text-emerald-600" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center border border-amber-200">
                          <Clock className="w-5 h-5 text-amber-500" />
                        </div>
                      )}
                    </button>

                    {/* Time */}
                    <div className="w-24 text-sm font-bold text-slate-800 font-mono">
                      {item.time}
                    </div>

                    {/* Medicine Name */}
                    <div className="min-w-36">
                      <span className="text-sm font-bold text-slate-900">
                        {item.medicineName}
                      </span>
                    </div>

                    {/* Dosage */}
                    <div className="text-xs font-medium text-slate-500 min-w-24">
                      {item.dosage}
                    </div>

                    {/* Compartment Slot Badge */}
                    <div className="hidden md:inline-flex text-[11px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md border border-slate-200">
                      Slot #{item.compartment || 1}
                    </div>
                  </div>

                  {/* Right: Status Pill Button */}
                  <div className="flex items-center space-x-3 shrink-0">
                    <button
                      onClick={() => handleToggleStatus(item)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shadow-xs flex items-center space-x-1.5 ${
                        isTaken
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-300'
                          : 'bg-amber-100 text-amber-800 hover:bg-amber-200 border border-amber-300'
                      }`}
                    >
                      {isTaken ? (
                        <>
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Taken</span>
                        </>
                      ) : (
                        <>
                          <Clock className="w-3.5 h-3.5 text-amber-700" />
                          <span>Pending</span>
                        </>
                      )}
                    </button>

                    {!isTaken && (
                      <button
                        onClick={() => onTriggerAlert(item)}
                        className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1.5 rounded-lg font-medium"
                        title="Simulate reminder prompt"
                      >
                        Alert
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Interactive Smart Box Compartment Visualizer Widget */}
      <div className="bg-gradient-to-br from-[#0F3E38] to-[#072420] text-white rounded-3xl p-6 shadow-md border border-[#1b5850]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <h4 className="text-base font-bold tracking-tight">
                Live Smart Medicine Box Dispenser (MediBox X8)
              </h4>
            </div>
            <p className="text-xs text-emerald-200/80 mt-1">
              LED compartments automatically illuminate when medication is due.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-xs bg-emerald-900/80 border border-emerald-700 px-3 py-1 rounded-full text-emerald-200 font-mono">
              Clock: 10:00 AM
            </span>
            <button
              onClick={() => onTriggerAlert(reminders.find(r => r.status === 'Pending') || reminders[0])}
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs px-3.5 py-1.5 rounded-xl transition shadow"
            >
              Test Alert Screen
            </button>
          </div>
        </div>

        {/* 6 Compartment slots representation */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {[1, 2, 3, 4, 5, 6].map((slot) => {
            const remForSlot = reminders.find(r => r.compartment === slot);
            const isDue = remForSlot && remForSlot.status === 'Pending';
            const isTaken = remForSlot && remForSlot.status === 'Taken';

            return (
              <div
                key={slot}
                className={`rounded-2xl p-3 border transition-all ${
                  isDue
                    ? 'bg-amber-500/20 border-amber-400 shadow-lg scale-105 ring-2 ring-amber-400/50'
                    : isTaken
                    ? 'bg-emerald-950/60 border-emerald-700'
                    : 'bg-black/20 border-white/10'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-bold text-emerald-300">Slot {slot}</span>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isDue
                        ? 'bg-amber-400 animate-ping'
                        : isTaken
                        ? 'bg-emerald-400'
                        : 'bg-slate-600'
                    }`}
                  ></span>
                </div>

                <div className="text-center py-1">
                  <p className="text-xs font-bold truncate">
                    {remForSlot ? remForSlot.medicineName : 'Empty'}
                  </p>
                  <p className="text-[10px] text-emerald-200/70 truncate">
                    {remForSlot ? remForSlot.dosage : 'Available'}
                  </p>
                </div>

                {isDue && (
                  <button
                    onClick={() => handleToggleStatus(remForSlot)}
                    className="mt-2 w-full text-[10px] bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold py-1 rounded-lg"
                  >
                    Take Now
                  </button>
                )}
                {isTaken && (
                  <div className="mt-2 text-center text-[10px] text-emerald-400 font-semibold">
                    ✓ Dispensed
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
