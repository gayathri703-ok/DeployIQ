// ─────────────────────────────────────────────────────────────
// store/authStore.js  ·  Zustand global auth state
// ─────────────────────────────────────────────────────────────
import { create } from 'zustand';
import api, { authAPI } from '../api/axios';

const useAuthStore = create((set, get) => ({
  user:    null,
  token:   localStorage.getItem('diq_token') || null,
  loading: false,
  ready:   false,   // true once initial /me check is done

  /* ── Bootstrap: verify saved token ── */
  bootstrap: async () => {
    const token = localStorage.getItem('diq_token');
    if (!token) { set({ ready: true }); return; }
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    try {
      const { data } = await authAPI.me();
      set({ user: data.user, token, ready: true });
    } catch {
      localStorage.removeItem('diq_token');
      set({ user: null, token: null, ready: true });
    }
  },

  /* ── Login ── */
  login: async (email, password) => {
    set({ loading: true });
    try {
      const { data } = await authAPI.login({ email, password });
      localStorage.setItem('diq_token', data.token);
      api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      set({ user: data.user, token: data.token, loading: false });
      return { ok: true };
    } catch (err) {
      set({ loading: false });
      return { ok: false, message: err.response?.data?.message || 'Login failed' };
    }
  },

  /* ── Register ── */
  register: async (name, email, password) => {
    set({ loading: true });
    try {
      const { data } = await authAPI.register({ name, email, password });
      localStorage.setItem('diq_token', data.token);
      api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      set({ user: data.user, token: data.token, loading: false });
      return { ok: true };
    } catch (err) {
      set({ loading: false });
      return { ok: false, message: err.response?.data?.message || 'Registration failed' };
    }
  },

  /* ── Logout ── */
  logout: () => {
    localStorage.removeItem('diq_token');
    delete api.defaults.headers.common['Authorization'];
    set({ user: null, token: null });
  },
}));

export default useAuthStore;