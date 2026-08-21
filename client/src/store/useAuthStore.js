import { create } from 'zustand';
import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const useAuthStore = create((set, get) => ({
  token: typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null,
  admin: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('adminUser') || 'null') : null,
  isAuthenticated: typeof window !== 'undefined' ? !!localStorage.getItem('adminToken') : false,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_BASE}/api/admin/login`, { email, password });
      const { token, admin } = response.data;

      if (typeof window !== 'undefined') {
        localStorage.setItem('adminToken', token);
        localStorage.setItem('adminUser', JSON.stringify(admin));
      }

      set({
        token,
        admin,
        isAuthenticated: true,
        isLoading: false,
        error: null
      });

      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed. Please check server connection.';
      set({
        isLoading: false,
        error: errorMessage
      });
      return { success: false, error: errorMessage };
    }
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
    }
    set({
      token: null,
      admin: null,
      isAuthenticated: false,
      error: null
    });
  },

  checkAuth: async () => {
    const { token } = get();
    if (!token) {
      set({ isAuthenticated: false, admin: null, isLoading: false });
      return false;
    }

    set({ isLoading: true });
    try {
      const response = await axios.get(`${API_BASE}/api/admin/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set({
        admin: response.data,
        isAuthenticated: true,
        isLoading: false
      });
      return true;
    } catch (err) {
      get().logout();
      set({ isLoading: false });
      return false;
    }
  }
}));

export default useAuthStore;
