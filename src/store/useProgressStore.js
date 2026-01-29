import { create } from "zustand";
import { getLocal, setLocal } from "../hooks/useLocalStorage";

export const useProgressStore = create((set, get) => ({
  notes: {},

  getNotes: key => {
    return getLocal(key, []);
  },

  saveNote: (key, note) => {
    const existing = getLocal(key, []);
    const updated = [...existing, note];
    setLocal(key, updated);

    set(state => ({
      notes: {
        ...state.notes,
        [key]: updated
      }
    }));
  },

  getProgress: key => {
    const value = localStorage.getItem(key);
    return value ? Number(value) : 0;
  },

  setProgress: (key, time) => {
    localStorage.setItem(key, time);
  }
}));
