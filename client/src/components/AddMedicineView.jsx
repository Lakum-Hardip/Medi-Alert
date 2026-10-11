import React, { useState } from 'react';
import { Pill, Calendar, Clock, Box, Check, AlertCircle, ArrowLeft } from 'lucide-react';
import { api } from '../services/api';
import confetti from 'canvas-confetti';
import { sound } from '../utils/sound';

export const AddMedicineView = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    frequency: 'Once daily',
    startDate: new Date().toISOString().split('T')[0],
    reminderTimes: ['08:00 AM'],
    compartment: 1,
    instructions: 'Take after meals with water',
    color: '#10B981'
  });

  const [customTime, setCustomTime] = useState('08:00');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const frequencies = [
    { label: 'Once daily', times: ['08:00 AM'] },
    { label: 'Twice daily', times: ['08:00 AM', '08:00 PM'] },
    { label: 'Three times daily', times: ['08:00 AM', '02:00 PM', '08:00 PM'] },
    { label: 'Every 8 hours', times: ['06:00 AM', '02:00 PM', '10:00 PM'] },
    { label: 'Every 12 hours', times: ['08:00 AM', '08:00 PM'] },
    { label: 'As needed', times: ['10:00 AM'] }
  ];

  const handleFrequencyChange = (e) => {
    const val = e.target.value;
    const matched = frequencies.find(f => f.label === val);
    setFormData({
      ...formData,
      frequency: val,
      reminderTimes: matched ? matched.times : ['08:00 AM']
    });
  };

  const handleAddCustomTime = () => {
    if (!customTime) return;
    const [hh, mm] = customTime.split(':');
    const hourNum = parseInt(hh, 10);
    const period = hourNum >= 12 ? 'PM' : 'AM';
    const displayHour = hourNum % 12 === 0 ? 12 : hourNum % 12;
    const formatted = `${String(displayHour).padStart(2, '0')}:${mm} ${period}`;

    if (!formData.reminderTimes.includes(formatted)) {
      setFormData({
        ...formData,
        reminderTimes: [...formData.reminderTimes, formatted]
      });
    }
  };

  const handleRemoveTime = (timeToRemove) => {
    if (formData.reminderTimes.length <= 1) return;
    setFormData({
      ...formData,
      reminderTimes: formData.reminderTimes.filter(t => t !== timeToRemove)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim()) {
      setError('Please enter a medicine name');
      return;
    }
    if (!formData.dosage.trim()) {
      setError('Please specify the dosage (e.g., 1 tablet)');
      return;
    }

    try {
      setSubmitting(true);
      await api.createMedicine(formData);
      sound.playSuccessSound();
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 }
      });
      setSuccessMsg('Medicine saved successfully to MongoDB and smart box synced!');
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 900);
    } catch (err) {
      setError(err.message || 'Failed to save medicine');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Top Breadcrumb & Title Matching Screen 3 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <Pill className="w-5 h-5 text-[#0F3E38]" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Add New Medicine
            </h2>
            <p className="text-xs md:text-sm text-slate-500">
              Enter medicine details to set reminders.
            </p>
          </div>
        </div>

        {onCancel && (
          <button
            onClick={onCancel}
            className="text-xs text-slate-500 hover:text-slate-800 flex items-center space-x-1 font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>
        )}
      </div>

      {/* Form Card matching Screen 3 styling */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 shadow-xs">
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2">
            <Check className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* 1. Medicine Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Medicine Name
            </label>
            <input
              type="text"
              placeholder="e.g. Paracetamol"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0F3E38] focus:border-transparent text-sm bg-slate-50/50"
              required
            />
          </div>

          {/* 2. Dosage */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Dosage
            </label>
            <input
              type="text"
              placeholder="e.g. 1 tablet"
              value={formData.dosage}
              onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0F3E38] focus:border-transparent text-sm bg-slate-50/50"
              required
            />
          </div>

          {/* 3. Frequency */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Frequency
            </label>
            <select
              value={formData.frequency}
              onChange={handleFrequencyChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0F3E38] focus:border-transparent text-sm bg-slate-50/50 text-slate-800"
            >
              {frequencies.map((f) => (
                <option key={f.label} value={f.label}>
                  {f.label}
                </option>
              ))}
            </select>
          </div>

          {/* 4. Start Date */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Start Date
            </label>
            <div className="relative">
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0F3E38] focus:border-transparent text-sm bg-slate-50/50"
              />
            </div>
          </div>

          {/* 5. Reminder Times Slots */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Reminder Times
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.reminderTimes.map((time, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-xl text-xs font-bold"
                >
                  <Clock className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
                  {time}
                  {formData.reminderTimes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveTime(time)}
                      className="ml-2 text-emerald-600 hover:text-red-500 font-bold"
                    >
                      ×
                    </button>
                  )}
                </span>
              ))}
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="time"
                value={customTime}
                onChange={(e) => setCustomTime(e.target.value)}
                className="px-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50"
              />
              <button
                type="button"
                onClick={handleAddCustomTime}
                className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-xl font-semibold"
              >
                + Add Time Slot
              </button>
            </div>
          </div>

          {/* 6. Smart Box Compartment Slot Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Smart Box Compartment Slot (1 to 6)
            </label>
            <div className="grid grid-cols-6 gap-2">
              {[1, 2, 3, 4, 5, 6].map((slotNum) => {
                const isSelected = formData.compartment === slotNum;
                return (
                  <button
                    key={slotNum}
                    type="button"
                    onClick={() => setFormData({ ...formData, compartment: slotNum })}
                    className={`py-3 rounded-xl border text-center transition-all ${
                      isSelected
                        ? 'bg-[#0F3E38] text-white border-[#0F3E38] font-bold shadow-md ring-2 ring-emerald-300'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 font-medium'
                    }`}
                  >
                    <div className="text-xs">Slot</div>
                    <div className="text-lg font-bold">{slotNum}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 7. Instructions / Notes */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Special Instructions
            </label>
            <input
              type="text"
              placeholder="e.g. Take with water after breakfast"
              value={formData.instructions}
              onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0F3E38] focus:border-transparent text-sm bg-slate-50/50"
            />
          </div>

          {/* Save Button Matching Screen 3 */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#0F3E38] hover:bg-[#15544c] active:scale-[0.99] text-white font-bold py-3.5 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 text-sm tracking-wide"
            >
              {submitting ? (
                <span>Saving to MongoDB...</span>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Save Medicine</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
