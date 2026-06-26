import { create } from 'zustand';

// Helper functions for safe localStorage operations
const loadFromStorage = (key, defaultValue) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error);
    return defaultValue;
  }
};

const saveToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
};

export const useStore = create((set) => ({
  user: loadFromStorage('super_app_user', null),
  selectedCategories: loadFromStorage('super_app_categories', []),
  notes: loadFromStorage('super_app_notes', "This is how I am going to learn MERN Stack in next 3 months.\n'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo conse Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."),
  timerSeconds: 0,
  isTimerRunning: false,
  timerInitialSeconds: 0,

  registerUser: (user) => {
    saveToStorage('super_app_user', user);
    set({ user });
  },

  setCategories: (selectedCategories) => {
    saveToStorage('super_app_categories', selectedCategories);
    set({ selectedCategories });
  },

  updateNotes: (notes) => {
    saveToStorage('super_app_notes', notes);
    set({ notes });
  },

  setTimerSeconds: (timerSeconds) => {
    set({ timerSeconds });
  },

  setTimerRunning: (isTimerRunning) => {
    set({ isTimerRunning });
  },

  setTimerInitialSeconds: (timerInitialSeconds) => {
    set({ timerInitialSeconds });
  },

  clearStore: () => {
    localStorage.removeItem('super_app_user');
    localStorage.removeItem('super_app_categories');
    localStorage.removeItem('super_app_notes');
    set({
      user: null,
      selectedCategories: [],
      notes: '',
      timerSeconds: 0,
      isTimerRunning: false,
      timerInitialSeconds: 0,
    });
  },
}));
