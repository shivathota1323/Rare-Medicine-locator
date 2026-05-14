import { create } from "zustand";
import api from "../api/axiosInstance.js";

export const useAuth = create((set) => ({
  currentUser: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  login: async (credentials) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post("/auth/login", credentials);
      localStorage.setItem("rareMedicineToken", res.data.token);
      set({
        currentUser: res.data.payload,
        isAuthenticated: true,
        loading: false,
        error: null
      });
      return res.data.payload;
    } catch (err) {
      const message = err.response?.data?.message || "Login failed";
      set({ loading: false, error: message, isAuthenticated: false, currentUser: null });
      throw new Error(message);
    }
  },
  register: async (payload) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post("/auth/register", payload);
      set({ loading: false, error: null });
      return res.data.payload;
    } catch (err) {
      const message = err.response?.data?.message || "Registration failed";
      set({ loading: false, error: message });
      throw new Error(message);
    }
  },
  logout: async () => {
    try {
      await api.get("/auth/logout");
    } finally {
      localStorage.removeItem("rareMedicineToken");
      set({ currentUser: null, isAuthenticated: false, loading: false, error: null });
    }
  },
  checkAuth: async () => {
    const token = localStorage.getItem("rareMedicineToken");
    if (!token) {
      set({ loading: false });
      return;
    }

    set({ loading: true });
    try {
      const res = await api.get("/auth/check-auth");
      set({
        currentUser: res.data.payload,
        isAuthenticated: true,
        loading: false
      });
    } catch {
      localStorage.removeItem("rareMedicineToken");
      set({ currentUser: null, isAuthenticated: false, loading: false });
    }
  }
}));
