import React, { useState } from 'react';
import { Bell, ChevronDown, User, LogOut, CheckCircle, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const TopNavbar = ({ onTriggerAlert, pendingReminders = [], onMarkTaken }) => {
  const { user, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  // Dynamic greeting based on current hour
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const displayName = user?.name || 'Sandip Punani';
  const firstName = displayName.split(' ')[0] || 'Sandip';
  const avatarText = user?.avatar || 'SP';

  return (
    <header className="bg-white border-b border-slate-200/80 px-6 py-4 flex items-center justify-between shadow-xs">
      {/* Dynamic Greeting */}
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight">
          {getGreeting()}, <span className="text-[#0F3E38]">{firstName}!</span>
        </h2>
        <p className="text-xs md:text-sm text-slate-500 mt-0.5">
          Here's your medicine schedule for today.
        </p>
      </div>

      {/* Right Controls: Notifications & User Avatar */}
      <div className="flex items-center space-x-4">
        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2.5 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Notifications"
          >
            <Bell className="w-5 h-5 text-slate-700" />
            {pendingReminders.length > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-amber-500 rounded-full ring-2 ring-white"></span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 py-3 z-50">
              <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                <span className="text-sm font-bold text-slate-800">Pending Reminders</span>
                <span className="text-xs bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded-full">
                  {pendingReminders.length} pending
                </span>
              </div>
              <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
                {pendingReminders.length === 0 ? (
                  <div className="px-4 py-6 text-center text-xs text-slate-400 flex flex-col items-center">
                    <CheckCircle className="w-8 h-8 text-emerald-400 mb-2" />
                    All medicines taken for today! Great job!
                  </div>
                ) : (
                  pendingReminders.map((rem) => (
                    <div key={rem._id} className="p-3 hover:bg-slate-50 flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-slate-800">{rem.medicineName}</div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-amber-600" /> {rem.time} • {rem.dosage}
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          onMarkTaken(rem._id);
                          setShowNotifications(false);
                        }}
                        className="text-[11px] font-semibold bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1 rounded-lg shadow-xs"
                      >
                        Take
                      </button>
                    </div>
                  ))
                )}
              </div>
              <div className="p-2 border-t border-slate-100">
                <button
                  onClick={() => {
                    setShowNotifications(false);
                    onTriggerAlert();
                  }}
                  className="w-full text-center text-xs font-semibold text-emerald-700 hover:text-emerald-800 py-1"
                >
                  Trigger Screen 4 Alert Popup
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown matching Reference */}
        <div className="relative">
          <button
            onClick={() => setShowUserDropdown(!showUserDropdown)}
            className="flex items-center space-x-2.5 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
          >
            <div className="w-9 h-9 rounded-full bg-[#0F3E38] text-white flex items-center justify-center font-bold text-xs tracking-wider shadow-sm ring-2 ring-emerald-100">
              {avatarText}
            </div>
            <span className="hidden sm:inline text-sm font-semibold text-slate-700">
              {displayName}
            </span>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>

          {showUserDropdown && (
            <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900">{displayName}</p>
                <p className="text-[11px] text-slate-500 truncate">{user?.email || 'sandip123@gmail.com'}</p>
              </div>
              <button
                onClick={() => {
                  setShowUserDropdown(false);
                  window.dispatchEvent(new CustomEvent('nav-to-profile'));
                }}
                className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center space-x-2"
              >
                <User className="w-3.5 h-3.5 text-slate-500" />
                <span>My Profile</span>
              </button>
              <button
                onClick={() => {
                  setShowUserDropdown(false);
                  logout();
                }}
                className="w-full px-4 py-2 text-left text-xs text-red-600 hover:bg-red-50 flex items-center space-x-2"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
