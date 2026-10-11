const API_BASE = '/api';

// Helper for HTTP requests
const request = async (endpoint, options = {}) => {
  const token = localStorage.getItem('medialert_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  };

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }
    return data;
  } catch (error) {
    console.error(`API Error on ${endpoint}:`, error);
    throw error;
  }
};

export const api = {
  // Auth
  login: (credentials) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  register: (userData) => request('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
  getProfile: () => request('/auth/me'),
  updateProfile: (profileData) => request('/auth/profile', { method: 'PUT', body: JSON.stringify(profileData) }),
  seedDemo: () => request('/auth/seed', { method: 'POST' }),

  // Medicines
  getMedicines: () => request('/medicines'),
  getMedicine: (id) => request(`/medicines/${id}`),
  createMedicine: (medData) => request('/medicines', { method: 'POST', body: JSON.stringify(medData) }),
  updateMedicine: (id, medData) => request(`/medicines/${id}`, { method: 'PUT', body: JSON.stringify(medData) }),
  deleteMedicine: (id) => request(`/medicines/${id}`, { method: 'DELETE' }),

  // Reminders
  getTodayReminders: () => request('/reminders/today'),
  getReminders: (params = '') => request(`/reminders${params ? '?' + params : ''}`),
  updateReminderStatus: (id, status) => request(`/reminders/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  }),
  markTakenByBox: (compartment) => request('/reminders/mark-taken-by-box', {
    method: 'POST',
    body: JSON.stringify({ compartment })
  }),
  getStats: () => request('/reminders/stats'),

  // Smart Box
  getSmartBoxStatus: () => request('/smartbox/status'),
  testSmartBoxAlarm: () => request('/smartbox/test-alarm', { method: 'POST' })
};
