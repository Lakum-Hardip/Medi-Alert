import React, { useState } from 'react';
import { Pill, Trash2, Edit2, Plus, Clock, Box, Check, AlertCircle } from 'lucide-react';
import { api } from '../services/api';
import { sound } from '../utils/sound';

export const MyMedicinesView = ({ medicines, onRefresh, onNavigateAdd }) => {
  const [editingMed, setEditingMed] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [msg, setMsg] = useState(null);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;
    try {
      setDeletingId(id);
      await api.deleteMedicine(id);
      sound.playSuccessSound();
      setMsg(`Deleted ${name} successfully.`);
      if (onRefresh) onRefresh();
    } catch (err) {
      setMsg('Failed to delete medicine');
    } finally {
      setDeletingId(null);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.updateMedicine(editingMed._id, editingMed);
      sound.playSuccessSound();
      setMsg('Medicine updated successfully!');
      setEditingMed(null);
      if (onRefresh) onRefresh();
    } catch (err) {
      setMsg('Failed to update medicine');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">My Medicines</h2>
          <p className="text-xs md:text-sm text-slate-500">
            View, manage, and configure your prescribed medications and pill box slots.
          </p>
        </div>

        <button
          onClick={onNavigateAdd}
          className="bg-[#0F3E38] hover:bg-[#15544c] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs flex items-center space-x-2 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Medicine</span>
        </button>
      </div>

      {msg && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{msg}</span>
        </div>
      )}

      {/* Grid of Medicines */}
      {medicines.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 text-slate-400">
          <Pill className="w-12 h-12 mx-auto mb-3 text-slate-300" />
          <h4 className="text-base font-bold text-slate-700">No medicines found</h4>
          <p className="text-xs text-slate-500 mt-1 mb-4">Add your daily medications to start receiving reminders.</p>
          <button
            onClick={onNavigateAdd}
            className="text-xs font-bold bg-[#0F3E38] text-white px-4 py-2 rounded-xl"
          >
            Add Medicine
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {medicines.map((med) => (
            <div
              key={med._id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100/70 text-emerald-800 flex items-center justify-center font-bold">
                      <Pill className="w-5 h-5 text-[#0F3E38]" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-900">{med.name}</h4>
                      <p className="text-xs font-semibold text-slate-500">{med.dosage}</p>
                    </div>
                  </div>

                  <span className="text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-lg">
                    Slot #{med.compartment || 1}
                  </span>
                </div>

                <div className="mt-4 space-y-2 text-xs text-slate-600">
                  <div className="flex items-center justify-between py-1 border-t border-slate-100">
                    <span className="font-medium text-slate-500">Frequency:</span>
                    <span className="font-semibold text-slate-800">{med.frequency}</span>
                  </div>

                  <div className="flex items-start justify-between py-1 border-t border-slate-100">
                    <span className="font-medium text-slate-500">Scheduled:</span>
                    <span className="font-semibold text-emerald-700">
                      {med.reminderTimes?.join(', ') || '08:00 AM'}
                    </span>
                  </div>

                  {med.instructions && (
                    <div className="pt-1 text-[11px] text-slate-500 italic bg-slate-50 p-2 rounded-lg">
                      "{med.instructions}"
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
                <button
                  onClick={() => setEditingMed(med)}
                  className="p-2 text-slate-500 hover:text-[#0F3E38] hover:bg-slate-100 rounded-lg transition"
                  title="Edit Medicine"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(med._id, med.name)}
                  disabled={deletingId === med._id}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                  title="Delete Medicine"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingMed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Edit Medicine</h3>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Medicine Name</label>
                <input
                  type="text"
                  value={editingMed.name}
                  onChange={(e) => setEditingMed({ ...editingMed, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Dosage</label>
                <input
                  type="text"
                  value={editingMed.dosage}
                  onChange={(e) => setEditingMed({ ...editingMed, dosage: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Compartment Slot (1-6)</label>
                <input
                  type="number"
                  min="1"
                  max="6"
                  value={editingMed.compartment}
                  onChange={(e) => setEditingMed({ ...editingMed, compartment: Number(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-xl text-sm"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingMed(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-[#0F3E38] text-white rounded-xl hover:bg-[#15544c]"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
