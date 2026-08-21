import { create } from 'zustand';
import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const useChassisStore = create((set, get) => ({
  chassis: [],
  isLoading: false,
  isLoaded: false,
  error: null,

  // Fetch all chassis blueprints from the backend
  fetchChassis: async (force = false) => {
    // Return cached list if already loaded, unless forced
    if (get().isLoaded && !force) return get().chassis;

    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_BASE}/api/chassis`);
      set({ 
        chassis: response.data, 
        isLoading: false, 
        isLoaded: true 
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching chassis blueprints:', error);
      set({ 
        error: error.message || 'Failed to fetch chassis', 
        isLoading: false 
      });
      return [];
    }
  },

  // Update a single chassis blueprint in the local store cache
  updateChassisInCache: (updatedChassis) => {
    set((state) => {
      const index = state.chassis.findIndex(c => c.id === updatedChassis.id);
      if (index !== -1) {
        const newChassisList = [...state.chassis];
        newChassisList[index] = updatedChassis;
        return { chassis: newChassisList };
      } else {
        return { chassis: [...state.chassis, updatedChassis] };
      }
    });
  },

  // Delete a chassis blueprint from the local store cache
  removeChassisFromCache: (id) => {
    set((state) => ({
      chassis: state.chassis.filter(c => c.id !== id)
    }));
  }
}));

export default useChassisStore;
