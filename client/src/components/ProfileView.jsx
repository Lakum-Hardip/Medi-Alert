import React, { useState } from 'react';
import { User, Mail, Phone, Calendar, Lock, Bell, ChevronRight, Check, ShieldCheck, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { sound } from '../utils/sound';

export const ProfileView = ({ onRefreshData }) => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || 'Sandip Punani',
    mobile: user?.mobile || '+91 98765 43210',
    dob: user?.dob || '12 Jan 2000'
  });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);
  const [reseedLoading, setReseedLoading] = useState(false);

  // Settings toggles
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [syncEnabled, setSyncEnabled] = useState(true);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    try {
      await updateProfile(formData);
      sound.playSuccessSound();
      setMsg('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      setMsg('Error saving profile');
    } finally {
      setSaving(false);
    }
  };

  const handleReseed = async () => {
    if (!window.confirm('Reset all medicines and reminders back to the reference demo state?')) return;
    setReseedLoading(true);
    try {
      await api.seedDemo();
      sound.playSuccessSound();
      setMsg('Database reset to original reference state (Sandip Punani, Paracetamol, Vitamin D, Calcium)!');
      if (onRefreshData) onRefreshData();
    } catch (err) {
      setMsg('Failed to reset demo data');
    } finally {
      setReseedLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Profile</h2>
        <p className="text-xs md:text-sm text-slate-500">Manage your account information and preferences.</p>
      </div>

      {msg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{msg}</span>
        </div>
      )}

      {/* Screen 5 Top Profile Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full bg-[#0F3E38] text-white flex items-center justify-center text-xl font-bold shadow-md ring-4 ring-emerald-50">
            {user?.avatar || 'SP'}
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">{user?.name || 'Sandip Punani'}</h3>
            <p className="text-xs text-slate-500 font-medium">{user?.email || 'sandip123@gmail.com'}</p>
            <span className="inline-flex items-center gap-1 mt-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              <ShieldCheck className="w-3 h-3 text-emerald-600" /> Verified Patient
            </span>
          </div>
        </div>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className="text-xs font-bold text-[#0F3E38] hover:bg-emerald-50 border border-[#0F3E38]/20 px-4 py-2 rounded-xl transition-all"
        >
          {isEditing ? 'Cancel' : 'Edit'}
        </button>
      </div>

      {/* Screen 5 Personal Information Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 shadow-xs">
        <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-5">
          Personal Information
        </h4>

        {isEditing ? (
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#0F3E38]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Mobile</label>
              <input
                type="text"
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#0F3E38]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Date of Birth</label>
              <input
                type="text"
                value={formData.dob}
                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#0F3E38]"
              />
            </div>
            <button
              type="submit"
              disabled={saving}
              className="w-full bg-[#0F3E38] text-white font-bold py-2.5 rounded-xl text-xs hover:bg-[#15544c]"
            >
              {saving ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            {/* Email */}
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <div className="flex items-center space-x-3 text-slate-600">
                <Mail className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-medium">Email</span>
              </div>
              <span className="text-xs font-semibold text-slate-800">
                {user?.email || 'sandip123@gmail.com'}
              </span>
            </div>

            {/* Mobile */}
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <div className="flex items-center space-x-3 text-slate-600">
                <Phone className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-medium">Mobile</span>
              </div>
              <span className="text-xs font-semibold text-slate-800">
                {user?.mobile || '+91 98765 43210'}
              </span>
            </div>

            {/* Date of Birth */}
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-3 text-slate-600">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-medium">Date of Birth</span>
              </div>
              <span className="text-xs font-semibold text-slate-800">
                {user?.dob || '12 Jan 2000'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Screen 5 Action Options: Change Password & Notification Settings */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs divide-y divide-slate-100 overflow-hidden">
        {/* Change Password row */}
        <div className="p-4 hover:bg-slate-50 flex items-center justify-between cursor-pointer">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-slate-800">Change Password</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </div>

        {/* Notification Settings row */}
        <div className="p-4 flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Bell className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-800">Sound Notifications</span>
            </div>
            <input
              type="checkbox"
              checked={soundEnabled}
              onChange={(e) => {
                setSoundEnabled(e.target.checked);
                sound.playSuccessSound();
              }}
              className="w-4 h-4 accent-[#0F3E38] cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                <RefreshCw className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-800">Auto Smart Box LED Sync</span>
            </div>
            <input
              type="checkbox"
              checked={syncEnabled}
              onChange={(e) => setSyncEnabled(e.target.checked)}
              className="w-4 h-4 accent-[#0F3E38] cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Re-seed Reference Demo State */}
      <div className="pt-2">
        <button
          onClick={handleReseed}
          disabled={reseedLoading}
          className="w-full py-3 px-4 border border-emerald-600/30 text-emerald-800 bg-emerald-50/60 hover:bg-emerald-100/80 rounded-2xl text-xs font-bold transition flex items-center justify-center space-x-2"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${reseedLoading ? 'animate-spin' : ''}`} />
          <span>Reset to Screenshot Reference State (Sandip Punani, 3 Medicines)</span>
        </button>
      </div>
    </div>
  );
};
