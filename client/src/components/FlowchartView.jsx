import React from 'react';
import { 
  Globe, 
  UserPlus, 
  Pill, 
  Clock, 
  Bell, 
  CheckCircle, 
  TrendingUp, 
  Heart, 
  ArrowDown, 
  ArrowRight,
  ShieldCheck,
  Smartphone,
  Sliders,
  Check
} from 'lucide-react';

export const FlowchartView = ({ onNavigate }) => {
  const steps = [
    {
      step: 1,
      title: 'User Visits Website',
      description: 'Opens MediAlert in browser and lands on the home page.',
      icon: Globe,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-300',
      actionText: 'View Landing Page',
      target: 'landing'
    },
    {
      step: 2,
      title: 'User Signs Up / Logs In',
      description: 'Creates an account or logs in to existing account.',
      icon: UserPlus,
      color: 'bg-indigo-50 text-indigo-700 border-indigo-300',
      actionText: 'Manage Profile',
      target: 'profile'
    },
    {
      step: 3,
      title: 'Adds Medicine Details',
      description: 'Enters medicine name, dosage, frequency, and timings.',
      icon: Pill,
      color: 'bg-teal-50 text-teal-700 border-teal-300',
      actionText: 'Add New Medicine',
      target: 'add-medicine'
    },
    {
      step: 4,
      title: 'Sets Reminders',
      description: 'System saves the schedule and sets notifications.',
      icon: Clock,
      color: 'bg-amber-50 text-amber-700 border-amber-300',
      actionText: 'View Schedule',
      target: 'reminders'
    },
    {
      step: 5,
      title: 'Gets Notifications',
      description: 'User receives alerts at the set time (on website / device).',
      icon: Bell,
      color: 'bg-blue-50 text-blue-700 border-blue-300',
      actionText: 'Simulate Notification',
      target: 'alert'
    },
    {
      step: 6,
      title: 'Marks as Taken',
      description: 'User confirms the medicine is taken.',
      icon: CheckCircle,
      color: 'bg-rose-50 text-rose-700 border-rose-300',
      actionText: 'Check Dashboard',
      target: 'dashboard'
    },
    {
      step: 7,
      title: 'Track & Monitor',
      description: 'User can view history, upcoming reminders, and manage medicines from the dashboard.',
      icon: TrendingUp,
      color: 'bg-purple-50 text-purple-700 border-purple-300',
      actionText: 'View Analytics',
      target: 'dashboard'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
          Architecture & Workflow
        </span>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          FLOW CHART – HOW THE WEBSITE WORKS
        </h2>
        <p className="text-sm text-slate-500 max-w-xl mx-auto">
          From first visit to daily adherence: follow the complete user journey powering the MediAlert Smart Medicine Reminder Box.
        </p>
      </div>

      {/* Vertical Timeline Workflow matching Image 2 */}
      <div className="relative max-w-2xl mx-auto space-y-4">
        {steps.map((item, index) => {
          const Icon = item.icon;
          return (
            <React.Fragment key={item.step}>
              <div className={`rounded-2xl border-2 p-5 shadow-xs transition-all hover:shadow-md flex items-center justify-between gap-4 ${item.color}`}>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-2xl bg-white shadow-xs flex items-center justify-center shrink-0 border border-slate-200">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white/80 border">
                        Step {item.step}
                      </span>
                      <h4 className="text-base font-bold text-slate-900">{item.title}</h4>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">{item.description}</p>
                  </div>
                </div>

                <button
                  onClick={() => onNavigate(item.target)}
                  className="shrink-0 text-xs font-bold bg-white text-slate-800 hover:bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl transition shadow-xs flex items-center space-x-1"
                >
                  <span>{item.actionText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {index < steps.length - 1 && (
                <div className="flex justify-center my-1 text-slate-400">
                  <ArrowDown className="w-5 h-5 animate-bounce" />
                </div>
              )}
            </React.Fragment>
          );
        })}

        {/* Final Target Node */}
        <div className="mt-6 p-6 rounded-3xl bg-gradient-to-r from-[#0F3E38] to-[#165a52] text-white text-center shadow-xl border border-emerald-500/30">
          <Heart className="w-8 h-8 mx-auto mb-2 text-rose-400 fill-rose-400" />
          <h3 className="text-lg font-bold tracking-tight">Better Health & Safety</h3>
          <p className="text-xs text-emerald-100 max-w-md mx-auto mt-1">
            Regular reminders help users stay on track, maintain 100% adherence, and live healthier lives.
          </p>
          <div className="mt-3 font-serif-italic text-sm text-amber-300">
            "Small Reminder, Big Difference ♡"
          </div>
        </div>
      </div>
    </div>
  );
};
