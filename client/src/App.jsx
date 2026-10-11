import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { HeaderBanner } from './components/HeaderBanner';
import { Sidebar } from './components/Sidebar';
import { TopNavbar } from './components/TopNavbar';
import { DashboardView } from './components/DashboardView';
import { AddMedicineView } from './components/AddMedicineView';
import { MyMedicinesView } from './components/MyMedicinesView';
import { RemindersView } from './components/RemindersView';
import { ProfileView } from './components/ProfileView';
import { SmartBoxView } from './components/SmartBoxView';
import { FlowchartView } from './components/FlowchartView';
import { LandingPage } from './components/LandingPage';
import { NotificationModal } from './components/NotificationModal';
import { AuthModal } from './components/AuthModal';
import { api } from './services/api';

const MainApp = () => {
  const { user } = useAuth();
  const [activeView, setActiveView] = useState('dashboard'); // 'landing' or 'dashboard'
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'medicines', 'add-medicine', 'reminders', 'smartbox', 'flowchart', 'profile'
  
  // Data states
  const [todayData, setTodayData] = useState({
    stats: { total: 3, taken: 1, pending: 2 },
    reminders: []
  });
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modals
  const [alertModalOpen, setAlertModalOpen] = useState(false);
  const [activeAlertReminder, setActiveAlertReminder] = useState(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');

  // Load dashboard data from MongoDB
  const loadData = async () => {
    try {
      setLoading(true);
      const [todayRes, medsRes] = await Promise.all([
        api.getTodayReminders().catch(() => null),
        api.getMedicines().catch(() => [])
      ]);

      if (todayRes) {
        setTodayData(todayRes);
      }
      if (medsRes) {
        setMedicines(medsRes);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  // Handle Mark as Taken toggle
  const handleMarkTaken = async (id, status = 'Taken') => {
    try {
      // Optimistic update
      setTodayData(prev => {
        const nextReminders = prev.reminders.map(r => r._id === id ? { ...r, status, takenAt: status === 'Taken' ? new Date() : null } : r);
        const takenCount = nextReminders.filter(r => r.status === 'Taken').length;
        const pendingCount = nextReminders.filter(r => r.status === 'Pending').length;
        return {
          ...prev,
          stats: {
            ...prev.stats,
            taken: takenCount,
            pending: pendingCount
          },
          reminders: nextReminders
        };
      });

      await api.updateReminderStatus(id, status);
      loadData();
    } catch (err) {
      console.error('Failed to update reminder status:', err);
      loadData();
    }
  };

  // Trigger alert modal (Screen 4)
  const handleTriggerAlert = (reminder = null) => {
    const targetRem = reminder || todayData.reminders.find(r => r.status === 'Pending') || {
      medicineName: 'Vitamin D',
      dosage: '1 capsule',
      time: '12:00 PM',
      compartment: 2
    };
    setActiveAlertReminder(targetRem);
    setAlertModalOpen(true);
  };

  // Listen to profile navigation custom event
  useEffect(() => {
    const handleNavProfile = () => {
      setActiveView('dashboard');
      setActiveTab('profile');
    };
    window.addEventListener('nav-to-profile', handleNavProfile);
    return () => window.removeEventListener('nav-to-profile', handleNavProfile);
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAF9] flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* 1. Header Banner matching top green banner from reference images */}
      <HeaderBanner
        activeView={activeView}
        setActiveView={(v) => {
          if (v === 'smartbox') {
            setActiveView('dashboard');
            setActiveTab('smartbox');
          } else {
            setActiveView(v);
          }
        }}
      />

      {/* 2. Main View: Landing Page or Dashboard */}
      {activeView === 'landing' ? (
        <LandingPage
          onGetStarted={() => {
            setActiveView('dashboard');
            setActiveTab('dashboard');
          }}
          onOpenAuth={(mode) => {
            setAuthModalMode(mode);
            setAuthModalOpen(true);
          }}
        />
      ) : (
        <div className="flex-1 flex overflow-hidden">
          {/* Dashboard Left Sidebar */}
          <div className="hidden lg:block">
            <Sidebar
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              onTriggerAlert={() => handleTriggerAlert()}
              todayStats={todayData.stats}
            />
          </div>

          {/* Dashboard Main Content Area */}
          <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
            {/* Top Dashboard Header Navbar */}
            <TopNavbar
              onTriggerAlert={() => handleTriggerAlert()}
              pendingReminders={todayData.reminders.filter(r => r.status === 'Pending')}
              onMarkTaken={handleMarkTaken}
            />

            {/* Mobile Tab Navigation Bar */}
            <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-2 flex space-x-2 overflow-x-auto">
              {[
                { id: 'dashboard', label: 'Dashboard' },
                { id: 'medicines', label: 'Medicines' },
                { id: 'add-medicine', label: '+ Add' },
                { id: 'reminders', label: 'Reminders' },
                { id: 'smartbox', label: 'Smart Box' },
                { id: 'flowchart', label: 'Workflow' },
                { id: 'profile', label: 'Profile' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-[#0F3E38] text-white'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* View Switcher based on active tab */}
            <main className="p-4 sm:p-6 lg:p-8 flex-1 max-w-7xl mx-auto w-full">
              {activeTab === 'dashboard' && (
                <DashboardView
                  todayData={todayData}
                  onMarkTaken={handleMarkTaken}
                  onTriggerAlert={handleTriggerAlert}
                  onViewAll={() => setActiveTab('reminders')}
                  onAddMedicine={() => setActiveTab('add-medicine')}
                  onRefresh={loadData}
                  loading={loading}
                />
              )}

              {activeTab === 'add-medicine' && (
                <AddMedicineView
                  onSuccess={() => {
                    loadData();
                    setActiveTab('dashboard');
                  }}
                  onCancel={() => setActiveTab('dashboard')}
                />
              )}

              {activeTab === 'medicines' && (
                <MyMedicinesView
                  medicines={medicines}
                  onRefresh={loadData}
                  onNavigateAdd={() => setActiveTab('add-medicine')}
                />
              )}

              {activeTab === 'reminders' && (
                <RemindersView
                  reminders={todayData.reminders}
                  onMarkTaken={handleMarkTaken}
                  onRefresh={loadData}
                />
              )}

              {activeTab === 'smartbox' && (
                <SmartBoxView
                  todayData={todayData}
                  onMarkTaken={handleMarkTaken}
                  onRefresh={loadData}
                />
              )}

              {activeTab === 'flowchart' && (
                <FlowchartView
                  onNavigate={(target) => {
                    if (target === 'landing') setActiveView('landing');
                    else if (target === 'alert') handleTriggerAlert();
                    else setActiveTab(target);
                  }}
                />
              )}

              {activeTab === 'profile' && (
                <ProfileView onRefreshData={loadData} />
              )}
            </main>
          </div>
        </div>
      )}

      {/* Screen 4 Reminder Notification Modal */}
      <NotificationModal
        isOpen={alertModalOpen}
        onClose={() => setAlertModalOpen(false)}
        reminder={activeAlertReminder}
        onMarkTaken={(id) => handleMarkTaken(id, 'Taken')}
      />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authModalMode}
        onSuccess={() => {
          setActiveView('dashboard');
          loadData();
        }}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
