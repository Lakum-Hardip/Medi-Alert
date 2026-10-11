import React from 'react';
import { 
  LayoutDashboard, 
  Pill, 
  PlusCircle, 
  Bell, 
  User, 
  LogOut, 
  Cpu, 
  Workflow, 
  Sparkles,
  Wifi
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Sidebar = ({ activeTab, setActiveTab, onTriggerAlert, todayStats }) => {
  const { logout } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'medicines', label: 'My Medicines', icon: Pill },
    { id: 'add-medicine', label: 'Add Medicine', icon: PlusCircle },
    { id: 'reminders', label: 'Reminders', icon: Bell, badge: todayStats?.pending },
    { id: 'smartbox', label: 'Smart Box', icon: Cpu, accent: true },
    { id: 'flowchart', label: 'How It Works', icon: Workflow },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <aside className="w-64 bg-[#0F3E38] text-white flex flex-col min-h-screen border-r border-[#174d46] select-none">
      {/* Brand Logo inside Sidebar */}
      <div className="p-6 border-b border-emerald-900/60 flex items-center space-x-3">
        <div className="relative flex items-center justify-center w-10 h-10 bg-emerald-800/40 rounded-xl border border-emerald-500/40">
          <svg className="w-6 h-6 transform -rotate-45" viewBox="0 0 48 48" fill="none">
            <rect x="6" y="16" width="36" height="16" rx="8" fill="#FFFFFF" />
            <path d="M24 16H34C38.4183 16 42 19.5817 42 24C42 28.4183 38.4183 32 34 32H24V16Z" fill="#10B981" />
          </svg>
          <div className="absolute -bottom-1 -right-1 bg-amber-400 rounded-full p-0.5">
            <Bell className="w-2.5 h-2.5 text-slate-900" />
          </div>
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white font-['Plus_Jakarta_Sans']">
            Medi<span className="text-emerald-400">Alert</span>
          </h1>
          <p className="text-[11px] text-emerald-300/70 font-medium tracking-wider uppercase">
            Smart Box Sync
          </p>
        </div>
      </div>

      {/* Nav Menu Items */}
      <nav className="flex-1 px-4 py-6 space-y-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-[#185e54] text-white shadow-inner font-semibold border-l-4 border-emerald-400 pl-3'
                  : 'text-emerald-100/80 hover:bg-emerald-900/40 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-300' : 'text-emerald-300/70'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge > 0 && (
                <span className="bg-amber-500 text-slate-950 text-xs font-bold px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
              {item.accent && !isActive && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Quick Interactive Alert Trigger button for testing Screen 4! */}
      <div className="px-4 py-3">
        <button
          onClick={onTriggerAlert}
          className="w-full group bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs py-2.5 px-3 rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2"
        >
          <Bell className="w-4 h-4 text-slate-950 animate-bounce" />
          <span>Simulate Alarm (Screen 4)</span>
        </button>
      </div>

      {/* Device Connection Telemetry & Logout */}
      <div className="p-4 border-t border-emerald-900/60 bg-[#092925]/60 space-y-3">
        <div className="bg-emerald-950/70 border border-emerald-800/60 rounded-xl p-3 text-xs">
          <div className="flex items-center justify-between text-emerald-200 mb-1">
            <span className="font-semibold flex items-center gap-1.5">
              <Wifi className="w-3.5 h-3.5 text-emerald-400" /> MediBox X8
            </span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded-full border border-emerald-500/30">
              Online
            </span>
          </div>
          <div className="flex justify-between text-emerald-400/80 text-[11px]">
            <span>Battery: 94%</span>
            <span>6 Compartments</span>
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-emerald-200/70 hover:bg-red-500/10 hover:text-red-300 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};
