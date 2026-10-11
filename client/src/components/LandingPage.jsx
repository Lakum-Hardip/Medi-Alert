import React from 'react';
import { 
  Bell, 
  Calendar, 
  Clock, 
  Heart, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  Pill, 
  Smartphone, 
  Activity, 
  Sliders, 
  UserCheck, 
  Lock,
  CheckCircle2,
  Cpu
} from 'lucide-react';

export const LandingPage = ({ onGetStarted, onOpenAuth }) => {
  return (
    <div className="min-h-screen bg-[#F8FAF9] text-slate-800">
      
      {/* 1. Top Navbar matching Screen 1 */}
      <nav className="bg-white/90 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30 px-6 lg:px-12 py-4 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="relative flex items-center justify-center w-10 h-10 bg-[#0F3E38] rounded-xl text-white shadow-sm">
            <svg className="w-6 h-6 transform -rotate-45" viewBox="0 0 48 48" fill="none">
              <rect x="6" y="16" width="36" height="16" rx="8" fill="#FFFFFF" />
              <path d="M24 16H34C38.4183 16 42 19.5817 42 24C42 28.4183 38.4183 32 34 32H24V16Z" fill="#10B981" />
            </svg>
            <div className="absolute -bottom-1 -right-1 bg-amber-400 rounded-full p-0.5">
              <Bell className="w-2.5 h-2.5 text-slate-900" />
            </div>
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900 font-['Plus_Jakarta_Sans']">
            Medi<span className="text-emerald-700">Alert</span>
          </span>
        </div>

        {/* Center Links */}
        <div className="hidden md:flex items-center space-x-8 text-sm font-semibold text-slate-600">
          <a href="#home" className="text-[#0F3E38] hover:text-emerald-700 transition">Home</a>
          <a href="#features" className="hover:text-[#0F3E38] transition">Features</a>
          <a href="#how-it-works" className="hover:text-[#0F3E38] transition">How It Works</a>
          <a href="#about" className="hover:text-[#0F3E38] transition">About</a>
        </div>

        {/* Right CTA Buttons matching Reference Screen 1 */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => onOpenAuth('login')}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition border border-slate-200"
          >
            Login
          </button>
          <button
            onClick={onGetStarted}
            className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#0F3E38] hover:bg-[#15544c] shadow-sm transition active:scale-95"
          >
            Sign Up
          </button>
        </div>
      </nav>

      {/* 2. Hero Section matching Screen 1 (Home Page / Landing Page) */}
      <section id="home" className="relative px-6 lg:px-16 pt-12 pb-20 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 bg-emerald-100/70 border border-emerald-300 text-emerald-900 px-3.5 py-1.5 rounded-full text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Smart IoT Medicine Box + Health Adherence System</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Never Miss <br />
              <span className="font-serif-italic text-[#0F3E38] font-medium">Your Medicine</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-md mx-auto lg:mx-0 font-medium">
              Smart reminders for a healthier tomorrow. Automated pill dispensing, real-time alerts, and complete peace of mind.
            </p>

            {/* Buttons matching Screen 1 */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onGetStarted}
                className="bg-[#0F3E38] hover:bg-[#165a52] active:scale-95 text-white font-bold px-7 py-3.5 rounded-xl shadow-lg transition-all flex items-center space-x-2 text-sm"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="#how-it-works"
                className="bg-white hover:bg-slate-50 text-slate-700 font-bold px-6 py-3.5 rounded-xl border border-slate-300 shadow-xs transition text-sm"
              >
                Learn More
              </a>
            </div>
          </div>

          {/* Right Product Showcase matching Screen 1 with 3D Smart Medicine Box */}
          <div className="lg:col-span-6 relative flex justify-center">
            <div className="relative group max-w-md w-full">
              {/* Soft glow background */}
              <div className="absolute -inset-4 bg-gradient-to-r from-emerald-200 to-teal-100 rounded-3xl blur-2xl opacity-60"></div>

              {/* Realistic Box Image container */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white">
                <img
                  src="/smart_box.jpg"
                  alt="MediAlert Smart Medicine Reminder Box"
                  className="w-full h-auto object-cover transform hover:scale-[1.02] transition duration-500"
                />

                {/* Floating pill badge overlay */}
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-md border border-slate-100 flex items-center space-x-2 text-xs font-bold text-slate-800">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>MediBox X8 • 10:00 AM Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Four Feature Highlights Matching Screen 1 Bottom Badges */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {/* Feature 1 */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3">
              <Calendar className="w-6 h-6 text-emerald-700" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">Set Reminders Easily</h4>
            <p className="text-xs text-slate-500 mt-1">Configure dosage, frequency & daily schedule in seconds</p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
              <Clock className="w-6 h-6 text-amber-500" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">Get Alerts On Time</h4>
            <p className="text-xs text-slate-500 mt-1">Simultaneous browser, sound, and Smart Box LED alerts</p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-3">
              <Heart className="w-6 h-6 text-rose-500 fill-rose-100" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">Stay Healthy Always</h4>
            <p className="text-xs text-slate-500 mt-1">Track 100% adherence streaks and health metrics</p>
          </div>

          {/* Feature 4 */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
              <ShieldCheck className="w-6 h-6 text-blue-600" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">Secure & Private</h4>
            <p className="text-xs text-slate-500 mt-1">Your sensitive medical data encrypted in MongoDB</p>
          </div>
        </div>
      </section>

      {/* 4. Key Features Section matching Image 1 Key Features Card */}
      <section id="features" className="py-20 bg-white border-y border-slate-200/80 px-6 lg:px-16">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
              Engineered For Care
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Key Features
            </h2>
            <p className="text-sm sm:text-base text-slate-500 max-w-xl mx-auto">
              Everything you need to ensure you or your loved ones never miss a prescription.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* 1. Easy to Use Interface */}
            <div className="p-6 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:shadow-lg transition">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-4">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Easy to Use Interface</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Simple and clean design for all age groups, including seniors and caretakers. High contrast typography and large touch targets.
              </p>
            </div>

            {/* 2. Custom Reminders */}
            <div className="p-6 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:shadow-lg transition">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-4">
                <Sliders className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Custom Reminders</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Set your own time, dosage, frequency, and compartment slots for every single medication.
              </p>
            </div>

            {/* 3. Medicine Management */}
            <div className="p-6 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:shadow-lg transition">
              <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center mb-4">
                <Pill className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Medicine Management</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Full CRUD control: add, edit, track, and categorize all medicines stored safely in the database.
              </p>
            </div>

            {/* 4. Real-time Notifications */}
            <div className="p-6 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:shadow-lg transition">
              <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center mb-4">
                <Bell className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Real-time Notifications</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Get alerts on the website, device chime sound, and physical LED blinking on the smart medicine box.
              </p>
            </div>

            {/* 5. User Profile & History */}
            <div className="p-6 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:shadow-lg transition">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center mb-4">
                <UserCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">User Profile & History</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                View your complete medicine history, adherence logs, timestamps, and health profile records.
              </p>
            </div>

            {/* 6. Secure & Private */}
            <div className="p-6 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:shadow-lg transition">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-4">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Secure & Private</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Your medical data is safe with enterprise-grade JWT authorization and encrypted password storage.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. How It Works (Flowchart Interactive Overview) */}
      <section id="how-it-works" className="py-20 px-6 lg:px-16 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
            How The Website Works
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Seamless Patient Adherence Flow
          </h2>
          <p className="text-sm text-slate-500 max-w-xl mx-auto">
            From entering your prescription to taking your pill right on time.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm mx-auto">1</div>
            <h4 className="font-bold text-slate-900">Add Medicine Details</h4>
            <p className="text-xs text-slate-500">Enter name, dosage, frequency, and choose a compartment slot in the box.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm mx-auto">2</div>
            <h4 className="font-bold text-slate-900">Sets Reminders</h4>
            <p className="text-xs text-slate-500">System schedules daily time slots and synchronizes with your hardware box.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-sm mx-auto">3</div>
            <h4 className="font-bold text-slate-900">Gets Notifications</h4>
            <p className="text-xs text-slate-500">Audio chime, visual popup, and glowing green LED on the exact compartment.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-800 flex items-center justify-center font-bold text-sm mx-auto">4</div>
            <h4 className="font-bold text-slate-900">Marks as Taken</h4>
            <p className="text-xs text-slate-500">Confirm with 1-click or box button. Logs history and maintains adherence streak!</p>
          </div>
        </div>
      </section>

      {/* 6. Call to Action Banner matching Brand */}
      <section className="px-6 lg:px-16 pb-20 max-w-6xl mx-auto">
        <div className="bg-[#0F3E38] rounded-3xl p-10 md:p-14 text-white text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 space-y-4 max-w-2xl mx-auto">
            <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Start Taking Control of Your Health Today
            </h3>
            <p className="text-emerald-100 text-sm md:text-base">
              Try the live interactive demo loaded with Sandip Punani's daily prescription schedule.
            </p>
            <div className="pt-2">
              <button
                onClick={onGetStarted}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold px-8 py-3.5 rounded-xl shadow-lg transition active:scale-95 text-sm"
              >
                Launch Dashboard Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-8 px-6 text-center text-xs text-slate-500">
        <p>© 2026 MediAlert • Smart Medicine Reminder Box. Right Medicine • Right Time • Better Health.</p>
      </footer>
    </div>
  );
};
